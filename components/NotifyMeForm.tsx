"use client";

import { useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function NotifyMeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"error" | "idle" | "success">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="notify-form"
      onSubmit={async (event) => {
        event.preventDefault();

        setIsSubmitting(true);
        setMessage("");
        setStatus("idle");

        try {
          const response = await fetch("/api/notify", {
            body: JSON.stringify({
              email,
              sourceSection: "homepage_app_coming_soon"
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          });
          const result = (await response.json()) as { message?: string };

          if (!response.ok) {
            throw new Error(result.message ?? "Please try again.");
          }

          setEmail("");
          setStatus("success");
          setMessage(
            result.message ??
              "You are on the list. We will let you know when Paritium launches."
          );
          trackAnalyticsEvent("notify_me_submitted", {
            cta_name: "notify_me",
            source_section: "homepage_app_coming_soon"
          });
        } catch (error) {
          setStatus("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Please try again in a moment."
          );
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <label htmlFor="email">Email address</label>
      <div>
        <input
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Joining..." : "Notify me"}
        </button>
      </div>
      {message ? (
        <p className={`notify-form-message notify-form-message-${status}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
