"use client";

import { ANALYTICS_PREFERENCES_EVENT } from "@/lib/analytics";

export default function CookiePreferencesButton() {
  return (
    <button
      className="footer-link-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT))}
    >
      Cookie preferences
    </button>
  );
}
