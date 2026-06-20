import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const siteTitle = "Paritium | Compare Live Exchange Rates";
const siteDescription =
  "Compare live provider-published exchange rates and find the best deal before you transfer.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL("https://paritium.com"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }]
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://paritium.com",
    siteName: "Paritium",
    type: "website",
    images: [
      {
        url: "/paritium-og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Paritium homepage showing a live exchange-rate comparison"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/paritium-og-home.jpg"]
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
