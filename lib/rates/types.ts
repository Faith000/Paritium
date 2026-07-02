export type CurrencyCode = "USD" | "GBP" | "EUR" | "CAD" | "NGN";

export type CurrencyPair = "USD_NGN" | "GBP_NGN" | "EUR_NGN" | "CAD_NGN";

export type PairOption = {
  value: CurrencyPair;
  label: string;
  source: CurrencyCode;
  target: CurrencyCode;
};

export type ProviderId = string;

export type ProviderLogo =
  | {
      type: "svg";
      path: string;
      color: string;
      viewBox: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "wordmark";
      text: string;
    };

export type ProviderMetadata = {
  id: ProviderId;
  provider: string;
  shortName: string;
  logo: ProviderLogo;
  websiteUrl: string;
  appStoreUrl: string;
  playStoreUrl: string;
  surveyUrl: string;
  supportedCurrencies: CurrencyCode[];
  transferMethods: string[];
};

export type ProviderRate = ProviderMetadata & {
  rate: number;
  rateLabel: string;
  transferFee: TransferFee;
  transferFeeLabel: string;
  updatedAt: string;
  stale: boolean;
  source: "live" | "mock" | "fallback";
};

export type TransferFee = {
  amount: number;
  currency: CurrencyCode;
};

export type ProviderRateQuote = {
  providerId: ProviderId;
  metadata?: ProviderMetadata;
  rate: number;
  transferFee: TransferFee;
  updatedAt: string;
  source: ProviderRate["source"];
};

export type RatesResult = {
  pair: CurrencyPair;
  refreshedAt: string;
  providers: ProviderRate[];
  sources: Array<{
    providerId: ProviderId;
    status: "live" | "mock" | "fallback" | "unavailable";
    error?: string;
  }>;
};
