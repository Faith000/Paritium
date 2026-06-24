"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function SurveyCompletionTracker() {
  useEffect(() => {
    trackAnalyticsEvent("paritium_survey_completed", {
      page_origin: "surveyplanet_completion_redirect"
    });
  }, []);

  return null;
}
