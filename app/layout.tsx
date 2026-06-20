import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paritium | Compare live exchange rates",
  description:
    "Compare today's published foreign exchange rates from leading money transfer providers before you move money.",
  metadataBase: new URL("https://paritium.com"),
  openGraph: {
    title: "Paritium | Compare live exchange rates",
    description:
      "Find the best published exchange rate across multiple transfer providers.",
    url: "https://paritium.com",
    siteName: "Paritium",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics measurementId={googleAnalyticsId} />
      </body>
    </html>
  );
}
