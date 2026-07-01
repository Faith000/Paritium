import { minutesAgo } from "./format";
import type { CurrencyPair, ProviderRateQuote } from "./types";

export const mockRateSets: Record<CurrencyPair, ProviderRateQuote[]> = {
  USD_NGN: [
    mockQuote("USD_NGN", "wise", 1542.25, 1.16, 11, false),
    mockQuote("USD_NGN", "lemfi", 1538.4, 0, 24, false),
    mockQuote("USD_NGN", "remitly", 1531.9, 1.99, 52, false),
    mockQuote("USD_NGN", "worldremit", 1518.7, 2.99, 142, true)
  ],
  GBP_NGN: [
    mockQuote("GBP_NGN", "wise", 1964.82, 0.59, 9, false),
    mockQuote("GBP_NGN", "taptap-send", 1958.1, 0, 18, false),
    mockQuote("GBP_NGN", "lemfi", 1951.55, 0, 44, false),
    mockQuote("GBP_NGN", "moneygram", 1936.02, 1.99, 132, true)
  ],
  EUR_NGN: [
    mockQuote("EUR_NGN", "remitly", 1666.14, 1.99, 16, false),
    mockQuote("EUR_NGN", "wise", 1661.72, 0.67, 29, false),
    mockQuote("EUR_NGN", "worldremit", 1648.39, 2.99, 48, false),
    mockQuote("EUR_NGN", "moneygram", 1633.4, 1.99, 127, true)
  ],
  CAD_NGN: [
    mockQuote("CAD_NGN", "lemfi", 1126.75, 0, 7, false),
    mockQuote("CAD_NGN", "wise", 1121.32, 0.87, 22, false),
    mockQuote("CAD_NGN", "remitly", 1114.9, 2.99, 58, false),
    mockQuote("CAD_NGN", "worldremit", 1102.14, 3.99, 145, true)
  ]
};

function mockQuote(
  pair: CurrencyPair,
  providerId: ProviderRateQuote["providerId"],
  rate: number,
  feeAmount: number,
  minutes: number,
  stale: boolean
): ProviderRateQuote {
  const feeCurrencyByPair: Record<CurrencyPair, ProviderRateQuote["transferFee"]["currency"]> = {
    CAD_NGN: "CAD",
    EUR_NGN: "EUR",
    GBP_NGN: "GBP",
    USD_NGN: "USD"
  };

  return {
    providerId,
    rate,
    transferFee: {
      amount: feeAmount,
      currency: feeCurrencyByPair[pair]
    },
    updatedAt: minutesAgo(minutes),
    source: stale ? "fallback" : "mock"
  };
}
