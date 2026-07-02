import type { Metadata } from "next";
import { Suspense } from "react";
import {
  fetchRates,
  getAllRates,
  getCurrencyPairs,
  normalizeCurrencyPair
} from "@/lib/rates";
import { shouldUseProductionRateData } from "@/lib/rates/environment";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CompareRatesClient from "./CompareRatesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare Rates | Paritium",
  description:
    "Compare published exchange rates, provider links, app download links, and provider survey links."
};

type CompareRatesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CompareRatesPage({
  searchParams
}: CompareRatesPageProps) {
  const pairs = getCurrencyPairs();
  const ratesByPair = getAllRates();
  const productionRateData = shouldUseProductionRateData();
  const params = await searchParams;
  const selectedPair = normalizeCurrencyPair(getSearchParam(params?.pair));
  const sourceAmount = getValidAmount(getSearchParam(params?.amount));

  try {
    const liveRates = await fetchRates(selectedPair, sourceAmount);

    ratesByPair[selectedPair] = liveRates.providers;
  } catch {
    if (productionRateData) {
      ratesByPair[selectedPair] = [];
    }
  }

  return (
    <main>
      <SiteHeader ctaHref="/survey" ctaLabel="Share Feedback" />

      <section className="compare-hero section-pad">
        <div>
          <p className="eyebrow">Compare rates</p>
          <h1>
            {productionRateData
              ? "Wise exchange rates for selected routes."
              : "Provider exchange rates, ranked by value."}
          </h1>
        </div>
      </section>

      <Suspense fallback={null}>
        <CompareRatesClient
          pairs={pairs}
          ratesByPair={ratesByPair}
        />
      </Suspense>
      <SiteFooter />
    </main>
  );
}

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

function getValidAmount(value: string | null) {
  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}
