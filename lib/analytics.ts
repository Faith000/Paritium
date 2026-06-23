export const ANALYTICS_CONSENT_STORAGE_KEY = "paritium_analytics_consent";

export type AnalyticsEventName =
  | "currency_pair_selected"
  | "provider_row_expanded"
  | "provider_visit_clicked"
  | "provider_app_download_clicked"
  | "paritium_survey_clicked"
  | "provider_survey_clicked"
  | "notify_me_submitted"
  | "paritium_app_cta_clicked";

export type AnalyticsEventParameters = Record<
  string,
  boolean | number | string | undefined
>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  parameters: AnalyticsEventParameters = {}
) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  try {
    if (
      window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) !== "accepted"
    ) {
      return;
    }
  } catch {
    return;
  }

  window.gtag("event", eventName, parameters);
}
