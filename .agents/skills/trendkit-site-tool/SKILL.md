---
name: trendkit-site-tool
description: Add or maintain a browser-based utility on TrendKit's Next.js home site, including catalog, SEO, official guidance, and local validation.
---

# TrendKit site tools

Use this workflow for a new tool served from `trendkit.app/tools/*`.

## Map the existing entry points

- `apps/home/lib/tools.ts` holds metadata, search keywords, category, and slug for first-party tools.
- `apps/home/lib/catalog.ts` combines first-party tools and linked services. The home page shows only the first eight catalog entries, so set `FEATURED_TOOLS` when a new tool should appear there.
- `apps/home/app/tools/<slug>/page.tsx` owns the server-rendered page, metadata, article, and FAQ. Reuse `ToolPage` and `toolMetadata` from `apps/home/app/tools/_components/ToolPage.tsx`.
- `apps/home/app/tools/<slug>/<Component>.tsx` holds client-side interactions.
- `apps/home/app/tools/tools.css` contains shared tool styles. Prefix new feature styles to avoid collisions.
- `apps/home/app/sitemap.ts` builds tool URLs from `TOOLS`; adding a valid slug to `apps/home/lib/tools.ts` adds the route to the sitemap.
- `apps/home/app/tools/page.tsx` owns the catalog page title, description, and common FAQ.

## Add or update a tool

1. State the visitor's task and the success state in plain language.
2. For service policies, verify claims and destination URLs against official provider documentation. Keep links to the source beside the related instructions. Do not claim to read account-specific plans, prices, dates, or states unless the app actually does so.
3. Add the tool's metadata and Korean search phrases to `apps/home/lib/tools.ts`.
4. Add a catalog category if the existing groups do not fit. Set a featured order in `apps/home/lib/catalog.ts` when the tool belongs on the home page.
5. Create the route page and interactive component. Put substantial explanatory text and FAQ in the server-rendered page so search crawlers can read it.
6. Reuse the shared ad, related-tool, breadcrumb, and footer placement from `ToolPage`.
7. Update catalog page copy when it would otherwise omit the new tool or misdescribe its behavior.

For subscription cancellation guidance, treat service cancellation and payment-channel cancellation as separate paths. Include App Store, Google Play, direct billing, partner billing, and an unknown-billing path. Make clear that visitors finish cancellation on the provider's site and verify the renewal status there. Keep refunds separate from stopping future renewals.

The service suggestions and curated instructions come from `apps/home/lib/subscription-guides.ts`. Add a canonical name and common Korean/English aliases there; the datalist and matching logic use this registry. Update the subscription tool metadata in `apps/home/app/tools/subscription-cancel/page.tsx` and search keywords in `apps/home/lib/tools.ts` when adding a provider. Confirm each account-management and support link on the provider's official site, and keep trial wording conditional because eligibility and billing dates are account-specific. Names absent from the registry remain typeable and open a user-initiated web search query; the app does not crawl accounts or automatically verify search results. Keep an in-page reminder to confirm that the result belongs to the provider or billing partner.

## Validate locally

From the repository root, run:

```sh
npm ci
npm run build --workspace=apps/home
npm run dev --workspace=apps/home
```

Open `/tools/<slug>` and check the principal selection flows, provider links, phone-width layout, page title and description, catalog discovery, and sitemap entry. The production build runs Next.js compilation and type validation. Do not add dependencies or edit the lockfile for a tool that can use existing packages.

## Git and release

Follow the user's branch preference. If the user has asked to work directly on `main`, stay on `main`; otherwise use a feature branch. Leave commits, pushes to GitHub, and production deployment to the user unless the user explicitly asks for those actions. When asked for next steps, provide commands from the repository root and keep Git publication before the user's hosting deployment step.
