import {
  formatRateLabel,
  formatTransferFee,
  isStale,
  sortQuotesByRate
} from "./format";
import { providerMetadata } from "./provider-metadata";
import type { CurrencyPair, ProviderRate, ProviderRateQuote } from "./types";

export function composeProviderRates(
  pair: CurrencyPair,
  quotes: ProviderRateQuote[]
): ProviderRate[] {
  return sortQuotesByRate(quotes).map((quote) => {
    const metadata = providerMetadata[quote.providerId];

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
