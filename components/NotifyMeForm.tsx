"use client";

import { trackAnalyticsEvent } from "@/lib/analytics";

export default function NotifyMeForm() {
  return (
    <form
      className="notify-form"
      onSubmit={(event) => {
        event.preventDefault();
        trackAnalyticsEvent("notify_me_submitted", {
          click_type: "form_submit",
          cta_name: "notify_me",
          source_section: "homepage_app_coming_soon"
        });
      }}
    >
      <label htmlFor="email">Email address</label>
      <div>
        <input id="email" type="email" placeholder="you@example.com" required />
        <button type="submit">Notify me</button>
      </div>
    </form>
  );
}
