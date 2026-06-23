"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";

type SiteHeaderProps = {
  ctaHref?: Route;
  ctaLabel?: string;
};

const navItems = [
  { href: "/compare", label: "Compare Rates" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/survey", label: "Survey" }
] satisfies Array<{ href: Route; label: string }>;

export default function SiteHeader({
  ctaHref = "/compare",
  ctaLabel = "Compare Rates Now"
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header" data-menu-open={menuOpen}>
      <Link className="logo" href="/" aria-label="Paritium home">
        Paritium
      </Link>

      <button
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      <div className="site-nav-panel" id="primary-navigation">
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              href={item.href}
              key={item.href}
              onClick={() => {
                if (item.href === "/survey") {
                  trackAnalyticsEvent("paritium_survey_clicked", {
                    page_origin: `${pathname}:header_navigation`
                  });
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          className="button button-primary nav-cta"
          href={ctaHref}
          onClick={() => {
            if (ctaHref === "/survey") {
              trackAnalyticsEvent("paritium_survey_clicked", {
                page_origin: `${pathname}:header_cta`
              });
            }
          }}
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
