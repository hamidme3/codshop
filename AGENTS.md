=== ROUND 1: Theme Customization Initiative ===

IMMEDIATE NEXT ACTION:

1. Launch AGY brainstorming session:
   - How to generate AI-powered theme palettes that are truly unique and not just a rehash of existing ones?
   - What's the most aggressive way to make themes feel "alive" — maybe dynamic based on time of day, merchant type, or even emotional context?

2. What's the most aggressive customization path?
   A) AI theme generation that defies predictable templates
   B) Real-time interactive theme preview for merchants
   C) Cross-theme fusion mechanics (mix theme A + B into new C)
   D) Accessibility-first theme adaptation (auto-adjust for contrast, motion, cognitive load)
   E) Time-based theme evolution (different palettes for morning, afternoon, evening, seasons)

Vote with your opinion, or suggest a totally different path.

RISK LEVEL: HIGH - The most novel theme customization will break expectations and potentially be misused by merchants (who might create visual noise).

=== END ROUND 1 ===

=== ROUND 2: Implementation Plan - "Bon de Livraison" Skin ===

SELECTED CONCEPT: Geo-Proof Carrier Skinning ("Bon de Livraison" Skin)
- Priority #1 from agy's verdict
- Technical: MEDIUM | Business: HIGH
- Core: Dynamic trust UI based on visitor's Moroccan city/region
- Zero merchant effort - carrier selected at store creation, IP geo handles rest

NEXT STEP: Launch AGY for concrete implementation plan
- File changes needed (ThemeConfig, storefront components, API)
- Geo-IP service integration (free tier: ipapi.co, ipinfo.io, or Cloudflare headers)
- Dynamic template strings for 12 major Moroccan cities/regions
- Courier badge SVG system
- A/B test plan: generic vs. geo-personalized trust

CHALLENGE: How to make this feel instant (no loading flicker) on mobile 3G?
- Static-first render + client-side hydration
- Cloudflare Workers edge injection for city detection
- localStorage cache for 24h

Launch AGY now.

=== ROUND 3: Pivot Verification + Phase 1 Kickoff ===

SELECTED PLAN: "Bordereau Express" Checkout Skin (not geo banner)
- Zero client geo-IP (edge header-only)
- One-tap city pills (user chooses explicitly)
- Official waybill visual language
- 2-week MVP w/ A/B (generic vs. waybill)
- KPI: checkout completion rate +15%

PHASE 1 KICKOFF - Edge Geo + Carrier Config (Days 1-3)

NEXT ACTION: Verify existing edge infrastructure + carrier field schema

VERIFICATION CHECKS:
1. Does src/middleware.ts exist? What's in it?
2. Carrier dropdown exists in store schema?
3. moroccanCities.ts delivery-date helper already used?
4. CodCheckoutModal.tsx exists and is accessible for skinning

CHALLENGE TO AGY:
- Does Phase 1 actually work without breaking existing checkout flow?
- What happens when carrier is null/undefined (backward compat)?
- Can we ship a "stub" waybill skin that falls back to existing modal?
- How to A/B test without feature flag system?

LAUNCH AGY FOR CHALLENGE ROUND 3.

=== ROUND 4: Phase 1 Status + Schema/Middleware Wiring ===

CONCEPT: "Bordereau Express" waybill skin + merchant opt-in via ThemeConfig

CODE CHANGES DONE:
1. ✓ src/db/schema.ts — added `isWaybillEnabled: boolean` to stores table
2. ✓ src/lib/db-repository.ts — fallback returns {..., isWaybillEnabled: false}
3. ✓ src/components/CodCheckoutModal.tsx — `isWaybill` prop, visual toggle, waybill header / standard header
4. ✓ Migration: drizzle/0001_add_isWaybillEnabled_to_stores.sql
5. ✓ tsc --noEmit: clean on CodCheckoutModal.tsx

PHASE 1: Days 1–3 remaining
- Day 1 COMPLETE: Schema + fallback + modal wired
- Day 2: middleware.ts edge header parsing + deterministic 50/50 A/B bucket cookie; API route.ts accepts abVariant; cod-repository.ts passes carrier from store
- Day 3: QA tests (localhost without headers → null carrier → graceful fallback; foreign IP → Casablanca default; order submission A/B attribution)

STRATEGIC CHOICE:
- Merchant toggles `isWaybillEnabled` from store dashboard (via theme config UI)
- If false/unset → standard modal (backward compat)
- If true → waybill skin renders with perforated border + serial number
- A/B test: 50% see waybill via middleware cookie bucket, 50% control

NEXT: Implement middleware.ts edge header parsing + 50/50 bucket. This is the glue that activates the A/B without merchant config friction for MVP launch.
