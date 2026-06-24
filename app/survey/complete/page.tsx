import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SurveyCompletionTracker from "@/components/SurveyCompletionTracker";

export const metadata: Metadata = {
  title: "Survey Complete | Paritium",
  description: "Thank you for helping improve Paritium.",
  robots: {
    index: false,
    follow: false
  }
};

export default function SurveyCompletePage() {
  return (
    <main>
      <SiteHeader />
      <SurveyCompletionTracker />
      <section className="legal-hero section-pad">
        <div>
          <p className="eyebrow">Survey complete</p>
          <h1>Thank you for sharing your perspective.</h1>
          <p>
            Your feedback will help Paritium make exchange-rate comparison clearer,
            fairer, and more useful.
          </p>
          <a className="button button-primary" href="/compare">
            Compare rates
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
