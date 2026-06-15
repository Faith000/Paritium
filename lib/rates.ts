import { siMoneygram, siWise } from "simple-icons";

export type CurrencyPair = "USD_NGN" | "GBP_NGN" | "EUR_NGN" | "CAD_NGN";

export type ProviderRate = {
  provider: string;
  shortName: string;
  logo: ProviderLogo;
  rate: number;
  rateLabel: string;
  updatedAt: string;
  stale: boolean;
  websiteUrl: string;
  appStoreUrl: string;
  playStoreUrl: string;
  surveyUrl: string;
  supportedCurrencies: string[];
  transferMethods: string[];
};

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

const now = new Date();

function minutesAgo(minutes: number) {
  return new Date(now.getTime() - minutes * 60_000).toISOString();
}

const providerLogos: Record<string, ProviderLogo> = {
  Wise: {
    type: "svg",
    path: siWise.path,
    color: `#${siWise.hex}`,
    viewBox: "0 0 24 24"
  },
  MoneyGram: {
    type: "svg",
    path: siMoneygram.path,
    color: `#${siMoneygram.hex}`,
    viewBox: "0 0 24 24"
  },
  LemFi: {
    type: "image",
    src: "/provider-logos/lemfi.svg",
    alt: "LemFi logo"
  },
  Remitly: {
    type: "image",
    src: "/provider-logos/remitly.png",
    alt: "Remitly logo"
  },
  WorldRemit: {
    type: "image",
    src: "/provider-logos/worldremit.png",
    alt: "WorldRemit logo"
  },
  "TapTap Send": {
    type: "image",
    src: "/provider-logos/taptap-send.avif",
    alt: "TapTap Send logo"
  }
};

const providerWebsites: Record<string, string> = {
  LemFi: "https://www.lemfi.com/",
  MoneyGram: "https://www.moneygram.com/",
  Remitly: "https://www.remitly.com/",
  "TapTap Send": "https://www.taptapsend.com/",
  Wise: "https://wise.com/",
  WorldRemit: "https://www.worldremit.com/"
};

const rateSets: Record<CurrencyPair, ProviderRate[]> = {
  USD_NGN: [
    provider("Wise", "W", 1542.25, "1 USD = 1,542.25 NGN", 11, false),
    provider("LemFi", "L", 1538.4, "1 USD = 1,538.40 NGN", 24, false),
    provider("Remitly", "R", 1531.9, "1 USD = 1,531.90 NGN", 52, false),
    provider("WorldRemit", "WR", 1518.7, "1 USD = 1,518.70 NGN", 142, true)
  ],
  GBP_NGN: [
    provider("Wise", "W", 1964.82, "1 GBP = 1,964.82 NGN", 9, false),
    provider("TapTap Send", "T", 1958.1, "1 GBP = 1,958.10 NGN", 18, false),
    provider("LemFi", "L", 1951.55, "1 GBP = 1,951.55 NGN", 44, false),
    provider("MoneyGram", "M", 1936.02, "1 GBP = 1,936.02 NGN", 132, true)
  ],
  EUR_NGN: [
    provider("Remitly", "R", 1666.14, "1 EUR = 1,666.14 NGN", 16, false),
    provider("Wise", "W", 1661.72, "1 EUR = 1,661.72 NGN", 29, false),
    provider("WorldRemit", "WR", 1648.39, "1 EUR = 1,648.39 NGN", 48, false),
    provider("MoneyGram", "M", 1633.4, "1 EUR = 1,633.40 NGN", 127, true)
  ],
  CAD_NGN: [
    provider("LemFi", "L", 1126.75, "1 CAD = 1,126.75 NGN", 7, false),
    provider("Wise", "W", 1121.32, "1 CAD = 1,121.32 NGN", 22, false),
    provider("Remitly", "R", 1114.9, "1 CAD = 1,114.90 NGN", 58, false),
    provider("WorldRemit", "WR", 1102.14, "1 CAD = 1,102.14 NGN", 145, true)
  ]
};

function provider(
  name: string,
  shortName: string,
  rate: number,
  rateLabel: string,
  minutes: number,
  stale: boolean
): ProviderRate {
  const slug = name.toLowerCase().replaceAll(" ", "-");

  return {
    provider: name,
    shortName,
    logo: providerLogos[name] ?? {
      type: "wordmark",
      text: shortName
    },
    rate,
    rateLabel,
    updatedAt: minutesAgo(minutes),
    stale,
    websiteUrl: providerWebsites[name] ?? "#",
    appStoreUrl: `https://www.google.com/search?q=${encodeURIComponent(name + " app store")}`,
    playStoreUrl: `https://www.google.com/search?q=${encodeURIComponent(name + " google play")}`,
    surveyUrl: `/survey?provider=${slug}`,
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  };
}

export function getRates(pair: CurrencyPair = "GBP_NGN") {
  return [...rateSets[pair]].sort((a, b) => b.rate - a.rate);
}

export function getAllRates() {
  return Object.fromEntries(
    Object.entries(rateSets).map(([pair, rates]) => [
      pair,
      [...rates].sort((a, b) => b.rate - a.rate)
    ])
  ) as Record<CurrencyPair, ProviderRate[]>;
}

export function getCurrencyPairs() {
  return [
    { value: "GBP_NGN", label: "GBP → NGN" },
    { value: "USD_NGN", label: "USD → NGN" },
    { value: "EUR_NGN", label: "EUR → NGN" },
    { value: "CAD_NGN", label: "CAD → NGN" }
  ] satisfies Array<{ value: CurrencyPair; label: string }>;
}
