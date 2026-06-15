import { NextResponse } from "next/server";
import { getRates, type CurrencyPair } from "@/lib/rates";

const allowedPairs = new Set(["USD_NGN", "GBP_NGN", "EUR_NGN", "CAD_NGN"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedPair = searchParams.get("pair") ?? "GBP_NGN";
  const pair = allowedPairs.has(requestedPair)
    ? (requestedPair as CurrencyPair)
    : "GBP_NGN";

  return NextResponse.json({
    pair,
    refreshedAt: new Date().toISOString(),
    providers: getRates(pair)
  });
}
