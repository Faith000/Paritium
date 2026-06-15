"use client";

import { useEffect, useState } from "react";
import type { CurrencyPair, ProviderRate } from "@/lib/rates";

type PairOption = {
  value: CurrencyPair;
  label: string;
};

export default function HeroRateSelector({
  pairs,
  ratesByPair
}: {
  pairs: PairOption[];
  ratesByPair: Record<CurrencyPair, ProviderRate[]>;
}) {
  const fromCurrencies = Array.from(
    new Set(pairs.map((pair) => pair.label.split(" → ")[0]))
  );
  const toCurrencies = Array.from(
    new Set(pairs.map((pair) => pair.label.split(" → ")[1]))
  );
  const [fromCurrency, setFromCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>("GBP_NGN");
  const [liveRatesByPair, setLiveRatesByPair] = useState(ratesByPair);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const selectedRates = liveRatesByPair[selectedPair] ?? ratesByPair[selectedPair];
  const bestRate = selectedRates[0];
  const averageRate =
    selectedRates.reduce((total, rate) => total + rate.rate, 0) /
    selectedRates.length;
  const bestRateLift = bestRate.rate - averageRate;
  const selectedPairLabel =
    pairs.find((pair) => pair.value === selectedPair)?.label.replace(" → ", " to ") ??
    "selected route";
  const draftPair = getPairValue(pairs, fromCurrency, toCurrency);
  const compareHref = `/compare?pair=${selectedPair}`;

  useEffect(() => {
    let isCurrent = true;

    fetchPairRates(selectedPair)
      .then((rates) => {
        if (!isCurrent) return;

        setLiveRatesByPair((currentRates) => ({
          ...currentRates,
          [selectedPair]: rates
        }));
      })
      .catch(() => {
        // Keep the bundled fallback rates if the API is temporarily unavailable.
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedPair]);

  return (
    <>
      <div className="rate-selector">
        <label>
          From
          <span className="currency-select-field">
            <CurrencyFlag flag={getCurrencyFlag(fromCurrency)} label={fromCurrency} />
            <select
              aria-label="From currency"
              value={fromCurrency}
              onChange={(event) => setFromCurrency(event.target.value)}
            >
              {fromCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </span>
        </label>
        <button
          aria-label="Swap currencies"
          className="swap-currency-button"
          type="button"
          onClick={() => {
            const nextFromCurrency =
              fromCurrencies.find((currency) => currency !== fromCurrency) ??
              fromCurrency;

            setFromCurrency(nextFromCurrency);
            setToCurrency(toCurrencies[0] ?? "NGN");
          }}
        >
          <SwapIcon />
        </button>
        <label>
          To
          <span className="currency-select-field">
            <CurrencyFlag flag={getCurrencyFlag(toCurrency)} label={toCurrency} />
            <select
              aria-label="To currency"
              value={toCurrency}
              onChange={(event) => setToCurrency(event.target.value)}
            >
              {toCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </span>
        </label>
        <button
          className="button button-primary"
          disabled={!draftPair || isRefreshing}
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            const controls = event.currentTarget.closest(".rate-selector");
            const nextFromCurrency =
              controls?.querySelector<HTMLSelectElement>(
                'select[aria-label="From currency"]'
              )?.value ?? fromCurrency;
            const nextToCurrency =
              controls?.querySelector<HTMLSelectElement>(
                'select[aria-label="To currency"]'
              )?.value ?? toCurrency;
            const nextPair = getPairValue(pairs, nextFromCurrency, nextToCurrency);

            if (!nextPair) return;

            setFromCurrency(nextFromCurrency);
            setToCurrency(nextToCurrency);
            setSelectedPair(nextPair);
            persistSelectedPair(nextPair);
            setIsRefreshing(true);

            try {
              const rates = await fetchPairRates(nextPair);

              setLiveRatesByPair((currentRates) => ({
                ...currentRates,
                [nextPair]: rates
              }));
            } catch {
              // Keep the current fallback rates visible.
            } finally {
              setIsRefreshing(false);
            }
          }}
        >
          {isRefreshing ? "Updating..." : "See Today&apos;s Rates"}
        </button>
      </div>
      <div className="best-rate-summary">
        <div>
          <span>Best published rate today</span>
          <strong>{bestRate.rateLabel}</strong>
          <p>
            <b className="best-rate-provider">{bestRate.provider}</b> is currently{" "}
            <b>+{bestRateLift.toFixed(2)} NGN</b> above the average shown for{" "}
            {selectedPairLabel}.
          </p>
        </div>
        <a className="button button-secondary" href={compareHref}>
          See all provider rates
        </a>
      </div>
    </>
  );
}

async function fetchPairRates(pair: CurrencyPair) {
  const response = await fetch(`/api/rates?pair=${pair}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to fetch provider rates");
  }

  const data = (await response.json()) as { providers: ProviderRate[] };

  return data.providers;
}

function getPairValue(
  pairs: PairOption[],
  fromCurrency: string,
  toCurrency: string
) {
  return pairs.find((pair) => pair.label === `${fromCurrency} → ${toCurrency}`)
    ?.value;
}

function persistSelectedPair(pair: CurrencyPair) {
  try {
    window.localStorage.setItem("paritium:selectedPair", pair);
  } catch {
    // Browsers can block localStorage in private or embedded contexts.
  }

  window.name = `paritium_selected_pair=${pair}`;
  document.cookie = `paritium_selected_pair=${pair}; path=/; max-age=2592000; SameSite=Lax`;
}

function CurrencyFlag({ flag, label }: { flag: string; label: string }) {
  return (
    <span className="currency-mark" aria-hidden="true" title={`${label} flag`}>
      {flag}
    </span>
  );
}

function getCurrencyFlag(code: string) {
  const flags: Record<string, string> = {
    CAD: "🇨🇦",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    NGN: "🇳🇬",
    USD: "🇺🇸"
  };

  return flags[code] ?? "";
}

function SwapIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 7h11l-3-3M17 17H6l3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
