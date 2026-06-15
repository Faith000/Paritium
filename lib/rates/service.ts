import { composeProviderRates } from "./compose";
import { getCurrencyPair } from "./pairs";
import { getMockQuoteForProvider, getMockQuotes } from "./connectors/mock";
import { rateProviderConnectors } from "./connectors";
import type { CurrencyPair, RatesResult } from "./types";

export async function fetchRates(pair: CurrencyPair): Promise<RatesResult> {
  const currencyPair = getCurrencyPair(pair);

  if (!currencyPair) {
    return getMockRatesResult(pair);
  }

  const liveResults = await Promise.all(
    rateProviderConnectors.map(async (connector) => {
      if (!connector.enabled) {
        return {
          connector,
          quote: null,
          status: "unavailable" as const,
          error: "Connector is not configured"
        };
      }

      try {
        const quote = await connector.fetchRate({
          source: currencyPair.source,
          target: currencyPair.target
        });

        return {
          connector,
          quote,
          status: "live" as const
        };
      } catch (error) {
        return {
          connector,
          quote: null,
          status: "fallback" as const,
          error: error instanceof Error ? error.message : "Unknown connector error"
        };
      }
    })
  );

  const liveQuotes = liveResults.flatMap((result) =>
    result.quote ? [result.quote] : []
  );
  const fallbackQuotes = liveResults.flatMap((result) => {
    if (result.quote) return [];

    const fallbackQuote = getMockQuoteForProvider(
      pair,
      result.connector.providerId
    );

    return fallbackQuote ? [{ ...fallbackQuote, source: "fallback" as const }] : [];
  });
  const connectorProviderIds = new Set(
    rateProviderConnectors.map((connector) => connector.providerId)
  );
  const mockQuotes = getMockQuotes(pair).filter(
    (quote) => !connectorProviderIds.has(quote.providerId)
  );
  const providers = composeProviderRates(pair, [
    ...liveQuotes,
    ...fallbackQuotes,
    ...mockQuotes
  ]);

  return {
    pair,
    refreshedAt: new Date().toISOString(),
    providers,
    sources: [
      ...liveResults.map((result) => ({
        providerId: result.connector.providerId,
        status: result.status,
        error: result.error
      })),
      ...mockQuotes.map((quote) => ({
        providerId: quote.providerId,
        status: "mock" as const
      }))
    ]
  };
}

export function getMockRatesResult(pair: CurrencyPair): RatesResult {
  const mockQuotes = getMockQuotes(pair);

  return {
    pair,
    refreshedAt: new Date().toISOString(),
    providers: composeProviderRates(pair, mockQuotes),
    sources: mockQuotes.map((quote) => ({
      providerId: quote.providerId,
      status: quote.source === "fallback" ? "fallback" : "mock"
    }))
  };
}
