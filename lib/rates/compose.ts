import {
  formatRateLabel,
  formatTransferFee,
  isStale,
  sortQuotesByRate
} from "./format";
import { providerMetadata } from "./provider-metadata";
import type {
  CurrencyPair,
  ProviderMetadata,
  ProviderRate,
  ProviderRateQuote
} from "./types";

export function composeProviderRates(
  pair: CurrencyPair,
  quotes: ProviderRateQuote[]
): ProviderRate[] {
  return sortQuotesByRate(quotes).map((quote) => {
    const metadata =
      quote.metadata ?? providerMetadata[quote.providerId] ?? getFallbackMetadata(quote);

    return {
      ...metadata,
      rate: quote.rate,
      rateLabel: formatRateLabel(pair, quote.rate),
      transferFee: quote.transferFee,
      transferFeeLabel: formatTransferFee(quote.transferFee),
      updatedAt: quote.updatedAt,
      stale: isStale(quote.updatedAt),
      source: quote.source
    };
  });
}

function getFallbackMetadata(quote: ProviderRateQuote): ProviderMetadata {
  const providerName = titleCaseProvider(quote.providerId);
  const searchName = encodeURIComponent(`${providerName} money transfer`);

  return {
    id: quote.providerId,
    provider: providerName,
    shortName: providerName.slice(0, 2).toUpperCase(),
    logo: {
      type: "wordmark",
      text: providerName.slice(0, 2).toUpperCase()
    },
    websiteUrl: `https://www.google.com/search?q=${searchName}`,
    appStoreUrl: `https://www.google.com/search?q=${searchName}%20app%20store`,
    playStoreUrl: `https://www.google.com/search?q=${searchName}%20google%20play`,
    surveyUrl: `/survey?provider=${encodeURIComponent(quote.providerId)}`,
    supportedCurrencies: ["GBP", "USD", "EUR", "CAD", "NGN"],
    transferMethods: ["Provider platform"]
  };
}

function titleCaseProvider(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
