import { providerMetadata } from "../provider-metadata";
import type {
  CurrencyCode,
  ProviderId,
  ProviderMetadata,
  ProviderRateQuote,
  TransferFee
} from "../types";
import type { RateProviderConnector, RateRequest } from "./types";

type BestRatesCurrentRate = {
  computedVariableFeePercent?: number;
  destination: CurrencyCode;
  fee?: number;
  feeCurrency?: CurrencyCode;
  fetchedAt: string;
  fixedFee?: number;
  maxFeeAmount?: number;
  productAlias: string;
  promoDetails?: string;
  promoValue?: number;
  source: CurrencyCode;
  value: number;
  variableFeePercent?: number;
};

type BestRatesProduct = {
  alias: string;
  logo?: string;
  name: string;
};

type BestRatesCurrentRatesResponse = {
  data?: BestRatesCurrentRate[];
};

type BestRatesProductsResponse = {
  data?: BestRatesProduct[];
};

const RATE_CACHE_TTL_MS = 5 * 60 * 1000;
const PRODUCTS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CURRENT_RATE_ATTEMPTS = 3;

const currentRatesCache = new Map<
  string,
  {
    expiresAt: number;
    rates: BestRatesCurrentRate[];
  }
>();
const lastKnownGoodCurrentRates = new Map<string, BestRatesCurrentRate[]>();
let productsCache:
  | {
      expiresAt: number;
      products: BestRatesProduct[];
    }
  | undefined;

const aliasToProviderId: Record<string, ProviderId> = {
  lemonade: "lemfi",
  remitly: "remitly",
  taptapsend: "taptap-send",
  wise: "wise",
  wr: "worldremit"
};

export const bestRatesConnector: RateProviderConnector = {
  providerId: "best-rates",
  enabled: Boolean(getBestRatesKey()),
  async fetchRate(request, context) {
    const key = getBestRatesKey();
    const baseUrl =
      process.env.BEST_RATES_API_BASE_URL ?? "https://api.bestratesapp.com";

    if (!key) {
      throw new Error("BEST_RATES_API_KEY is not configured");
    }

    const rates = await fetchCurrentRates({
      baseUrl,
      key,
      request,
      signal: context?.signal
    });
    const products = await fetchProducts({
      baseUrl,
      key,
      signal: context?.signal
    });
    const productsByAlias = new Map(
      products.map((product) => [product.alias, product])
    );

    return rates.map((rate) =>
      normalizeBestRatesQuote({
        product: productsByAlias.get(rate.productAlias),
        rate,
        request
      })
    );
  }
};

async function fetchCurrentRates({
  baseUrl,
  key,
  request,
  signal
}: {
  baseUrl: string;
  key: string;
  request: RateRequest;
  signal?: AbortSignal;
}) {
  const cacheKey = `${request.source}_${request.target}`;
  const cachedRates = currentRatesCache.get(cacheKey);

  if (cachedRates && cachedRates.expiresAt > Date.now()) {
    return cachedRates.rates;
  }

  const url = new URL("/v1/rates/current", baseUrl);
  url.searchParams.set("source_currency", request.source);
  url.searchParams.set("destination_currency", request.target);

  let lastStatus: number | undefined;
  let lastMessage: string | undefined;

  for (let attempt = 1; attempt <= MAX_CURRENT_RATE_ATTEMPTS; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      next: {
        revalidate: 15 * 60
      },
      signal
    });

    lastStatus = response.status;

    if (response.ok) {
      const payload = (await response.json()) as BestRatesCurrentRatesResponse;
      const rates = (payload.data ?? []).filter(
        (rate) =>
          rate.productAlias &&
          Number.isFinite(rate.value) &&
          rate.source === request.source &&
          rate.destination === request.target
      );

      currentRatesCache.set(cacheKey, {
        expiresAt: Date.now() + RATE_CACHE_TTL_MS,
        rates
      });
      lastKnownGoodCurrentRates.set(cacheKey, rates);

      return rates;
    }

    const errorPayload = await readBestRatesError(response);
    lastMessage = errorPayload?.message;

    if (
      isQuotaExceeded(lastMessage) ||
      response.status < 500 ||
      attempt === MAX_CURRENT_RATE_ATTEMPTS
    ) {
      break;
    }

    await wait(250 * attempt);
  }

  const lastKnownGoodRates = lastKnownGoodCurrentRates.get(cacheKey);

  if (lastKnownGoodRates) {
    return lastKnownGoodRates;
  }

  throw new Error(
    `Best Rates current rates request failed with ${
      lastMessage ?? lastStatus ?? "unknown status"
    }`
  );
}

async function fetchProducts({
  baseUrl,
  key,
  signal
}: {
  baseUrl: string;
  key: string;
  signal?: AbortSignal;
}) {
  if (productsCache && productsCache.expiresAt > Date.now()) {
    return productsCache.products;
  }

  const url = new URL("/v1/rates/products", baseUrl);
  url.searchParams.set("key", key);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: 24 * 60 * 60
    },
    signal
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as BestRatesProductsResponse;
  const products = payload.data ?? [];

  productsCache = {
    expiresAt: Date.now() + PRODUCTS_CACHE_TTL_MS,
    products
  };

  return products;
}

function normalizeBestRatesQuote({
  product,
  rate,
  request
}: {
  product?: BestRatesProduct;
  rate: BestRatesCurrentRate;
  request: RateRequest;
}): ProviderRateQuote {
  const providerId = getProviderId(rate.productAlias);
  const metadata = createProviderMetadata({
    product,
    providerId,
    request
  });

  return {
    providerId,
    metadata,
    rate: rate.value,
    transferFee: getTransferFee(rate, request),
    updatedAt: rate.fetchedAt,
    source: "live"
  };
}

function createProviderMetadata({
  product,
  providerId,
  request
}: {
  product?: BestRatesProduct;
  providerId: ProviderId;
  request: RateRequest;
}): ProviderMetadata {
  const knownMetadata = providerMetadata[providerId];
  const provider = product?.name ?? knownMetadata?.provider ?? titleCaseProvider(providerId);
  const searchName = encodeURIComponent(`${provider} money transfer`);

  return {
    id: providerId,
    provider,
    shortName: knownMetadata?.shortName ?? getShortName(provider),
    logo: product?.logo
      ? {
          type: "image",
          src: product.logo,
          alt: `${provider} logo`
        }
      : knownMetadata?.logo ?? {
          type: "wordmark",
          text: getShortName(provider)
        },
    websiteUrl:
      knownMetadata?.websiteUrl ?? `https://www.google.com/search?q=${searchName}`,
    appStoreUrl:
      knownMetadata?.appStoreUrl ??
      `https://www.google.com/search?q=${searchName}%20app%20store`,
    playStoreUrl:
      knownMetadata?.playStoreUrl ??
      `https://www.google.com/search?q=${searchName}%20google%20play`,
    surveyUrl: knownMetadata?.surveyUrl ?? `/survey?provider=${encodeURIComponent(providerId)}`,
    supportedCurrencies: [request.source, request.target],
    transferMethods: knownMetadata?.transferMethods ?? ["Provider platform"]
  };
}

function getTransferFee(
  rate: BestRatesCurrentRate,
  request: RateRequest
): TransferFee {
  const feeCurrency = rate.feeCurrency ?? request.source;
  const fixedFee = rate.fee ?? rate.fixedFee ?? 0;
  const variableFeePercent =
    rate.computedVariableFeePercent ?? rate.variableFeePercent ?? 0;
  const variableFee =
    request.sourceAmount && variableFeePercent
      ? request.sourceAmount * (variableFeePercent / 100)
      : 0;
  const cappedVariableFee =
    rate.maxFeeAmount && variableFee
      ? Math.min(variableFee, rate.maxFeeAmount)
      : variableFee;

  return {
    amount: fixedFee + cappedVariableFee,
    currency: feeCurrency
  };
}

function getProviderId(alias: string): ProviderId {
  return aliasToProviderId[alias] ?? `best-rates-${alias}`;
}

function getBestRatesKey() {
  return process.env.BEST_RATES_API_KEY;
}

function getShortName(provider: string) {
  const words = provider.match(/[A-Za-z0-9]+/g) ?? [];

  if (words.length === 0) return "BR";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function titleCaseProvider(value: string) {
  return value
    .replace(/^best-rates-/, "")
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readBestRatesError(response: Response) {
  try {
    return (await response.json()) as { message?: string };
  } catch {
    return undefined;
  }
}

function isQuotaExceeded(message?: string) {
  return message?.toLowerCase().includes("quota exceeded") ?? false;
}
