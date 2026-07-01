import { NextResponse } from "next/server";
import { fetchRates, normalizeCurrencyPair } from "@/lib/rates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pair = normalizeCurrencyPair(searchParams.get("pair"));
  const amount = normalizeAmount(searchParams.get("amount"));
  const rates = await fetchRates(pair, amount);

  return NextResponse.json(rates);
}

function normalizeAmount(value: string | null) {
  if (!value) return undefined;

  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}
