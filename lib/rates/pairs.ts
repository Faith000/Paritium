import type { CurrencyPair, PairOption } from "./types";

export const currencyPairs = [
  { value: "GBP_NGN", label: "GBP → NGN", source: "GBP", target: "NGN" },
  { value: "USD_NGN", label: "USD → NGN", source: "USD", target: "NGN" },
  { value: "EUR_NGN", label: "EUR → NGN", source: "EUR", target: "NGN" },
  { value: "CAD_NGN", label: "CAD → NGN", source: "CAD", target: "NGN" }
] satisfies PairOption[];

export const allowedPairs = new Set<CurrencyPair>(
  currencyPairs.map((pair) => pair.value)
);

export function getCurrencyPairs() {
  return currencyPairs;
}

export function getCurrencyPair(pair: CurrencyPair) {
  return currencyPairs.find((currencyPair) => currencyPair.value === pair);
}

export function normalizeCurrencyPair(pairValue: string | null): CurrencyPair {
  return allowedPairs.has(pairValue as CurrencyPair)
    ? (pairValue as CurrencyPair)
    : "GBP_NGN";
}
