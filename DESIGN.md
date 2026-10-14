---
name: RXperiences
description: A warm Kuwaiti pharmacy publication, كل ما يتعلق بالصيدلة
colors:
  ink-navy: "#1e2a4a"
  rx-pink: "#c43c6e"
  rx-pink-deep: "#ae2c5a"
  sunny: "#f7c948"
  sunny-soft: "#fff3cc"
  blush: "#fbe3ec"
  lilac: "#8e9bc0"
  lilac-soft: "#e7eaf3"
  candy: "#f48fb1"
  paper: "#fcfaf7"
  white: "#ffffff"
  muted: "#56607a"
  hairline: "#e8e2d9"
typography:
  display:
    fontFamily: "Rubik, Segoe UI, Tahoma, sans-serif"
    fontSize: "clamp(42px, 7.4vw, 96px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Rubik, Segoe UI, Tahoma, sans-serif"
    fontSize: "clamp(28px, 3.4vw, 42px)"
    fontWeight: 800
    lineHeight: 1.3
  story-title:
    fontFamily: "Amiri, Noto Naskh Arabic, Rubik, serif"
    fontSize: "clamp(34px, 5.2vw, 64px)"
    fontWeight: 700
    lineHeight: 1.55
  story-body:
    fontFamily: "Noto Naskh Arabic, Rubik, Segoe UI, serif"
    fontSize: "20.5px"
    fontWeight: 400
    lineHeight: 1.95
  body:
    fontFamily: "Rubik, Segoe UI, Tahoma, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Rubik, Segoe UI, Tahoma, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "14px"
  lg: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(56px, 8vw, 104px)"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.sunny}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
    height: "48px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
    height: "48px"
  search-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.pill}"
    height: "54px"
  filter-chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  filter-chip-selected:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
---

# Design System: RXperiences

## Overview

**Creative North Star: "The Pharmacist's Notebook, Published"**

RXperiences is a personal pharmacy publication from Kuwait: first-hand study and career stories, a policy directory and a research shelf, told in a warm Kuwaiti voice. The system frames those stories like a magazine (a lead story with a rail, regional chapters, a ledger of decisions) and lets the brand's hand-made sticker world — the ink-outlined Hawan and Habba mascots, sunny yellow and pink — live in the frame, never in the reading column.

The page is light and calm by default: a warm paper ground, generous section rhythm, hairline dividers instead of boxes. Colour commits at section scale (a navy masthead, a sunny-soft policy band, a blush author band) rather than being sprinkled on components. Stories speak in Naskh; the brand and interface speak in Rubik.

**Key Characteristics:**
- Two voices: Amiri / Noto Naskh for stories, Rubik for brand and interface.
- Lists and rails separated by hairlines, not bordered cards.
- Category colour coding like medicine-box bands.
- The navy outline + offset "sticker" belongs only to mascots and primary buttons.
- Right-to-left first; English inside Arabic is handled, not ignored.

## Colors

A full palette of four named roles (navy, pink, sunny, lilac) on a warm paper neutral, each with a soft tint for fields.

### Primary
- **Ink Navy** (ink-navy): all text, the home masthead, the footer, outlines on mascots and primary buttons, selected filter chips.
- **Rx Pink** (rx-pink): links, the active navigation underline, hover state of story titles, icon accents. **Deep Rx Pink** (rx-pink-deep) is used for links inside articles so they keep 4.5:1 on tinted table rows.

### Secondary
- **Sunny** (sunny): primary buttons, the mascot blob, the Arab-countries category. **Sunny Soft** (sunny-soft) fills the policies band and notices.

### Tertiary
- **Blush** (blush): the author / consultation band, the article consultation block, the USA & Canada category tint. **Candy** (candy) is the USA & Canada band and the mascots' pink.
- **Lilac** (lilac) / **Lilac Soft** (lilac-soft): the UK & Ireland category band and tint; default thumbnail mat.

### Neutral
- **Paper** (paper): the page ground. **White** (white): inputs, list rows that need lift, the experiences section.
- **Muted** (muted): meta lines, secondary copy on paper. On coloured bands use a darker tint of that band or navy, never Muted.
- **Hairline** (hairline): dividers between list items and section edges.

### Named Rules
**The Medicine-Box Rule.** Each category owns one colour: UK & Ireland lilac, USA & Canada candy, Arab countries sunny, pharmacy articles navy. It appears as a short band before the category name, as the mat behind a post with no image, and as a full frame around region photos — never as a one-sided stripe.

**The Section-Scale Rule.** Colour fills whole sections (masthead, policies band, author band), not individual components.

## Typography

**Brand / interface font:** Rubik (variable 300–900), self-hosted in `/public/fonts`.
**Story title font:** Amiri 700, Arabic and Latin, self-hosted.
**Reading font:** Noto Naskh Arabic (variable 400–700, size-adjust 110%), self-hosted. English words in stories fall back to Rubik.

**Character:** Rubik is round, friendly and modern, matching the mascots. Amiri is classical calligraphic Naskh with real stroke contrast; it makes every story title read as part of a publication. Noto Naskh is the comfortable text face for long reading.

### Hierarchy
- **Display** (Rubik 800, clamp(42px, 7.4vw, 96px), 1.08): the home masthead only.
- **Headline** (Rubik 800, clamp(28px, 3.4vw, 42px), 1.3): section and page headings; page titles go up to 64px.
- **Story title** (Amiri 700, article clamp(34px, 5.2vw, 64px); lead story 27–42px; list items 18.5–21px; line-height 1.55): every article title wherever it appears.
- **Story body** (Noto Naskh 400, 19px on phones / 20.5px from 640px, line-height 1.95, max 35em): the article reading column. Headings inside articles use Rubik 700 (h2 23–28px, h3 19–22px), with more space above than below.
- **Body** (Rubik 400, 17px, 1.75): interface copy, excerpts, summaries.
- **Label** (Rubik 700, 14px): category labels and meta lines; no uppercase, no tracking.

### Named Rules
**The Two Voices Rule.** If it is a story (its title or its text), it is set in Naskh. Everything else — navigation, section headings, buttons, meta — is Rubik.

**The No-Kicker Rule.** Category labels sit in the meta line under a title, never above it.

## Layout

A 1200px container with a fluid gutter (16–40px). Sections breathe at clamp(56px, 8vw, 104px) top and bottom. The home page varies its structure section by section: masthead split (text + mascots), lead story + rail (1.55fr / 1fr), three regional chapters, a two-column intro + ledger, two "shelves", an author band.

Responsive behaviour is designed, not stacked: below 900px the rail becomes two columns on tablets and a list on phones; region chapters are three columns from 700px and a peeking carousel below; post lists become compact rows (title + 96px square image) on phones, with the newest post as a larger lead. The header shows full navigation from 1080px and a "القائمة" sheet below. Article pages show a sticky contents list beside the text from 1080px when a post has 4+ headings, and a collapsible one above the text on smaller screens.

## Elevation & Depth

Flat by default. Depth comes from tonal fields (paper, white, tinted bands) and hairlines, not shadows. The only shadow is the brand sticker: `3px 3px 0` in ink navy on primary buttons and mascot speech bubbles; on hover a primary button lifts to `4px 5px 0`.

### Named Rules
**The Sticker Rule.** The ink outline + hard offset belongs to the mascot world: primary buttons, speech bubbles, the mascot dock. Never on cards, images, list rows or panels.

## Shapes

Three radii: 8px (small controls), 14px (thumbnails, notices, in-article images), 28px (lead images, region photos, bands). Buttons, inputs, chips and filters are pills (999px). The mascot blob is the one organic shape.

## Components

### Buttons
- **Shape:** pill (999px), 48px minimum height, 2px ink-navy outline.
- **Primary:** Sunny fill, navy text, sticker shadow; lifts on hover, presses in on active.
- **Quiet:** transparent with navy outline; on dark grounds the outline turns translucent white.

### Search field
- **Style:** white pill, 2px navy outline, 54px tall, search icon at the start, optional navy "ابحث" button inside the end.
- **Focus:** a 4px blush ring; no browser outline.

### Filter chips
- **Style:** white pill with hairline border; selected chips are solid navy with white text; horizontally scrollable on phones.

### Post in a list
- Image (3:2, 14px radius) then Amiri title, two-line excerpt, meta line with category label, date and reading time. No border, no shadow. On phones: a row with a 96px square image.

### Navigation
- Text-only header links in Rubik 500; the active page is pink with a 2px pink underline that also animates on hover. Below 1080px a "القائمة" pill opens a right-side sheet with search, sections and one-line descriptions.

### Mascot dock (signature)
- Hawan and Habba sit in the left margin on screens 1480px and wider, still, with one speech bubble. Tapping them changes the message and makes them jump. Below 1480px they are hidden so they never cover text; Hawan appears instead in the header mark, home masthead, author band, article consultation block and empty search state.

## Do's and Don'ts

### Do:
- **Do** set every story title in Amiri 700 and article text in Noto Naskh, with English falling back to Rubik.
- **Do** use the category colour from the Medicine-Box Rule wherever a category is named.
- **Do** separate list items with 1px hairlines and space, not boxes.
- **Do** keep the reading column at 35em or less and line-height 1.95.
- **Do** give motion one orchestrated moment (the home masthead) and respect reduced motion.
- **Do** mark English-only blocks inside articles as left-to-right.

### Don't:
- **Don't** put the navy outline + offset shadow on cards, images or panels.
- **Don't** put labels or eyebrows above headings.
- **Don't** use grey text on coloured bands; tint from the band or use navy.
- **Don't** add colour stripes along one side of an element.
- **Don't** load fonts from Google Fonts; they are self-hosted in `/public/fonts`.
