# AGENTS.md

This is the operating source of truth for Paritium website development.

Every AI agent, developer, and future contributor should read this file before making product, code, UX, data, analytics, security, or design decisions in this repository. Keep it current as the project evolves.

## Source Of Truth Contract

`AGENTS.md` is the canonical project guide moving forward.

Use this precedence order when making decisions:

1. Direct user or product-owner instruction in the current task.
2. This `AGENTS.md` file.
3. Current code in the repository.
4. The PRD and supporting product/design documents.
5. General framework or library best practices.

If the PRD, design notes, or implementation drift away from this file, update this file as part of the same work. Do not let important product decisions live only in chat history, temporary notes, or hidden files.

Treat this file as living documentation:

- Update it when product scope changes.
- Update it when the design system changes.
- Update it when routes, architecture, provider integrations, analytics, security, deployment, or verification workflows change.
- Update it when a placeholder becomes production-ready.
- Update it when a new rule would prevent future confusion.
- Keep it specific to this repository, not generic Next.js advice.

When a future agent is unsure, it should pause and check this file first. If this file is silent and the decision affects product behavior, user trust, data handling, compliance, or external integrations, ask the user before acting.

## Project Overview

Paritium is a Next.js exchange-rate comparison website for consumers, travellers, diaspora communities, and small businesses. Its purpose is to help users compare published foreign exchange rates across transfer providers before deciding where to continue.

Product URL: `https://paritium.com`

Primary stakeholders: Greenvine Technologies & EccentricLLC.

Development lead named in the PRD: Faith.

Current product phase: website/prototype implementation. The Paritium mobile app is a separate future workstream.

## Core Product Rules

- Paritium is a comparison and discovery platform, not a money transfer provider.
- Never imply Paritium executes transfers, holds money, processes payments, guarantees checkout rates, or replaces provider due diligence.
- Show provider-published rates only. Do not add calculator/send-amount flows unless the PRD is updated.
- Rank providers by the best rate for the selected currency pair, highest rate first.
- Always display rate freshness context. Stale rates are rates older than 2 hours.
- Provider website and app-store links must send users to the provider's own platform in a new tab.
- Survey collection is part of the product, both for Paritium feedback and provider-specific sentiment.
- The future Paritium app section should remain "coming soon" until real App Store and Google Play URLs are supplied.

These rules are product-critical. Do not relax them through small copy or UI changes. A change to any of these rules requires explicit user or product-owner approval and an update to this file.

## Important Source Documents

- `.tmp_prd_text.txt` contains the current PRD text, version 1.1, June 2026.
- `app/globals.css` currently acts as the design-system source of truth through CSS variables and reusable component classes.
- There is no standalone design-system document checked into the repository at the time this file was created.

If future work depends on production provider APIs, analytics IDs, survey URLs, store links, privacy terms, or legal/compliance copy, ask for those exact assets instead of inventing them.

If another source document changes, summarize the actionable decision here. External documents may contain background, but this file should contain the rule future agents must follow.

## Tech Stack

- Framework: Next.js 15 App Router
- Runtime/UI: React 19
- Language: TypeScript with `strict` enabled
- Styling: global CSS in `app/globals.css`
- Icons/logos: `simple-icons` where available, wordmark fallback otherwise
- Routing: file-based App Router pages under `app/`
- API route: `app/api/rates/route.ts`

Package scripts:

```sh
npm run dev
npm run build
npm run start
npm run lint
```

Note: `npm run lint` uses `next lint`, which may require configuration depending on the installed Next.js version. Prefer `npm run build` as the minimum verification command for TypeScript and production compilation.

## Repository Map

- `app/layout.tsx`: root metadata and global layout.
- `app/page.tsx`: homepage, hero rate selector/summary, provider cards, how-it-works, app CTA, routes, FAQ, survey CTA.
- `app/compare/page.tsx`: Compare Rates page shell and metadata.
- `app/compare/CompareRatesClient.tsx`: interactive currency-pair selector, rate table, expandable provider details, mobile rate cards.
- `app/how-it-works/page.tsx`: educational explainer and FAQ.
- `app/about/page.tsx`: mission, stakeholders, provider coverage, contact CTA.
- `app/survey/page.tsx`: survey placeholder, provider-specific survey list, thank-you section.
- `app/privacy/page.tsx`: privacy policy covering analytics consent, browser storage, surveys, external links, retention, and user rights.
- `app/terms/page.tsx`: terms covering comparison scope, rate and ranking limitations, external providers, acceptable use, and liability boundaries.
- `app/api/rates/route.ts`: JSON API for rate data by currency pair.
- `app/sitemap.ts` and `app/robots.ts`: SEO discovery routes.
- `components/SiteHeader.tsx`: shared responsive header, primary navigation, active route state, CTA, and mobile hamburger menu.
- `components/SiteFooter.tsx`: shared footer.
- `lib/rates.ts`: compatibility facade for rate types, mock helpers, and the async rate service.
- `lib/rates/`: provider metadata, currency-pair config, mock fallback data, connector contracts, and rate-service orchestration.
- `lib/rates/connectors/`: one provider connector per module. `wise.ts` is scaffolded and activates only when `WISE_API_TOKEN` is configured.
- `app/globals.css`: design tokens, layout primitives, component styling, responsive rules.

## Current Functional Surface

Implemented pages:

- `/`
- `/compare`
- `/how-it-works`
- `/about`
- `/survey`
- `/privacy`
- `/terms`
- `/api/rates?pair=GBP_NGN`
- `/sitemap.xml`
- `/robots.txt`

Current currency pairs:

- `GBP_NGN`
- `USD_NGN`
- `EUR_NGN`
- `CAD_NGN`

Current providers represented in mock/config data:

- Wise
- LemFi
- Remitly
- WorldRemit
- MoneyGram
- TapTap Send

Current provider links are placeholder Google searches generated in `lib/rates.ts`. Replace them with real provider website, App Store, and Google Play URLs before production.

## Data Model Guidance

Rate data is represented by `ProviderRate` in `lib/rates.ts`.

Keep provider data normalized around these fields:

- `provider`
- `shortName`
- `logo`
- `rate`
- `rateLabel`
- `updatedAt`
- `stale`
- `websiteUrl`
- `appStoreUrl`
- `playStoreUrl`
- `surveyUrl`
- `supportedCurrencies`
- `transferMethods`

When adding live integrations, preserve the frontend-facing shape unless there is a clear migration plan. New providers should be addable through provider metadata plus a self-contained connector module without rewriting table rendering.

Future connector architecture should support:

- One provider integration per module.
- A shared normalized output schema.
- Cached last-known-good rates.
- Graceful API failure handling.
- Manual refresh capability for admins without a redeploy.
- At least 20 provider integrations over time.

Current connector architecture:

- Shared types live in `lib/rates/types.ts`.
- Currency pairs live in `lib/rates/pairs.ts`.
- Provider display metadata lives in `lib/rates/provider-metadata.ts`.
- Mock fallback data lives in `lib/rates/mock-data.ts`.
- Connector contracts live in `lib/rates/connectors/types.ts`.
- Registered live connectors live in `lib/rates/connectors/index.ts`.
- `fetchRates(pair)` in `lib/rates/service.ts` combines configured live connectors, provider-level fallback quotes, and remaining mock providers, then sorts by best rate.
- `/api/rates` must call the rate service, not hardcoded provider arrays.
- Client-facing rate refresh flows on the homepage and Compare Rates page should fetch `/api/rates?pair=...`; direct mock helpers are only initial fallbacks for fast first render.
- Live connector secrets must be read only from server environment variables and must never be exposed to client components.
- Keep mock fallback data until a provider has a production-ready connector and confirmed public display permission.

## UX And Content Principles

- Lead with the actual comparison experience, not a marketing-only landing page.
- The homepage hero should launch users into the Compare Rates table. Keep the selector CTA linked to `/compare?pair=...#rates-title`; do not reintroduce a best-rate summary card in the hero.
- Keep copy transparent, practical, and confidence-building.
- Use "published rates" language when describing data.
- Mention that checkout rates may differ because providers can change rates or fees.
- Preserve the distinction between comparing on Paritium and transferring with a provider.
- Keep pages scannable for mobile users.
- Use semantic HTML, accessible labels, table captions, and clear focusable controls.
- Avoid adding user login/account flows in the current phase.
- Avoid fee comparison, transfer estimates, and send-amount inputs unless explicitly approved.

## Design System Notes

Primary tokens live in `app/globals.css`.

Typography:

- Heading font: Manrope, falling back to Inter/system sans.
- Body font: Inter/system sans.
- Do not use negative letter spacing.
- Use responsive `clamp()` only where existing patterns already do.

Core colors:

- `--color-black`: `#050505`
- `--color-ink`: `#14171a`
- `--color-muted`: `#596067`
- `--color-border`: `#dce2e0`
- `--color-surface`: `#f5f7f4`
- `--color-white`: `#ffffff`
- `--color-green`: `#119b65`
- `--color-blue`: `#174de8`
- `--color-warning`: `#b95000`

Layout:

- Use `.section-pad` for page sections.
- Respect `--max-width: 1312px`.
- Keep repeated items as cards, but do not nest cards inside cards.
- Preserve stable table/mobile-card behavior for compare views.
- Buttons use `.button`, `.button-primary`, `.button-secondary`, `.button-invert`, or `.text-button`.
- Provider logos should use `.provider-logo` and `ProviderLogo` patterns already present in pages.

Illustration direction:

- Use a premium glossy 3D/glassmorphic illustration style across custom visuals.
- Prefer pearlescent silver, soft blue, lavender, and subtle green accents with translucent materials, inner highlights, and soft depth shadows.
- Keep illustration details finance-relevant: cards, shields, keys, globes, phones, checks, provider/rate objects, and trusted comparison signals.
- Avoid flat, cartoonish, or mismatched CSS doodles unless intentionally restyled into the shared glossy 3D language.

Responsive expectations:

- Tables may horizontally scroll on desktop/tablet where appropriate.
- Compare page must retain mobile card alternatives for small viewports.
- Header/nav changes should be checked on mobile; current navigation is simple and may need a proper hamburger before production.

## Accessibility Requirements

Target WCAG 2.1 AA.

For new UI:

- Use semantic landmarks and headings in order.
- Give icon-only controls an accessible name.
- Use real buttons for in-page actions and links for navigation.
- Keep table headers, captions, and row content meaningful.
- Maintain visible focus states.
- Do not rely on color alone for stale/best-rate status.
- Keep form labels explicit and connected to controls where possible.

## SEO Requirements

- Keep metadata per page using Next.js `Metadata`.
- Preserve `metadataBase` as `https://paritium.com`.
- Use `public/paritium-og-home.jpg` as the default 1200x630 Open Graph and Twitter sharing image.
- The favicon is the lowercase Paritium `p` mark in `app/icon.svg`.
- Update `app/sitemap.ts` whenever adding public pages.
- Keep `app/robots.ts` aligned with launch indexing requirements.
- Use descriptive titles and meta descriptions.
- Keep content server-rendered where possible for SEO.

## Analytics And Consent

The PRD requires:

- Google Analytics 4 as the primary analytics platform.
- A secondary behavior tool such as Hotjar or Microsoft Clarity.
- Cookie consent before analytics activation.
- Google Analytics is integrated globally through `components/GoogleAnalytics.tsx` and configured with `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Do not load `gtag.js` until the visitor accepts analytics cookies. Preserve the persistent accept/reject controls and consent withdrawal path.
- A stakeholder-accessible GA4 or Looker Studio dashboard.

Events that should be tracked once analytics is implemented:

- Page views.
- Currency pair selected.
- Provider row viewed or expanded.
- Provider website clicked.
- App Store link clicked.
- Google Play link clicked.
- Paritium survey clicked.
- Provider-specific survey clicked.
- Future Paritium app CTA clicked.
- Notify-me form submitted, without storing PII in analytics.
- Time spent on Compare Rates before provider click.

Do not add analytics that fires before consent.

## Security Requirements

Before production launch:

- Serve all traffic over HTTPS.
- Keep API keys and credentials in environment variables only.
- Do not expose provider secrets to client-side bundles.
- Add rate limiting to backend API endpoints that call external providers.
- Add CSP, X-Frame-Options or modern equivalents, and other standard security headers.
- Avoid storing PII unless consent and storage requirements are explicit.
- Run dependency vulnerability checks.
- Validate headers with a target of securityheaders.com grade B or better.

Current `next.config.mjs` disables `x-powered-by` via `poweredByHeader: false`. Expand it carefully when adding security headers.

## Development Conventions

- Use TypeScript and keep `strict` clean.
- Prefer server components by default. Use `"use client"` only for interactive UI.
- Keep shared data and transformation logic in `lib/`.
- Keep reusable visual pieces in `components/` when they are shared across pages.
- Prefer existing CSS classes and tokens over adding one-off styling.
- Avoid broad refactors unless required by the task.
- Avoid hardcoding production secrets, analytics IDs, survey form IDs, or external API credentials.
- Keep imports using the `@/*` path alias when importing from project root.
- Preserve the product disclaimer in footer and relevant trust sections.

## Keeping This File Current

Whenever a task changes the product or architecture in a meaningful way, update this file in the same change.

Meaningful changes include:

- Adding, removing, or renaming routes.
- Changing the comparison model, ranking logic, data freshness rules, or provider schema.
- Replacing mock provider data with live connectors.
- Adding analytics, consent, surveys, email capture, storage, or any user-data handling.
- Adding production provider links, app links, legal pages, or contact details.
- Changing visual tokens, typography, spacing, layout primitives, or reusable component conventions.
- Adding deployment, monitoring, CI/CD, security, or testing workflows.
- Changing what future agents should ask before acting.

When updating this file, prefer concise rules over long narratives. Future agents should be able to scan it and act.

## Verification Checklist

For code changes, run:

```sh
npm run build
```

When relevant, also verify:

- `/` renders without hydration errors.
- `/compare` currency selector updates table and mobile cards.
- Stale-rate alerts still appear when expected.
- Provider detail expansion works.
- `/api/rates?pair=GBP_NGN` returns JSON.
- Unknown API pair values fall back to `GBP_NGN`.
- New public pages are included in `app/sitemap.ts`.
- External links use `target="_blank"` and `rel="noreferrer"`.

For visual changes, check desktop and mobile widths. Pay special attention to header wrapping, rate tables, provider cards, and long provider names.

## Known Gaps And Open Inputs Needed

The repo currently uses mock/configured rate data, not live provider APIs.

Inputs still needed for production:

- Confirmed provider API access and rate limits.
- Wise production/sandbox base URL and token, using `WISE_API_BASE_URL` and `WISE_API_TOKEN` locally.
- Real provider website URLs.
- Real App Store and Google Play URLs for each provider.
- Final Paritium survey URL or embed code.
- Provider-specific survey URLs or form-generation approach.
- GA4 measurement ID.
- Hotjar or Microsoft Clarity project ID, if used.
- Cookie consent implementation requirements.
- Legal review of the Privacy Policy and confirmation of the responsible legal entity and mailing address.
- Legal review of the Terms of Use, including confirmation of governing law and forum. Cookie disclosures currently live in `/privacy#cookies`.
- Contact and social URLs.
- Paritium app store URLs when launched.
- Hosting/CDN/security-header requirements.
- Monitoring and error tracking configuration.

## PRD Acceptance Criteria To Preserve

- Live rates from at least 3 providers displayed on page load.
- Rate timestamps are accurate and visible.
- API failures do not crash pages; last-known rates and staleness warnings are shown.
- Surveys are accessible without login.
- Provider-specific survey links exist beside provider rows.
- GA4 page views and custom click events work on all pages once analytics is configured.
- Cookie consent happens before analytics tracking.
- New provider integrations are documented and addable quickly.
- SSL, security headers, and secret handling are production-ready.
- Provider app links are visible and tracked.
- Paritium app CTAs are future-ready but disabled until launch.

## When To Ask Before Acting

Ask the user or product owner before:

- Adding a money-transfer flow, amount calculator, account system, or transaction feature.
- Changing the claim that Paritium is not a transfer provider.
- Introducing real provider API integrations without credentials and usage terms.
- Adding analytics or heatmap tools without consent requirements.
- Publishing legal/compliance copy.
- Replacing the design direction or core brand palette.
- Adding production email capture/storage.

## Agent Working Style For This Repo

Be conservative, product-aware, and implementation-focused. The key risk is accidentally turning Paritium from a transparent comparison tool into something that appears to quote, broker, or execute transfers. Keep the experience honest: compare rates clearly, disclose freshness, link users out, collect feedback, and leave final transfer decisions to provider platforms.
