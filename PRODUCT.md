# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary (inferred from the content and confirmed as the default, 2026-10-14): Arabic-speaking pharmacy students and recent graduates in Kuwait and the Gulf deciding what and where to study (BPharm vs PharmD, UK/Ireland, USA/Canada, Arab countries), and planning their next career step. Most arrive on a phone, often from Instagram or YouTube.
Secondary: practising pharmacists in Kuwait looking up Ministry of Health policies, Gulf research and day-to-day references.

## Product Purpose
RXperiences (كل ما يتعلق بالصيدلة) is Moudhi Aman's pharmacy publication: first-hand study-abroad and career experiences, explanatory articles, a curated library of published Kuwait/Gulf pharmacy research, a directory of Kuwaiti MoH pharmacy laws and decisions, free courses and references, and paid one-to-one consultations. Success: a reader finds an experience that matches their situation, trusts it, reads to the end, and either explores further or books a consultation.

## Positioning
Real experiences from Kuwaiti and Gulf pharmacists and students, written in a warm Kuwaiti voice by a practising clinical pharmacist (BPharm, MSc Clinical Pharmacy UCL, BCPS, doctorate in pharmacy), alongside a Kuwait-specific policy directory and research library that general pharmacy sites do not have.

## Operating Context
- Content is edited by a non-developer directly on GitHub (Markdown posts, YAML policies/library/resources); the site redeploys on Vercel. Editing must stay that simple.
- Many posts are imported from an older WordPress site: informal formatting, bold lines used as headings, en-dash bullets, mixed Arabic/English, images of varying quality including logos.
- Right-to-left Arabic interface with frequent English terms inline.

## Capabilities and Constraints
- Astro 5 static site. Collections: posts, policies, resources, library. Routes: /, /blog, /experiences, /category/[slug], /posts/[slug], /library, /resources, /policies, /consultations, /about.
- Client-side search with Arabic letter normalisation on the blog and policies pages; category filters; library tabs.
- Booking goes to an external Calendly link.
- No authentication, no CMS beyond GitHub.

## Brand Commitments
- Name RXperiences, with "RX" emphasised.
- Mascots Hawan (mortar and pestle) and Habba (capsule), with their speech-bubble Kuwaiti voice. Inferred default: keep them, calmer.
- Ink navy, pink and sunny yellow palette; friendly, hand-made, sticker-like character.

## Evidence on Hand
Real articles (src/content/posts), MoH policy records with sources (src/content/policies), published studies with links (src/data/library.yaml), resources (src/data/resources.yaml), author credentials on /about. No testimonials, statistics or reader numbers exist; do not invent them. Do not add or alter medical or legal information.

## Product Principles
1. Trust comes first: sources, dates and authorship are always visible; the site never overstates.
2. Reading is the product: long articles must be comfortable on a phone.
3. Warm, personal, local: the voice and mascots are what make it RXperiences, not a generic health site.
4. Keep publishing effortless for the author.

## Accessibility & Inclusion
Arabic RTL first with correct handling of embedded English. WCAG 2.2 AA contrast, keyboard access, visible focus, reduced-motion respected.
