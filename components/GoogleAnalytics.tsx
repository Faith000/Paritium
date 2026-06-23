"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analytics";

type AnalyticsConsent = "accepted" | "rejected";

const GOOGLE_ANALYTICS_SCRIPT_ID = "paritium-google-analytics";

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const configuredMeasurementId = useRef<string | null>(null);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(
      ANALYTICS_CONSENT_STORAGE_KEY
    );

    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setConsent(storedConsent);
      return;
    }

    setShowPreferences(true);
  }, []);

  useEffect(() => {
    if (consent !== "accepted" || !measurementId) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    const existingScript = document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID) as HTMLScriptElement | null;

    function markAnalyticsReady() {
      const script = document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID) as HTMLScriptElement | null;
      if (script) {
        script.dataset.loaded = "true";
      }
      setAnalyticsReady(true);
    }

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        setAnalyticsReady(true);
      } else {
        existingScript.addEventListener("load", markAnalyticsReady, { once: true });
      }
    } else {
      window.gtag("js", new Date());

      const script = document.createElement("script");
      script.async = true;
      script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.addEventListener("load", markAnalyticsReady, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      existingScript?.removeEventListener("load", markAnalyticsReady);
    };
  }, [consent, measurementId]);

  useEffect(() => {
    if (
      consent !== "accepted" ||
      !analyticsReady ||
      !measurementId ||
      !window.gtag ||
      lastTrackedPath.current === pathname
    ) {
      return;
    }

    if (configuredMeasurementId.current !== measurementId) {
      window.gtag("config", measurementId, { send_page_view: false });
      configuredMeasurementId.current = measurementId;
    }

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
      send_to: measurementId
    });
    lastTrackedPath.current = pathname;
  }, [analyticsReady, consent, measurementId, pathname]);

  function saveConsent(nextConsent: AnalyticsConsent) {
    const analyticsWasLoaded = consent === "accepted";

    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, nextConsent);
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
      ) : null}
    </>
  );
}
