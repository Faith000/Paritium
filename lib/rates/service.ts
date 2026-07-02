import { composeProviderRates } from "./compose";
import { getCurrencyPair } from "./pairs";
import { getMockQuoteForProvider, getMockQuotes } from "./connectors/mock";
import { rateProviderConnectors } from "./connectors";
import { shouldUseProductionRateData } from "./environment";
import type { CurrencyPair, ProviderRateQuote, RatesResult } from "./types";

export async function fetchRates(
  pair: CurrencyPair,
  sourceAmount?: number
): Promise<RatesResult> {
  const currencyPair = getCurrencyPair(pair);

  if (!currencyPair) {
    return getMockRatesResult(pair);
  }

  const liveResults = await Promise.all(
    rateProviderConnectors.map(async (connector) => {
      if (!connector.enabled) {
        return {
          connector,
          quotes: [],
          status: "unavailable" as const,
          error: "Connector is not configured"
        };
      }

      try {
        const quotes = await connector.fetchRate({
          source: currencyPair.source,
          sourceAmount,
          target: currencyPair.target
        });

        return {
          connector,
          quotes: Array.isArray(quotes) ? quotes : [quotes],
          status: "live" as const
        };
      } catch (error) {
        return {
          connector,
          quotes: [],
          status: "fallback" as const,
          error: error instanceof Error ? error.message : "Unknown connector error"
        };
      }
    })
  );

  const liveQuotes = dedupeProviderQuotes(
    liveResults.flatMap((result) => result.quotes)
  );
  const productionRateData = shouldUseProductionRateData();
  const hasBestRatesQuotes = liveResults.some(
    (result) =>
      result.connector.providerId === "best-rates" && result.quotes.length > 0
  );
  const fallbackQuotes = liveResults.flatMap((result) => {
    if (result.quotes.length > 0) return [];
    if (productionRateData && result.connector.providerId !== "wise") return [];

    const fallbackQuote = getMockQuoteForProvider(
      pair,
      result.connector.providerId
    );

    return fallbackQuote ? [{ ...fallbackQuote, source: "fallback" as const }] : [];
  });
  const liveProviderIds = new Set(liveQuotes.map((quote) => quote.providerId));
  const mockQuotes = hasBestRatesQuotes
    ? []
    : productionRateData
      ? []
    : getMockQuotes(pair).filter(
        (quote) => !liveProviderIds.has(quote.providerId)
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

function dedupeProviderQuotes(quotes: ProviderRateQuote[]) {
  const quotesByProvider = new Map<string, ProviderRateQuote>();

  for (const quote of quotes) {
    quotesByProvider.set(quote.providerId, quote);
  }

  return [...quotesByProvider.values()];
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
