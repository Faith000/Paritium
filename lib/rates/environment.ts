export function getRateDataMode() {
  if (
    process.env.PARITIUM_DATA_MODE === "production" ||
    process.env.VERCEL_ENV === "production"
  ) {
    return "production";
  }

  return "preview";
}

export function shouldUseProductionRateData() {
  return getRateDataMode() === "production";
}
