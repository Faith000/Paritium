import type { CurrencyCode, ProviderId, ProviderRateQuote } from "../types";

export type RateRequest = {
  source: CurrencyCode;
  target: CurrencyCode;
  sourceAmount?: number;
};

export type RateConnectorContext = {
  signal?: AbortSignal;
};

export type RateConnectorResult =
  | {
      status: "fulfilled";
      quote: ProviderRateQuote;
    }
  | {
      status: "rejected";
      providerId: ProviderId;
      error: string;
    };

export type RateProviderConnector = {
  providerId: ProviderId;
  enabled: boolean;
  fetchRate(
    request: RateRequest,
    context?: RateConnectorContext
  ): Promise<ProviderRateQuote | ProviderRateQuote[]>;
};
