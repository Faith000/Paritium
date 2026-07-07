"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  CurrencyPair,
  ProviderLogo as ProviderLogoType,
  ProviderRate
} from "@/lib/rates";
import { trackAnalyticsEvent } from "@/lib/analytics";

type PairOption = {
  value: CurrencyPair;
  label: string;
};

type RatesResponse = {
  providers: ProviderRate[];
  sources?: Array<{
    providerId: string;
    status: string;
  }>;
};

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(iso: string) {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  return formatter.format(Math.round(minutes / 60), "hour");
}

function getPairValue(
  pairs: PairOption[],
  fromCurrency: string,
  toCurrency: string
) {
  return pairs.find((pair) => pair.label === `${fromCurrency} → ${toCurrency}`)
    ?.value;
}

function getValidPair(pairValue: string | null, pairs: PairOption[]) {
  return pairs.find((pair) => pair.value === pairValue)?.value;
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

function getValidAmount(amountValue: string | null) {
  const amount = Number(amountValue);

  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function getWindowNamePair() {
  return window.name.match(/paritium_selected_pair=([A-Z_]+)/)?.[1] ?? null;
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

export default function CompareRatesClient({
  pairs,
  ratesByPair
}: {
  pairs: PairOption[];
  ratesByPair: Record<CurrencyPair, ProviderRate[]>;
}) {
  const searchParams = useSearchParams();
  const initialPair = getValidPair(searchParams.get("pair"), pairs) ?? "GBP_NGN";
  const initialPairLabel =
    pairs.find((pair) => pair.value === initialPair)?.label ?? "GBP → NGN";
  const [initialFromCurrency, initialToCurrency] = initialPairLabel.split(" → ");
  const initialUrlAmount = getValidAmount(searchParams.get("amount"));
  const initialAmount = initialUrlAmount ?? 1000;
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(initialPair);
  const [draftFromCurrency, setDraftFromCurrency] = useState(initialFromCurrency);
  const [draftToCurrency, setDraftToCurrency] = useState(initialToCurrency);
  const [sendAmount, setSendAmount] = useState(initialAmount);
  const [draftSendAmount, setDraftSendAmount] = useState(
    initialUrlAmount?.toString() ?? ""
  );
  const [liveRatesByPair, setLiveRatesByPair] = useState(ratesByPair);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasRestoredEntry, setHasRestoredEntry] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"from" | "to" | null>(null);
  const compareStartedAt = useRef(Date.now());
  const hasSkippedInitialRefresh = useRef(false);
  const selectorsRef = useRef<HTMLDivElement>(null);

  const rates = liveRatesByPair[selectedPair] ?? ratesByPair[selectedPair];
  const averageRate = useMemo(
    () =>
      rates.length > 0
        ? rates.reduce((total, rate) => total + rate.rate, 0) / rates.length
        : 0,
    [rates]
  );
  const staleRates = useMemo(() => rates.filter((rate) => rate.stale), [rates]);
  const [fromCurrency, toCurrency] =
    pairs.find((pair) => pair.value === selectedPair)?.label.split(" → ") ??
    [];
  const fromCurrencyOptions = Array.from(
    new Set(pairs.map((pair) => pair.label.split(" → ")[0]))
  );
  const toCurrencyOptions = Array.from(
    new Set(pairs.map((pair) => pair.label.split(" → ")[1]))
  );
  const draftPair = getPairValue(pairs, draftFromCurrency, draftToCurrency);

  useEffect(() => {
    function closeDropdown(event: MouseEvent) {
      if (!selectorsRef.current?.contains(event.target as Node)) {
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
    const pairFromUrl = searchParams.get("pair");
    const amountFromUrl = searchParams.get("amount");
    const storedPair = getStoredPair() ?? getPairCookie() ?? getWindowNamePair();
    const nextPair =
      getValidPair(pairFromUrl, pairs) ?? getValidPair(storedPair, pairs);
    const nextAmount = getValidAmount(amountFromUrl);

    if (nextAmount) {
      setSendAmount(nextAmount);
      setDraftSendAmount(nextAmount.toString());
    } else {
      setSendAmount(1000);
      setDraftSendAmount("");
    }

    if (!nextPair) {
      setHasRestoredEntry(true);
      return;
    }

    const pairLabel = pairs.find((pair) => pair.value === nextPair)?.label;
    const [nextFromCurrency, nextToCurrency] = pairLabel?.split(" → ") ?? [];

    setSelectedPair(nextPair);

    if (nextFromCurrency) {
      setDraftFromCurrency(nextFromCurrency);
    }

    if (nextToCurrency) {
      setDraftToCurrency(nextToCurrency);
    }

    setHasRestoredEntry(true);
  }, [pairs, searchParams]);

  useEffect(() => {
    let isCurrent = true;

    if (!hasSkippedInitialRefresh.current) {
      hasSkippedInitialRefresh.current = true;

      return () => {
        isCurrent = false;
      };
    }

    setIsRefreshing(true);

    fetchPairRates(selectedPair, sendAmount)
      .then((ratesResult) => {
        if (!isCurrent) return;

        setLiveRatesByPair((currentRates) => ({
          ...currentRates,
          [selectedPair]: shouldUseRatesResult(
            currentRates[selectedPair] ?? [],
            ratesResult
          )
            ? ratesResult.providers
            : currentRates[selectedPair]
        }));
      })
      .catch(() => {
        // Keep the bundled fallback rates visible if the API is unavailable.
      })
      .finally(() => {
        if (isCurrent) {
          setIsRefreshing(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedPair, sendAmount]);

  return (
    <section className="compare-workspace section-pad" aria-labelledby="rates-title">
      <div className="compare-controls">
        <div>
          <p className="eyebrow">Currency pair</p>
          <h2 id="rates-title">
            {fromCurrency} to {toCurrency}
          </h2>
        </div>
        <div
          className="compare-currency-selectors"
          aria-label="Currency pair selectors"
          ref={selectorsRef}
        >
          <div className="compare-select-control">
            <span>From</span>
            <CurrencyDropdown
              currencies={fromCurrencyOptions}
              id="compare-from-currency"
              isOpen={openDropdown === "from"}
              label="From currency"
              onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "from" : null)}
              onSelect={(currency) => {
                const nextPair = getPairValue(pairs, currency, draftToCurrency);

                setDraftFromCurrency(currency);
                setOpenDropdown(null);

                if (!nextPair) {
                  const fallbackToCurrency = pairs
                    .find((pair) => pair.label.startsWith(`${currency} → `))
                    ?.label.split(" → ")[1];

                  if (fallbackToCurrency) {
                    setDraftToCurrency(fallbackToCurrency);
                  }
                }
              }}
              value={draftFromCurrency}
            />
          </div>
          <div className="compare-select-control">
            <span>To</span>
            <CurrencyDropdown
              currencies={toCurrencyOptions}
              id="compare-to-currency"
              isOpen={openDropdown === "to"}
              label="To currency"
              onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "to" : null)}
              onSelect={(currency) => {
                setDraftToCurrency(currency);
                setOpenDropdown(null);
              }}
              value={draftToCurrency}
            />
          </div>
          <label>
            Amount to send
            <span className="compare-amount-field">
              <input
                aria-label={`Amount to send in ${draftFromCurrency}`}
                inputMode="decimal"
                min="0"
                onChange={(event) => setDraftSendAmount(event.target.value)}
                placeholder="0.00"
                type="number"
                value={draftSendAmount}
              />
              <span>{draftFromCurrency}</span>
            </span>
          </label>
          <button
            className="button button-primary compare-refresh-button"
            disabled={!draftPair || isRefreshing}
            type="button"
            onClick={async () => {
              const nextFromCurrency = draftFromCurrency;
              const nextToCurrency = draftToCurrency;
              const nextPair = getPairValue(pairs, nextFromCurrency, nextToCurrency);

              if (!nextPair) return;

              const validDraftAmount = getValidAmount(draftSendAmount);
              const nextAmount = validDraftAmount ?? 1000;

              setDraftFromCurrency(nextFromCurrency);
              setDraftToCurrency(nextToCurrency);
              setDraftSendAmount(validDraftAmount ? nextAmount.toString() : "");
              setSelectedPair(nextPair);
              setSendAmount(nextAmount);
              persistSelectedPair(nextPair);
              trackAnalyticsEvent("currency_pair_selected", {
                cta_name: "see_todays_rates",
                currency_pair: nextPair,
                from_currency: nextFromCurrency,
                to_currency: nextToCurrency
              });
              setIsRefreshing(true);

              try {
                const ratesResult = await fetchPairRates(nextPair, nextAmount);

                setLiveRatesByPair((currentRates) => ({
                  ...currentRates,
                  [nextPair]: shouldUseRatesResult(
                    currentRates[nextPair] ?? [],
                    ratesResult
                  )
                    ? ratesResult.providers
                    : currentRates[nextPair]
                }));
              } catch {
                // Keep the current fallback rates visible.
              } finally {
                setIsRefreshing(false);
              }
            }}
          >
            See today&apos;s rates
          </button>
        </div>
      </div>

      {staleRates.length > 0 ? (
        <div className="stale-alert" role="status">
          {staleRates.length} provider rate
          {staleRates.length > 1 ? "s are" : " is"} older than 2 hours. Last
          known rates are still shown.
        </div>
      ) : null}

      <div className="table-shell compare-table-shell">
        <div className="table-toolbar compare-table-toolbar">
          <span>
            {rates.length} provider{rates.length === 1 ? "" : "s"} ranked by
            published rate
          </span>
          {rates[0] ? <span>Best rate: {rates[0].rateLabel}</span> : null}
        </div>
        <div className="table-scroll">
          <table>
            <caption>
              Provider rates for {fromCurrency} to {toCurrency}
            </caption>
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Provider</th>
                <th scope="col">Published rate</th>
                <th scope="col">Transfer fee</th>
                <th scope="col">Recepient Receives</th>
                <th scope="col">Last updated</th>
                <th scope="col">Download</th>
                <th scope="col">Website</th>
              </tr>
            </thead>
            <tbody>
              {rates.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-rate-state">
                      No live provider rates are available for this route yet.
                    </div>
                  </td>
                </tr>
              ) : null}
              {rates.map((rate, index) => {
                const rateDifference = rate.rate - averageRate;
                const recipientReceives = calculateRecipientReceives(
                  sendAmount,
                  rate
                );

                return (
                  <tr key={rate.provider}>
                    <td>
                      <span className="rank-pill">#{index + 1}</span>
                    </td>
                    <td>
                      <div className="provider-cell">
                        <ProviderLogo
                          logo={rate.logo}
                          provider={rate.provider}
                          shortName={rate.shortName}
                        />
                        <div>
                          <strong>{rate.provider}</strong>
                          {index === 0 ? <em>Best Rate Today</em> : null}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rate-value">
                        <strong>{rate.rateLabel}</strong>
                        <span>
                          <b className={rateDifference >= 0 ? "rate-positive" : "rate-negative"}>
                            {rateDifference >= 0 ? "+" : ""}
                            {rateDifference.toFixed(2)}
                          </b>{" "}
                          vs average
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong className="transfer-fee-value">
                        {rate.transferFeeLabel}
                      </strong>
                    </td>
                    <td>
                      <strong className="recipient-receives-value">
                        {formatRecipientAmount(recipientReceives, toCurrency)}
                      </strong>
                    </td>
                    <td>
                      <div className={rate.stale ? "updated-cell updated-cell-stale" : "updated-cell"}>
                        <span>{timeAgo(rate.updatedAt)}</span>
                        {rate.stale ? <small>Older than 2 hours</small> : null}
                      </div>
                    </td>
                    <td>
                      <div className="app-links">
                        <a
                          href={rate.appStoreUrl}
                          onClick={() =>
                            trackAnalyticsEvent("provider_app_download_clicked", {
                              cta_name: "app_store",
                              currency_pair: selectedPair,
                              platform: "ios",
                              provider_name: rate.provider,
                              provider_rank: index + 1,
                              store_type: "app_store",
                              time_before_provider_click_seconds: getSecondsBeforeClick(compareStartedAt.current)
                            })
                          }
                        >
                          <AppStoreIcon />
                          <span className="sr-only">App Store</span>
                        </a>
                        <a
                          href={rate.playStoreUrl}
                          onClick={() =>
                            trackAnalyticsEvent("provider_app_download_clicked", {
                              cta_name: "google_play",
                              currency_pair: selectedPair,
                              platform: "android",
                              provider_name: rate.provider,
                              provider_rank: index + 1,
                              store_type: "google_play",
                              time_before_provider_click_seconds: getSecondsBeforeClick(compareStartedAt.current)
                            })
                          }
                        >
                          <GooglePlayIcon />
                          <span className="sr-only">Google Play</span>
                        </a>
                      </div>
                    </td>
                    <td>
                      <a
                        className="table-action"
                        href={rate.websiteUrl}
                        onClick={() =>
                          trackAnalyticsEvent("provider_visit_clicked", {
                            cta_name: "visit_website",
                            currency_pair: selectedPair,
                            provider_name: rate.provider,
                            provider_rank: index + 1,
                            time_before_provider_click_seconds: getSecondsBeforeClick(compareStartedAt.current)
                          })
                        }
                      >
                        Visit Website
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-rate-cards" aria-label="Provider rate cards">
        {rates.map((rate, index) => {
          const rateDifference = rate.rate - averageRate;

          return (
            <article className="mobile-rate-card" key={rate.provider}>
              <div className="mobile-rate-card-top">
                <div className="provider-cell">
                  <span className="rank-pill">#{index + 1}</span>
                  <ProviderLogo
                    logo={rate.logo}
                    provider={rate.provider}
                    shortName={rate.shortName}
                  />
                  <div>
                    <strong>{rate.provider}</strong>
                    {index === 0 ? <em>Best Rate Today</em> : null}
                  </div>
                </div>
                <span className={rate.stale ? "status-pill stale-pill" : "status-pill"}>
                  {rate.stale ? "Stale" : "Fresh"}
                </span>
              </div>
              <div className="mobile-rate-value">
                <span>Today&apos;s exchange rate</span>
                <strong>{rate.rateLabel}</strong>
                <p>
                  <b className={rateDifference >= 0 ? "rate-positive" : "rate-negative"}>
                    {rateDifference >= 0 ? "+" : ""}
                    {rateDifference.toFixed(2)}
                  </b>{" "}
                  vs provider average
                </p>
              </div>
              <div className="mobile-rate-meta">
                <span>Transfer fee</span>
                <strong>{rate.transferFeeLabel}</strong>
              </div>
              <div className="mobile-rate-meta mobile-recipient-meta">
                <span>Recepient receives</span>
                <strong>
                  {formatRecipientAmount(
                    calculateRecipientReceives(sendAmount, rate),
                    toCurrency
                  )}
                </strong>
              </div>
              <div className={rate.stale ? "mobile-rate-meta mobile-rate-meta-stale" : "mobile-rate-meta"}>
                <span>Updated {timeAgo(rate.updatedAt)}</span>
                <span>{rate.supportedCurrencies.join(", ")}</span>
              </div>
              <div className="provider-card-actions">
                <a
                  className="mobile-primary-action"
                  href={rate.websiteUrl}
                  onClick={() =>
                    trackAnalyticsEvent("provider_visit_clicked", {
                      cta_name: "visit_website",
                      currency_pair: selectedPair,
                      provider_name: rate.provider,
                      provider_rank: index + 1,
                      time_before_provider_click_seconds: getSecondsBeforeClick(compareStartedAt.current)
                    })
                  }
                >
                  Visit website
                </a>
                <span className="app-links">
                  <a
                    href={rate.appStoreUrl}
                    onClick={() =>
                      trackAnalyticsEvent("provider_app_download_clicked", {
                        cta_name: "app_store",
                        currency_pair: selectedPair,
                        platform: "ios",
                        provider_name: rate.provider,
                        provider_rank: index + 1,
                        store_type: "app_store",
                        time_before_provider_click_seconds: getSecondsBeforeClick(compareStartedAt.current)
                      })
                    }
                  >
                    <AppStoreIcon />
                    <span className="sr-only">App Store</span>
                  </a>
                  <a
                    href={rate.playStoreUrl}
                    onClick={() =>
                      trackAnalyticsEvent("provider_app_download_clicked", {
                        cta_name: "google_play",
                        currency_pair: selectedPair,
                        platform: "android",
                        provider_name: rate.provider,
                        provider_rank: index + 1,
                        store_type: "google_play",
                        time_before_provider_click_seconds: getSecondsBeforeClick(compareStartedAt.current)
                      })
                    }
                  >
                    <GooglePlayIcon />
                    <span className="sr-only">Google Play</span>
                  </a>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

async function fetchPairRates(pair: CurrencyPair, amount?: number): Promise<RatesResponse> {
  const searchParams = new URLSearchParams({ pair });

  if (amount && Number.isFinite(amount) && amount > 0) {
    searchParams.set("amount", amount.toString());
  }

  const response = await fetch(`/api/rates?${searchParams.toString()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to fetch provider rates");
  }

  const data = (await response.json()) as RatesResponse;

  return data;
}

function shouldUseRatesResult(
  currentRates: ProviderRate[],
  ratesResult: RatesResponse
) {
  if (hasLiveBestRates(ratesResult)) return true;

  return ratesResult.providers.length >= currentRates.length;
}

function hasLiveBestRates(ratesResult: RatesResponse) {
  return ratesResult.sources?.some(
    (source) => source.providerId === "best-rates" && source.status === "live"
  );
}

function getSecondsBeforeClick(startedAt: number) {
  return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}

function calculateRecipientReceives(sendAmount: number, rate: ProviderRate) {
  return Math.max(sendAmount - rate.transferFee.amount, 0) * rate.rate;
}

function formatRecipientAmount(amount: number, currency?: string) {
  return new Intl.NumberFormat("en", {
    currency: currency ?? "NGN",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency"
  }).format(amount);
}

function ProviderLogo({
  logo,
  provider,
  shortName
}: {
  logo: ProviderLogoType;
  provider: string;
  shortName: string;
}) {
  return (
    <span className="provider-logo">
      {logo.type === "svg" ? (
        <svg
          aria-label={`${provider} logo`}
          role="img"
          viewBox={logo.viewBox}
          style={{ color: logo.color }}
        >
          <path d={logo.path} fill="currentColor" />
        </svg>
      ) : logo.type === "image" ? (
        <img
          src={logo.src}
          alt={logo.alt || `${provider} logo`}
          decoding="async"
          loading="lazy"
        />
      ) : (
        <span className="provider-wordmark" aria-label={`${provider} logo`}>
          {logo.text || shortName}
        </span>
      )}
    </span>
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
    <div className="hero-currency-dropdown compare-currency-dropdown">
      <button
        aria-controls={`${id}-menu`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
        className="hero-dropdown-button compare-dropdown-button"
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
          className="hero-dropdown-menu compare-dropdown-menu"
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

function AppStoreIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M16.8 12.6c0-2.1 1.8-3.1 1.9-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1 2.6-2.1.8-1.2 1.1-2.3 1.1-2.4 0 0-2.6-1-2.7-3.6Z"
        fill="currentColor"
      />
      <path
        d="M14.9 6.5c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.7-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path d="M5 3.9v16.2c0 .5.3.8.7.9l9.1-8.9L5.7 3.1c-.4.1-.7.4-.7.8Z" fill="currentColor" opacity="0.9" />
      <path d="m15.7 11.2 2.2-2.1L7.4 3.4l8.3 7.8Z" fill="currentColor" opacity="0.65" />
      <path d="m15.7 12.8-8.3 7.8 10.5-5.7-2.2-2.1Z" fill="currentColor" opacity="0.75" />
      <path d="m18.7 9.5-2.2 2.5 2.2 2.5 1.3-.7c1-.6 1-2 0-2.6l-1.3-.7Z" fill="currentColor" />
    </svg>
  );
}
