import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Survey | Paritium",
  description:
    "Share feedback about Paritium and your transfer provider experience."
};

export default function SurveyPage() {
  return (
    <main>
      <SiteHeader />

      <section className="survey-hero section-pad">
        <div>
          <p className="eyebrow">User research</p>
          <h1>Help us build fairer exchange-rate comparison.</h1>
          <p>
            Your feedback helps Paritium understand the routes people compare,
            the providers they trust, and the features that would make exchange
            rate decisions easier.
          </p>
          <a className="button button-primary survey-hero-cta" href="/survey?form=paritium">
            Start Paritium survey
          </a>
        </div>
        <div className="survey-hero-media" aria-label="People reviewing exchange-rate feedback">
          <img
            alt="A diverse group reviewing survey feedback and exchange-rate comparison screens"
            src="/survey-research-hero.png"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
