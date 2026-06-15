export type {
  CurrencyCode,
  CurrencyPair,
  PairOption,
  ProviderId,
  ProviderLogo,
  ProviderMetadata,
  ProviderRate,
  ProviderRateQuote,
  RatesResult
} from "./rates/types";
export { getCurrencyPairs, normalizeCurrencyPair } from "./rates/pairs";
export { fetchRates, getMockRatesResult } from "./rates/service";

import { composeProviderRates } from "./rates/compose";
import { getCurrencyPairs } from "./rates/pairs";
import { mockRateSets } from "./rates/mock-data";
import type { CurrencyPair, ProviderRate } from "./rates/types";

export function getRates(pair: CurrencyPair = "GBP_NGN") {
  return composeProviderRates(pair, mockRateSets[pair]);
}

export function getAllRates() {
  return Object.fromEntries(
    getCurrencyPairs().map((pair) => [pair.value, getRates(pair.value)])
  ) as Record<CurrencyPair, ProviderRate[]>;
}
