import type { MetadataRoute } from "next";

const routes = [
  "",
  "/compare",
  "/how-it-works",
  "/about",
  "/survey",
  "/privacy",
  "/terms"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://paritium.com${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
