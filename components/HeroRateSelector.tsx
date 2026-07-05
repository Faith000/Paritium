"use client";

import { useEffect, useRef, useState } from "react";
import type { CurrencyPair } from "@/lib/rates";
import { trackAnalyticsEvent } from "@/lib/analytics";

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
  const [sendAmount, setSendAmount] = useState("");
  const [hasRestoredEntry, setHasRestoredEntry] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"from" | "to" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const draftPair = getPairValue(pairs, fromCurrency, toCurrency);
  const compareHref = `/compare?pair=${draftPair ?? "GBP_NGN"}&amount=${encodeURIComponent(
    normalizeAmount(sendAmount).toString()
  )}#rates-title`;

  useEffect(() => {
    const storedPair = getStoredPair() ?? getPairCookie() ?? getWindowNamePair();
    const nextPair = pairs.find((pair) => pair.value === storedPair);
    const nextAmount = getStoredAmount() ?? getAmountCookie();
    const shouldRestoreAmount = !isPageRefresh();

    if (nextPair) {
      setFromCurrency(nextPair.label.split(" → ")[0]);
      setToCurrency(nextPair.label.split(" → ")[1]);
    }

    if (shouldRestoreAmount && nextAmount !== null && isValidAmount(nextAmount)) {
      setSendAmount(nextAmount);
    }

    setHasRestoredEntry(true);
  }, [pairs]);

  useEffect(() => {
    function closeDropdown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", closeDropdown);

    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  useEffect(() => {
    if (!hasRestoredEntry) return;

    if (draftPair) {
      persistSelectedPair(draftPair);
    }
  }, [draftPair, hasRestoredEntry]);

  useEffect(() => {
    if (!hasRestoredEntry) return;

    if (isValidAmount(sendAmount)) {
      persistSendAmount(Number(sendAmount));
    }
  }, [hasRestoredEntry, sendAmount]);

  return (
    <div className="hero-route-launcher">
      <div className="rate-selector" ref={dropdownRef}>
        <div className="hero-pair-grid">
          <div className="hero-select-control">
            <span>From</span>
            <CurrencyDropdown
              currencies={fromCurrencies}
              id="hero-from-currency"
              isOpen={openDropdown === "from"}
              label="From currency"
              onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "from" : null)}
              onSelect={(currency) => {
                setFromCurrency(currency);
                setOpenDropdown(null);
              }}
              value={fromCurrency}
            />
          </div>
          <div className="hero-select-control">
            <span>To</span>
            <CurrencyDropdown
              currencies={toCurrencies}
              id="hero-to-currency"
              isOpen={openDropdown === "to"}
              label="To currency"
              onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "to" : null)}
              onSelect={(currency) => {
                setToCurrency(currency);
                setOpenDropdown(null);
              }}
              value={toCurrency}
            />
          </div>
        </div>
        <label className="hero-amount-control" htmlFor="hero-send-amount">
          <span>Amount to send</span>
          <div className="hero-amount-input">
            <input
              aria-label={`Amount to send in ${fromCurrency}`}
              id="hero-send-amount"
              inputMode="decimal"
              min="0"
              onChange={(event) => {
                setSendAmount(event.target.value);
              }}
              placeholder="0.00"
              type="number"
              value={sendAmount}
            />
            <span className="hero-amount-currency">
              <CurrencyFlag flag={getCurrencyFlag(fromCurrency)} label={fromCurrency} />
              {fromCurrency}
            </span>
          </div>
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

            const nextPair = getPairValue(pairs, fromCurrency, toCurrency);

            if (!nextPair) return;

            persistSelectedPair(nextPair);
            persistSendAmount(normalizeAmount(sendAmount));
            trackAnalyticsEvent("currency_pair_selected", {
              cta_name: "see_todays_rates",
              currency_pair: nextPair,
              from_currency: fromCurrency,
              to_currency: toCurrency
            });
          }}
        >
          See Today&apos;s Rates
        </a>
      </div>
    </div>
  );
}

function CurrencyDropdown({
  currencies,
  id,
  isOpen,
  label,
  onOpenChange,
  onSelect,
  value
}: {
  currencies: string[];
  id: string;
  isOpen: boolean;
  label: string;
  onOpenChange: (isOpen: boolean) => void;
  onSelect: (currency: string) => void;
  value: string;
}) {
  return (
    <div className="hero-currency-dropdown">
      <button
        aria-controls={`${id}-menu`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="hero-dropdown-button"
        id={id}
        onClick={() => onOpenChange(!isOpen)}
        type="button"
      >
        <span>
          <CurrencyFlag flag={getCurrencyFlag(value)} label={value} />
          <strong>{value}</strong>
        </span>
        <ChevronDownIcon />
      </button>
      {isOpen ? (
        <div
          aria-labelledby={id}
          className="hero-dropdown-menu"
          id={`${id}-menu`}
          role="listbox"
        >
          {currencies.map((currency) => (
            <button
              aria-selected={currency === value}
              className="hero-dropdown-option"
              key={currency}
              onClick={() => onSelect(currency)}
              role="option"
              type="button"
            >
              <CurrencyFlag flag={getCurrencyFlag(currency)} label={currency} />
              <span>
                <strong>{currency}</strong>
                <small>{getCurrencyName(currency)}</small>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function normalizeAmount(value: string) {
  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0 ? amount : 1000;
}

function isValidAmount(value: string | null) {
  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0;
}

function isPageRefresh() {
  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  return navigationEntry?.type === "reload";
}

function getPairValue(
  pairs: PairOption[],
  fromCurrency: string,
  toCurrency: string
) {
  return pairs.find((pair) => pair.label === `${fromCurrency} → ${toCurrency}`)
    ?.value;
}

function getStoredPair() {
  try {
    return window.localStorage.getItem("paritium:selectedPair");
  } catch {
    return null;
  }
}

function getPairCookie() {
  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("paritium_selected_pair="))
      ?.split("=")[1] ?? null
  );
}

function getWindowNamePair() {
  return window.name.match(/paritium_selected_pair=([A-Z_]+)/)?.[1] ?? null;
}

function getStoredAmount() {
  try {
    return window.localStorage.getItem("paritium:sendAmount");
  } catch {
    return null;
  }
}

function getAmountCookie() {
  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("paritium_send_amount="))
      ?.split("=")[1] ?? null
  );
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

function persistSendAmount(amount: number) {
  try {
    window.localStorage.setItem("paritium:sendAmount", amount.toString());
  } catch {
    // Browsers can block localStorage in private or embedded contexts.
  }

  document.cookie = `paritium_send_amount=${amount}; path=/; max-age=2592000; SameSite=Lax`;
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

function getCurrencyName(code: string) {
  const names: Record<string, string> = {
    CAD: "Canadian Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    NGN: "Nigerian Naira",
    USD: "US Dollars"
  };

  return names[code] ?? code;
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
