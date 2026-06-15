import type { RateProviderConnector } from "./types";

type WiseRateResponse = {
  rate: number;
  source: string;
  target: string;
  time: string;
};

export const wiseConnector: RateProviderConnector = {
  providerId: "wise",
  enabled: Boolean(getWiseToken()),
  async fetchRate(request, context) {
    const token = getWiseToken();
    const baseUrl = process.env.WISE_API_BASE_URL ?? "https://api.wise.com";

    if (!token) {
      throw new Error("WISE_API_TOKEN or WISE_API_KEY is not configured");
    }

    const url = new URL("/v1/rates", baseUrl);
    url.searchParams.set("source", request.source);
    url.searchParams.set("target", request.target);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      next: {
        revalidate: 60 * 60
      },
      signal: context?.signal
    });

    if (!response.ok) {
      throw new Error(`Wise rates request failed with ${response.status}`);
    }

    const data = (await response.json()) as WiseRateResponse | WiseRateResponse[];
    const rate = Array.isArray(data) ? data[0] : data;

    if (!rate?.rate || !rate.time) {
      throw new Error("Wise rates response did not include rate and time");
    }

    return {
      providerId: "wise",
      rate: rate.rate,
      updatedAt: rate.time,
      source: "live"
    };
  }
};

function getWiseToken() {
  return process.env.WISE_API_TOKEN ?? process.env.WISE_API_KEY;
}
