export const ANALYTICS_CONSENT_STORAGE_KEY = "paritium_analytics_consent";
export const ANALYTICS_PREFERENCES_EVENT = "paritium:open-analytics-preferences";

export type AnalyticsEventMap = {
  currency_pair_selected: {
    cta_name: string;
    currency_pair: string;
    from_currency: string;
    to_currency: string;
  };
  provider_row_expanded: {
    cta_name: "view_details";
    currency_pair: string;
    provider_name: string;
    provider_rank: number;
  };
  provider_visit_clicked: {
    cta_name: "visit_website";
    currency_pair: string;
    provider_name: string;
    provider_rank: number;
    time_before_provider_click_seconds?: number;
  };
  provider_app_download_clicked: {
    cta_name: "app_store" | "google_play";
    currency_pair: string;
    platform: "android" | "ios";
    provider_name: string;
    provider_rank: number;
    store_type: "app_store" | "google_play";
    time_before_provider_click_seconds: number;
  };
  paritium_survey_clicked: {
    cta_name: string;
    page_origin: string;
  };
  paritium_survey_completed: {
    page_origin: string;
  };
  provider_survey_clicked: {
    cta_name: "provider_feedback";
    provider_name: string;
    provider_rank?: number;
  };
  notify_me_submitted: {
    cta_name: "notify_me";
    source_section: string;
  };
  paritium_app_cta_clicked: {
    cta_name: string;
    platform: "android" | "ios" | "web";
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    paritiumAnalyticsQueue?: Array<{
      eventName: AnalyticsEventName;
      parameters: AnalyticsEventMap[AnalyticsEventName];
    }>;
    paritiumAnalyticsReady?: boolean;
  }
}

export function trackAnalyticsEvent<EventName extends AnalyticsEventName>(
  eventName: EventName,
  parameters: AnalyticsEventMap[EventName]
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

  if (!window.paritiumAnalyticsReady) {
    window.paritiumAnalyticsQueue = window.paritiumAnalyticsQueue || [];
    window.paritiumAnalyticsQueue.push({
      eventName,
      parameters
    });
    return;
  }

  window.gtag("event", eventName, parameters);
}
