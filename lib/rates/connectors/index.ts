import { bestRatesConnector } from "./best-rates";
import { wiseConnector } from "./wise";
import { shouldUseProductionRateData } from "../environment";
import type { RateProviderConnector } from "./types";

export const rateProviderConnectors: RateProviderConnector[] =
  shouldUseProductionRateData()
    ? [wiseConnector]
    : [bestRatesConnector, wiseConnector];
