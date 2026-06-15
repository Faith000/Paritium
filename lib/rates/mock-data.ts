import { minutesAgo } from "./format";
import type { CurrencyPair, ProviderRateQuote } from "./types";

export const mockRateSets: Record<CurrencyPair, ProviderRateQuote[]> = {
  USD_NGN: [
    mockQuote("wise", 1542.25, 11, false),
    mockQuote("lemfi", 1538.4, 24, false),
    mockQuote("remitly", 1531.9, 52, false),
    mockQuote("worldremit", 1518.7, 142, true)
  ],
  GBP_NGN: [
    mockQuote("wise", 1964.82, 9, false),
    mockQuote("taptap-send", 1958.1, 18, false),
    mockQuote("lemfi", 1951.55, 44, false),
    mockQuote("moneygram", 1936.02, 132, true)
  ],
  EUR_NGN: [
    mockQuote("remitly", 1666.14, 16, false),
    mockQuote("wise", 1661.72, 29, false),
    mockQuote("worldremit", 1648.39, 48, false),
    mockQuote("moneygram", 1633.4, 127, true)
  ],
  CAD_NGN: [
    mockQuote("lemfi", 1126.75, 7, false),
    mockQuote("wise", 1121.32, 22, false),
    mockQuote("remitly", 1114.9, 58, false),
    mockQuote("worldremit", 1102.14, 145, true)
  ]
};

function mockQuote(
  providerId: ProviderRateQuote["providerId"],
  rate: number,
  minutes: number,
  stale: boolean
): ProviderRateQuote {
  return {
    providerId,
    rate,
    updatedAt: minutesAgo(minutes),
    source: stale ? "fallback" : "mock"
  };
}
