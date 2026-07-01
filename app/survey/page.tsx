import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TrackedLink from "@/components/TrackedLink";

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
          <TrackedLink
            className="button button-primary survey-hero-cta"
            eventName="paritium_survey_clicked"
            eventParameters={{
              cta_name: "start_paritium_survey",
              page_origin: "survey_page_hero"
            }}
            href="https://s.surveyplanet.com/ug5yk3hj"
          >
            Start Paritium survey
          </TrackedLink>
        </div>
        <div className="survey-hero-media" aria-label="People reviewing exchange-rate feedback">
          <Image
            alt="A diverse group reviewing survey feedback and exchange-rate comparison screens"
            height={699}
            priority
            sizes="(max-width: 960px) calc(100vw - 40px), 48vw"
            src="/survey-research-hero.webp"
            unoptimized
            width={1440}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
