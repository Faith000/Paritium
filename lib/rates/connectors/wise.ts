import type { RateProviderConnector } from "./types";

type WiseRateResponse = {
  rate: number;
  source: string;
  target: string;
  time: string;
};

type WiseQuoteResponse = {
  paymentOptions?: Array<{
    fee?:
      | {
          total?: number | { amount?: number; value?: number };
        }
      | number;
  }>;
};

export const wiseConnector: RateProviderConnector = {
  providerId: "wise",
  enabled: Boolean(getWiseToken()),
  async fetchRate(request, context) {
    const token = getWiseToken();
    const baseUrl = process.env.WISE_API_BASE_URL ?? "https://api.wise.com";

    if (!token) {
      throw new Error("WISE_API_TOKEN or WISE_API_KEY is not configured");
    }

    const url = new URL("/v1/rates", baseUrl);
    url.searchParams.set("source", request.source);
    url.searchParams.set("target", request.target);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      next: {
        revalidate: 60 * 60
      },
      signal: context?.signal
    });

    if (!response.ok) {
      throw new Error(`Wise rates request failed with ${response.status}`);
    }

    const data = (await response.json()) as WiseRateResponse | WiseRateResponse[];
    const rate = Array.isArray(data) ? data[0] : data;

    if (!rate?.rate || !rate.time) {
      throw new Error("Wise rates response did not include rate and time");
    }

    return {
      providerId: "wise",
      rate: rate.rate,
      transferFee: {
        amount: await getWiseTransferFee({
          baseUrl,
          fallbackFee: getWiseFallbackTransferFee(request.source),
          request,
          signal: context?.signal,
          token
        }),
        currency: request.source
      },
      updatedAt: rate.time,
      source: "live"
    };
  }
};

function getWiseToken() {
  return process.env.WISE_API_TOKEN ?? process.env.WISE_API_KEY;
}

function getWiseProfileId() {
  return process.env.WISE_PROFILE_ID ?? process.env.WISE_QUOTE_PROFILE_ID;
}

async function getWiseTransferFee({
  baseUrl,
  fallbackFee,
  request,
  signal,
  token
}: {
  baseUrl: string;
  fallbackFee: number;
  request: {
    source: string;
    sourceAmount?: number;
    target: string;
  };
  signal?: AbortSignal;
  token: string;
}) {
  const profileId = getWiseProfileId();

  if (!profileId || !request.sourceAmount) {
    return fallbackFee;
  }

  try {
    const url = new URL(`/v3/profiles/${profileId}/quotes`, baseUrl);
    const response = await fetch(url, {
      body: JSON.stringify({
        payOut: "BANK_TRANSFER",
        sourceAmount: request.sourceAmount,
        sourceCurrency: request.source,
        targetCurrency: request.target
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      next: {
        revalidate: 15 * 60
      },
      signal
    });

    if (!response.ok) {
      return fallbackFee;
    }

    const quote = (await response.json()) as WiseQuoteResponse;
    const liveFee = extractWiseFee(quote);

    return liveFee ?? fallbackFee;
  } catch {
    return fallbackFee;
  }
}

function extractWiseFee(quote: WiseQuoteResponse) {
  for (const option of quote.paymentOptions ?? []) {
    const fee = option.fee;

    if (typeof fee === "number") {
      return fee;
    }

    if (typeof fee?.total === "number") {
      return fee.total;
    }

    if (typeof fee?.total?.amount === "number") {
      return fee.total.amount;
    }

    if (typeof fee?.total?.value === "number") {
      return fee.total.value;
    }
  }

  return null;
}

function getWiseFallbackTransferFee(source: string) {
  const fees: Record<string, number> = {
    CAD: 0.87,
    EUR: 0.67,
    GBP: 0.59,
    USD: 1.16
  };

  return fees[source] ?? 0;
}
