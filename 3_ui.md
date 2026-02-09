# UI Specification: The Ultimate Nutritional Shield (Final)

## 1. Global Layout & Modular Engine
* **Format**: Standard A4 Vertical (210mm x 297mm).
* **Main Container**: `max-width: 900px`, centered, `p-10`.
* **Modular Architecture**: Each section is an independent block (Header, Matrix, Protocol, Shopping List).
* **Layout Reordering**: 
    - Hover-triggered "Up/Down" arrows on each section to allow users to reorganize the visual hierarchy.
    - Changes must persist in the DOM for the Print/PDF output.
* **Compact Mode**: A toggle that compresses gaps (`gap-12` to `gap-4`) and font sizes to force the Shield onto a single A4 page.
* **Tier 1 Expansion**: Add a "[+] Add Slot" button to promote any swap to the Emergency Zone.
* **Safety Net**: Add a "Restore Default Sections" button in the toolbar. This brings back any deleted module (like the Protocol) without refreshing the page or losing current text edits.
* **Bulk Actions**: 
    - "Clear All Swaps": Wipes the matrix.
    - "Clear Shopping List": Wipes all ingredients for a fresh start.

## 2. Dynamic Content & Strategy
* **Total Editability**: Everything is `contenteditable="true"`, including the "Cost of Failure" block.
* **The "No-Score" Rule**: REMOVE all vertical satiety bars. Replace them with an editable "Strategy / Notes" field for every swap.
* **Portion Multiplier**: Professional toolbar [ 0.5x | 1x | 1.5x | 2x ] scaling all numbers instantly.
* **Protocol Flexibility**: Every step (01, 02, 03) must have its own [x] delete button. The user can keep 1, 2, or 0 steps.
* **Shopping List 2.0**:
    - Every ingredient must have an individual [x] delete button.
    - Every item remains `contenteditable`.
* **The "Print" Button**: Replace the text instructions with a large, professional "Print / Save as PDF" button that triggers `window.print()`.

## 3. Theme Engine (4 Smart Styles)
All themes feature an automatic "Ink-Saver" override for printing.
1. **The Swiss Minimalist**: Pure white, Slate-900 text, 1px geometric lines.
2. **The Laboratory**: Monospace fonts (Roboto Mono), technical grid watermark, blue accent "data" highlights.
3. **The Athlete**: Italicized headers, heavy black borders, red/white high-contrast accents.
4. **The Eco-Draft**: Serif fonts (lighter print), dashed lines, no bold weights to minimize toner usage.


## 4. Interactive Matrix & Management
* **Categorized Table**: 3 clear sections [SWEET], [SALTY], [VOLUME].
* **Full Editability**: `contenteditable="true"` on ALL text (titles, headers, cells).
* **Row/Category Management**: Hover-visible `[x]` buttons to delete specific rows or entire category blocks.

## 5. Print Intelligence (Toner-Saver)
* **@media print**: Forces B&W, removes all background fills, grids, shadows, and UI buttons.
* **Satiety Bars**: Change from solid black blocks to 1px black outlines with zero fill.
* **Pagination**: `break-inside: avoid` for categories; `page-break-before: always` for the Shopping List (Page 2).
* **Print Cleansing**: Automatically hide all management icons (arrows, pins, [x] buttons, restore buttons) when printing.