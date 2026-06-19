"use client";

import { useState } from "react";
import type { CurrencyPair } from "@/lib/rates";

type PairOption = {
  value: CurrencyPair;
  label: string;
};

export default function HeroRateSelector({
  pairs
}: {
  pairs: PairOption[];
}) {
  const fromCurrencies = Array.from(
    new Set(pairs.map((pair) => pair.label.split(" → ")[0]))
  );
  const toCurrencies = Array.from(
    new Set(pairs.map((pair) => pair.label.split(" → ")[1]))
  );
  const [fromCurrency, setFromCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("NGN");
  const draftPair = getPairValue(pairs, fromCurrency, toCurrency);
  const compareHref = `/compare?pair=${draftPair ?? "GBP_NGN"}#rates-title`;

  return (
    <div className="hero-route-launcher">
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
            const currentIndex = fromCurrencies.indexOf(fromCurrency);
            const nextFromCurrency =
              fromCurrencies[(currentIndex + 1) % fromCurrencies.length] ??
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
        <a
          className="button button-primary"
          aria-disabled={!draftPair}
          href={draftPair ? compareHref : undefined}
          onClick={(event) => {
            if (!draftPair) {
              event.preventDefault();
              return;
            }

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
            persistSelectedPair(nextPair);
          }}
        >
          See Today&apos;s Rates
        </a>
      </div>
    </div>
  );
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
