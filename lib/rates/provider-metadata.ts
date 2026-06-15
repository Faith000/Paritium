import { siMoneygram, siWise } from "simple-icons";
import type { ProviderId, ProviderMetadata } from "./types";

export const providerMetadata: Record<ProviderId, ProviderMetadata> = {
  wise: {
    id: "wise",
    provider: "Wise",
    shortName: "W",
    logo: {
      type: "svg",
      path: siWise.path,
      color: `#${siWise.hex}`,
      viewBox: "0 0 24 24"
    },
    websiteUrl: "https://wise.com/",
    appStoreUrl: "https://www.google.com/search?q=Wise%20app%20store",
    playStoreUrl: "https://www.google.com/search?q=Wise%20google%20play",
    surveyUrl: "/survey?provider=wise",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  },
  lemfi: {
    id: "lemfi",
    provider: "LemFi",
    shortName: "L",
    logo: {
      type: "image",
      src: "/provider-logos/lemfi.svg",
      alt: "LemFi logo"
    },
    websiteUrl: "https://www.lemfi.com/",
    appStoreUrl: "https://www.google.com/search?q=LemFi%20app%20store",
    playStoreUrl: "https://www.google.com/search?q=LemFi%20google%20play",
    surveyUrl: "/survey?provider=lemfi",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  },
  remitly: {
    id: "remitly",
    provider: "Remitly",
    shortName: "R",
    logo: {
      type: "image",
      src: "/provider-logos/remitly.png",
      alt: "Remitly logo"
    },
    websiteUrl: "https://www.remitly.com/",
    appStoreUrl: "https://www.google.com/search?q=Remitly%20app%20store",
    playStoreUrl: "https://www.google.com/search?q=Remitly%20google%20play",
    surveyUrl: "/survey?provider=remitly",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  },
  worldremit: {
    id: "worldremit",
    provider: "WorldRemit",
    shortName: "WR",
    logo: {
      type: "image",
      src: "/provider-logos/worldremit.png",
      alt: "WorldRemit logo"
    },
    websiteUrl: "https://www.worldremit.com/",
    appStoreUrl: "https://www.google.com/search?q=WorldRemit%20app%20store",
    playStoreUrl: "https://www.google.com/search?q=WorldRemit%20google%20play",
    surveyUrl: "/survey?provider=worldremit",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  },
  moneygram: {
    id: "moneygram",
    provider: "MoneyGram",
    shortName: "M",
    logo: {
      type: "svg",
      path: siMoneygram.path,
      color: `#${siMoneygram.hex}`,
      viewBox: "0 0 24 24"
    },
    websiteUrl: "https://www.moneygram.com/",
    appStoreUrl: "https://www.google.com/search?q=MoneyGram%20app%20store",
    playStoreUrl: "https://www.google.com/search?q=MoneyGram%20google%20play",
    surveyUrl: "/survey?provider=moneygram",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  },
  "taptap-send": {
    id: "taptap-send",
    provider: "TapTap Send",
    shortName: "T",
    logo: {
      type: "image",
      src: "/provider-logos/taptap-send.avif",
      alt: "TapTap Send logo"
    },
    websiteUrl: "https://www.taptapsend.com/",
    appStoreUrl: "https://www.google.com/search?q=TapTap%20Send%20app%20store",
    playStoreUrl: "https://www.google.com/search?q=TapTap%20Send%20google%20play",
    surveyUrl: "/survey?provider=taptap-send",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  }
};
