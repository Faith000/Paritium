import type { CurrencyPair } from "../types";
import { mockRateSets } from "../mock-data";

export function getMockQuotes(pair: CurrencyPair) {
  return mockRateSets[pair];
}

export function getMockQuoteForProvider(pair: CurrencyPair, providerId: string) {
  return mockRateSets[pair].find((quote) => quote.providerId === providerId);
}
