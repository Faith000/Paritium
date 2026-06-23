"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>("GBP_NGN");
  const [draftFromCurrency, setDraftFromCurrency] = useState("GBP");
  const [draftToCurrency, setDraftToCurrency] = useState("NGN");
  const [liveRatesByPair, setLiveRatesByPair] = useState(ratesByPair);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const compareStartedAt = useRef(Date.now());

  const rates = liveRatesByPair[selectedPair] ?? ratesByPair[selectedPair];
  const averageRate = useMemo(
    () => rates.reduce((total, rate) => total + rate.rate, 0) / rates.length,
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
    const pairFromUrl = searchParams.get("pair");
    const storedPair = getStoredPair() ?? getPairCookie() ?? getWindowNamePair();
    const nextPair =
      getValidPair(pairFromUrl, pairs) ?? getValidPair(storedPair, pairs);

    if (!nextPair) return;

    const pairLabel = pairs.find((pair) => pair.value === nextPair)?.label;
    const [nextFromCurrency, nextToCurrency] = pairLabel?.split(" → ") ?? [];

    setSelectedPair(nextPair);

    if (nextFromCurrency) {
      setDraftFromCurrency(nextFromCurrency);
    }

    if (nextToCurrency) {
      setDraftToCurrency(nextToCurrency);
    }
  }, [pairs, searchParams]);

  useEffect(() => {
    let isCurrent = true;

    setIsRefreshing(true);

    fetchPairRates(selectedPair)
      .then((providerRates) => {
        if (!isCurrent) return;

        setLiveRatesByPair((currentRates) => ({
          ...currentRates,
          [selectedPair]: providerRates
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
  }, [selectedPair]);

  return (
    <section className="compare-workspace section-pad" aria-labelledby="rates-title">
      <div className="compare-controls">
        <div>
          <p className="eyebrow">Currency pair</p>
          <h2 id="rates-title">
            {fromCurrency} to {toCurrency}
          </h2>
        </div>
        <div className="compare-currency-selectors" aria-label="Currency pair selectors">
          <label>
            From
            <span className="currency-select-field">
              <CurrencyFlag
                flag={getCurrencyFlag(draftFromCurrency)}
                label={draftFromCurrency}
              />
              <select
                aria-label="From currency"
                value={draftFromCurrency}
                onChange={(event) => {
                  const nextFromCurrency = event.target.value;
                  const nextPair = getPairValue(pairs, nextFromCurrency, draftToCurrency);

                  setDraftFromCurrency(nextFromCurrency);

                  if (!nextPair) {
                    const fallbackToCurrency = pairs
                      .find((pair) => pair.label.startsWith(`${nextFromCurrency} → `))
                      ?.label.split(" → ")[1];

                    if (fallbackToCurrency) {
                      setDraftToCurrency(fallbackToCurrency);
                    }
                  }
                }}
              >
                {fromCurrencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <button
            aria-label="Swap currencies"
            className="swap-currency-button compare-swap-button"
            type="button"
            onClick={() => {
              const currentIndex = fromCurrencyOptions.indexOf(draftFromCurrency);
              const nextFromCurrency =
                fromCurrencyOptions[(currentIndex + 1) % fromCurrencyOptions.length] ??
                draftFromCurrency;

              setDraftFromCurrency(nextFromCurrency);
              setDraftToCurrency(toCurrencyOptions[0] ?? "NGN");
            }}
          >
            <SwapIcon />
          </button>
          <label>
            To
            <span className="currency-select-field">
              <CurrencyFlag
                flag={getCurrencyFlag(draftToCurrency)}
                label={draftToCurrency}
              />
              <select
                aria-label="To currency"
                value={draftToCurrency}
                onChange={(event) => {
                  setDraftToCurrency(event.target.value);
                }}
              >
                {toCurrencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <button
            className="button button-primary compare-refresh-button"
            disabled={!draftPair || isRefreshing}
            type="button"
            onClick={async (event) => {
              const controls = event.currentTarget.closest(
                ".compare-currency-selectors"
              );
              const nextFromCurrency =
                controls?.querySelector<HTMLSelectElement>(
                  'select[aria-label="From currency"]'
                )?.value ?? draftFromCurrency;
              const nextToCurrency =
                controls?.querySelector<HTMLSelectElement>(
                  'select[aria-label="To currency"]'
                )?.value ?? draftToCurrency;
              const nextPair = getPairValue(pairs, nextFromCurrency, nextToCurrency);

              if (!nextPair) return;

              setDraftFromCurrency(nextFromCurrency);
              setDraftToCurrency(nextToCurrency);
              setSelectedPair(nextPair);
              persistSelectedPair(nextPair);
              trackAnalyticsEvent("currency_pair_selected", {
                cta_name: "see_todays_rates",
                currency_pair: nextPair,
                from_currency: nextFromCurrency,
                to_currency: nextToCurrency
              });
              setIsRefreshing(true);

              try {
                const providerRates = await fetchPairRates(nextPair);

                setLiveRatesByPair((currentRates) => ({
                  ...currentRates,
                  [nextPair]: providerRates
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
          <span>{rates.length} providers ranked by published rate</span>
          <span>Best rate: {rates[0].rateLabel}</span>
        </div>
        <div className="table-scroll">
          <table>
            <caption>
              Provider rates for {fromCurrency} to {toCurrency}
            </caption>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Published rate</th>
                <th scope="col">Last updated</th>
                <th scope="col">Apps</th>
                <th scope="col">Continue</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, index) => {
                const rateDifference = rate.rate - averageRate;
                const detailsId = `provider-details-${rate.provider
                  .toLowerCase()
                  .replaceAll(" ", "-")}`;

                return (
                  <Fragment key={rate.provider}>
                    <tr>
                      <td>
                        <div className="ranked-provider">
                          <span className="rank-pill">#{index + 1}</span>
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
                        <div className={rate.stale ? "updated-cell updated-cell-stale" : "updated-cell"}>
                          <span>{timeAgo(rate.updatedAt)}</span>
                          {rate.stale ? <small>Older than 2 hours</small> : null}
                        </div>
                      </td>
                      <td>
                        <div className="app-links">
                          <a
                            href={rate.appStoreUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              trackAnalyticsEvent("provider_app_download_clicked", {
                                cta_name: "app_store",
                                currency_pair: selectedPair,
                                platform: "ios",
                                provider_name: rate.provider,
                                provider_rank: index + 1,
                                store_type: "app_store",
                                time_before_click: getSecondsBeforeClick(compareStartedAt.current)
                              })
                            }
                          >
                            <AppStoreIcon />
                            <span className="sr-only">App Store</span>
                          </a>
                          <a
                            href={rate.playStoreUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              trackAnalyticsEvent("provider_app_download_clicked", {
                                cta_name: "google_play",
                                currency_pair: selectedPair,
                                platform: "android",
                                provider_name: rate.provider,
                                provider_rank: index + 1,
                                store_type: "google_play",
                                time_before_click: getSecondsBeforeClick(compareStartedAt.current)
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
                          target="_blank"
                          rel="noreferrer"
                          onClick={() =>
                            trackAnalyticsEvent("provider_visit_clicked", {
                              cta_name: "visit_website",
                              currency_pair: selectedPair,
                              provider_name: rate.provider,
                              provider_rank: index + 1,
                              time_before_click: getSecondsBeforeClick(compareStartedAt.current)
                            })
                          }
                        >
                          Visit Website
                        </a>
                      </td>
                      <td>
                        <input
                          className="row-detail-toggle"
                          id={detailsId}
                          type="checkbox"
                          onChange={(event) => {
                            if (event.target.checked) {
                              trackAnalyticsEvent("provider_row_expanded", {
                                cta_name: "view_details",
                                currency_pair: selectedPair,
                                provider_name: rate.provider,
                                provider_rank: index + 1
                              });
                            }
                          }}
                        />
                        <label className="text-button row-detail-label" htmlFor={detailsId}>
                          <span className="details-label-closed">View</span>
                          <span className="details-label-open">Hide</span>
                        </label>
                      </td>
                    </tr>
                    <tr className="provider-detail-row">
                      <td colSpan={6}>
                        <ProviderDetails providerRank={index + 1} rate={rate} />
                      </td>
                    </tr>
                  </Fragment>
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
              <div className={rate.stale ? "mobile-rate-meta mobile-rate-meta-stale" : "mobile-rate-meta"}>
                <span>Updated {timeAgo(rate.updatedAt)}</span>
                <span>{rate.supportedCurrencies.join(", ")}</span>
              </div>
              <div className="provider-card-actions">
                <a
                  className="mobile-primary-action"
                  href={rate.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackAnalyticsEvent("provider_visit_clicked", {
                      cta_name: "visit_website",
                      currency_pair: selectedPair,
                      provider_name: rate.provider,
                      provider_rank: index + 1,
                      time_before_click: getSecondsBeforeClick(compareStartedAt.current)
                    })
                  }
                >
                  Visit website
                </a>
                <span className="app-links">
                  <a
                    href={rate.appStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackAnalyticsEvent("provider_app_download_clicked", {
                        cta_name: "app_store",
                        currency_pair: selectedPair,
                        platform: "ios",
                        provider_name: rate.provider,
                        provider_rank: index + 1,
                        store_type: "app_store",
                        time_before_click: getSecondsBeforeClick(compareStartedAt.current)
                      })
                    }
                  >
                    <AppStoreIcon />
                    <span className="sr-only">App Store</span>
                  </a>
                  <a
                    href={rate.playStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackAnalyticsEvent("provider_app_download_clicked", {
                        cta_name: "google_play",
                        currency_pair: selectedPair,
                        platform: "android",
                        provider_name: rate.provider,
                        provider_rank: index + 1,
                        store_type: "google_play",
                        time_before_click: getSecondsBeforeClick(compareStartedAt.current)
                      })
                    }
                  >
                    <GooglePlayIcon />
                    <span className="sr-only">Google Play</span>
                  </a>
                </span>
              </div>
              <details
                className="mobile-details-toggle"
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    trackAnalyticsEvent("provider_row_expanded", {
                      cta_name: "view_details",
                      currency_pair: selectedPair,
                      provider_name: rate.provider,
                      provider_rank: index + 1
                    });
                  }
                }}
              >
                <summary>
                  <span className="details-label-closed">View details</span>
                  <span className="details-label-open">Hide details</span>
                </summary>
                <div className="mobile-provider-details">
                  <ProviderDetails providerRank={index + 1} rate={rate} />
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </section>
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

function ProviderDetails({
  providerRank,
  rate
}: {
  providerRank: number;
  rate: ProviderRate;
}) {
  return (
    <div className="provider-details">
      <div>
        <h3>{rate.provider} provider information</h3>
        <p>
          {rate.provider} is listed here as a transfer provider for comparison.
          Complete any transfer directly on the provider&apos;s own secure
          platform.
        </p>
      </div>
      <div>
        <h4>Supported currencies</h4>
        <p>{rate.supportedCurrencies.join(", ")}</p>
      </div>
      <div>
        <h4>Transfer methods</h4>
        <p>{rate.transferMethods.join(", ")}</p>
        <a
          className="text-button"
          href={rate.surveyUrl}
          onClick={() =>
            trackAnalyticsEvent("provider_survey_clicked", {
              cta_name: "provider_feedback",
              provider_name: rate.provider,
              provider_rank: providerRank
            })
          }
        >
          Share provider feedback
        </a>
      </div>
    </div>
  );
}

function getSecondsBeforeClick(startedAt: number) {
  return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
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
