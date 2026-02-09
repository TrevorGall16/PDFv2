# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Bouclier 20h-22h" (Fridge Shield) — a set of single-file HTML tools designed as printable A4 nutritional survival protocols. Each HTML file is a self-contained application (no build step, no external JS/CSS files) using Tailwind CSS via CDN and vanilla ES6+ JavaScript with CSS custom properties for theming. Supports 6 languages: EN, FR, ES, IT, RU, JP.

## Development

No build system. Open any HTML file directly in a browser. Print/save as PDF via `Ctrl+P` or the in-app print button (V4). All CSS and JS are inlined in `<style>` and `<script>` tags within each file.

## File Variants

- **`index.html`** — V5.0 Elite: 17 swaps, module reorder arrows, stamp watermark, full feature set
- **`index_v2.html`** — V2.0 Survival: panic-button design with tier system (Tier 1 Emergency / Tier 2 Reinforcements), no module reorder, high psychological authority layout
- **`index_v4.html`** — V4.0 Commercial: based on V5.0 + error recovery (Restore Defaults), removable protocol steps, per-ingredient shopping list delete, print action button

Each file is independent — they share the same data schema and architectural patterns but are not linked.

## Architecture

### Data Layer (inline `<script>`)
All data is declared as JS constants at the top of the script block:
- **`META`** — UI strings per language (title, subtitle, badge, column headers, button labels). V2 adds `heroTitle`, `costTitle`, `costItems[]`, tier labels. V4 adds `restoreBtn`, `restoreToast`, `printBtn`, `shopClear`.
- **`PROTOCOL`** — 3-step satiety protocol (01 Hydrate, 02 Wait, 03 Action) with per-language text arrays: `{ step, t: { lang: [label, description] } }`
- **`CATEGORIES`** — array of category objects, each containing a `slug` and `swaps[]` array
- **`CAT_LABELS`** — category display names per language
- **`INGREDIENTS`** — shopping list ingredients keyed by swap `id`, per language

### Swap Data Format
Compact structure: `{ id, macros, score, t: { lang: [craving, solution, qty] } }`. Macros string format is always `"Cal: XXX | P: XXg | C: XXg | F: XXg"` where **F = Fiber, NOT Fat**.

### State Variables
- `lang` (string) — current language code
- `theme` (string) — current theme: `swiss`, `lab`, `athlete`, `eco`
- `mult` (number) — portion multiplier: 0.5, 1, 1.5, or 2
- `isCompact` (boolean) — compact view toggle
- V2: `TIER1_IDS = [3, 4, 10]` — emergency tier swap IDs
- V4: `deletedSteps` (Set), `deletedRows` (Set), `deletedCats` (Set) — track user deletions for restore

### Core Functions
- **`render()`** — rebuilds all dynamic content from data constants + current state. Called on language switch and restore.
- **`esc(s)`** — XSS sanitizer: creates a text node and reads back innerHTML. Always use when injecting data into innerHTML.
- **`scaleNumbers(str, factor)`** — regex-replaces all numbers in a mixed text string (e.g., "250g" becomes "500g" at 2x). Used by portion multiplier.
- **`scoreBar(n)`** — renders the 10-segment satiety bar as HTML
- **`setTheme(t)`** / **`switchLang(l)`** / **`setMult(m)`** — toolbar controls
- **`moveMod(btn, dir)`** — module reorder (V5, V4 only)
- **`delRow()`** / **`delCat()`** / **`delStep()`** — CRUD deletion
- V2: `getTier1Swaps()` / `getTier2Categories()` — filter swaps by tier
- V4: `showToast(msg)` / `restoreDefaults()` — error recovery UI

### Theme Engine
4 themes via CSS custom properties on `[data-theme]` attribute on `<html>`:
- **Swiss** (`swiss`) — white, slate, geometric lines
- **Laboratory** (`lab`) — dark mode, monospace, blue accents
- **Athlete** (`athlete`) — high contrast, italic headers, red/black, 3px borders
- **Eco-Draft** (`eco`) — serif, dashed lines, minimal ink

Variables: `--c-*` (colors), `--font-*` (fonts), `--border-*` (styles). Shorthand classes: `.tm` (muted text), `.mn` (mono font), `.hd` (heading font).

### Print System (`@media print`)
- Forces B&W, removes backgrounds/shadows, hides `.no-print` elements
- Score bars become outline-only (no fill)
- Shopping list on Page 2 via `page-break-before: always`
- `break-inside: avoid` on `.print-brk` elements
- Compact spacing overrides for A4 fit

### Layout Constants
- **`GRID`** — CSS grid-template-columns string for consistent column alignment across all category tables
- Main container: `max-width: 900px`, centered, uses Tailwind utility classes

## Key Conventions

- All text fields use `contenteditable="true"` — the user can click and edit anything
- Hover-reveal UI: delete buttons (`.row-del`, `.cat-del`), module arrows (`.module-ctrl`) are `opacity: 0` until parent hover
- Shopping list generates from visible `[data-row]` elements in the DOM, cross-referenced with `INGREDIENTS`
- V4 deletion is soft: items are tracked in Sets and filtered during `render()`, allowing `restoreDefaults()` to bring everything back
