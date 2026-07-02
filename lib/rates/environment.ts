export function shouldUseProductionRateData() {
  return (
    process.env.PARITIUM_DATA_MODE === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

