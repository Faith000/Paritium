import { getCurrencyPair } from "./pairs";
import type { CurrencyPair, ProviderRateQuote, TransferFee } from "./types";

export function formatRateLabel(pair: CurrencyPair, rate: number) {
  const currencyPair = getCurrencyPair(pair);
  const source = currencyPair?.source ?? pair.split("_")[0];
  const target = currencyPair?.target ?? pair.split("_")[1];

  return `1 ${source} = ${new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(rate)} ${target}`;
}

export function isStale(updatedAt: string) {
  const updatedAtTime = new Date(updatedAt).getTime();

  if (Number.isNaN(updatedAtTime)) {
    return true;
  }

  return Date.now() - updatedAtTime > 2 * 60 * 60 * 1000;
}

export function formatTransferFee(fee: TransferFee) {
  return new Intl.NumberFormat("en", {
    currency: fee.currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency"
  }).format(fee.amount);
}

export function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function sortQuotesByRate(quotes: ProviderRateQuote[]) {
  return [...quotes].sort((a, b) => b.rate - a.rate);
}
