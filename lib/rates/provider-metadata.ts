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
    appStoreUrl: "https://apps.apple.com/us/app/wise-global-money/id612261027",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.transferwise.android",
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
    appStoreUrl: "https://apps.apple.com/us/app/lemfi/id1533066809",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.lemonadeFinance.android",
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
    appStoreUrl: "https://apps.apple.com/us/app/remitly-send-money-abroad/id674258465",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.remitly.androidapp",
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
    appStoreUrl: "https://apps.apple.com/us/app/worldremit-money-transfer-app/id875855935",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.worldremit.android",
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
    appStoreUrl: "https://apps.apple.com/us/app/moneygram-money-transfers-app/id867619606",
    playStoreUrl: "https://play.google.com/store/search?q=MoneyGram%20Money%20Transfers&c=apps",
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
    appStoreUrl: "https://apps.apple.com/us/app/taptap-send-money-transfer/id1413346006",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.taptapsend",
    surveyUrl: "/survey?provider=taptap-send",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    transferMethods: ["Bank transfer", "Debit card", "Mobile wallet"]
  }
};
