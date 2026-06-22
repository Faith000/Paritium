"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AnalyticsConsent = "accepted" | "rejected";

const CONSENT_STORAGE_KEY = "paritium_analytics_consent";
const GOOGLE_ANALYTICS_SCRIPT_ID = "paritium-google-analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setConsent(storedConsent);
      return;
    }

    setShowPreferences(true);
  }, []);

  useEffect(() => {
    if (consent !== "accepted" || !measurementId || lastTrackedPath.current === pathname) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    if (lastTrackedPath.current === null) {
      window.gtag("js", new Date());

      if (!document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.async = true;
        script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
      }
    }

    window.gtag("config", measurementId, { page_path: pathname });
    lastTrackedPath.current = pathname;
  }, [consent, measurementId, pathname]);

  function saveConsent(nextConsent: AnalyticsConsent) {
    const analyticsWasLoaded = consent === "accepted";

    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextConsent);
    setConsent(nextConsent);
    setShowPreferences(false);

    if (analyticsWasLoaded && nextConsent === "rejected") {
      window.location.reload();
    }
  }

  if (!measurementId) {
    return null;
  }

  return (
    <>
      {showPreferences ? (
        <section className="cookie-consent" aria-label="Analytics cookie preferences">
          <div>
            <strong>Help us improve Paritium</strong>
            <p>
              We use Google Analytics to understand how people use the website. Analytics
              cookies are optional and are only activated with your permission.
            </p>
          </div>
          <div className="cookie-consent-actions">
            <button className="button button-secondary" type="button" onClick={() => saveConsent("rejected")}>
              Reject analytics
            </button>
            <button className="button button-primary" type="button" onClick={() => saveConsent("accepted")}>
              Accept analytics
            </button>
          </div>
        </section>
      ) : (
        <button
          className="cookie-preferences-trigger"
          type="button"
          onClick={() => setShowPreferences(true)}
        >
          Cookie preferences
        </button>
      )}
    </>
  );
}
