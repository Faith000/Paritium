import { NextResponse } from "next/server";
import { fetchRates, normalizeCurrencyPair } from "@/lib/rates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pair = normalizeCurrencyPair(searchParams.get("pair"));
  const rates = await fetchRates(pair);

  return NextResponse.json(rates);
}
