# Design Direction: NatlusLab (Inspired by Creative Tim Notus NextJS)

## 1. Identity & Style Framework
- **System Name:** NatlusLab (Laboratory Inventory & Borrowing Management System)
- **Domain:** lab.natlus.my.id
- **Design Archetype:** Creative Tim Notus NextJS Tailwind Dashboard UI Kit
- **Core Philosophy:** High-contrast admin dashboard with `blueGray` foundation, deep header banner with overlapping stat cards (`-mt-24` aesthetic), distinct uppercase section labels, and card tables (`CardTable` pattern).

## 2. Color Palette & Notus System
- **Foundation Palette:** `blueGray` (Tailwind slate scale: `#f8fafc` to `#0f172a`)
- **Primary Accent:** `lightBlue` (`#0284c7`, `#0ea5e9`) & `emerald` (`#059669`, `#10b981`)
- **Status Accents:**
  - `red-500` / `rose-600`: Critical / Out of stock / Delete
  - `orange-500` / `amber-500`: Warning / Borrowed
  - `emerald-500`: Available / Completed / Active
  - `lightBlue-500`: Stats / Info / Neutral Actions
- **Contrast Guarantee:** Every text pairing complies with WCAG AA standard (4.5:1 minimum).

## 3. Notus Layout Structure
- **Sidebar (`Sidebar.js` style):**
  - Left vertical navigation with brand logo at top
  - Distinct horizontal dividers (`my-4 md:min-w-full`)
  - Subheaders in uppercase bold tracked text (`text-blueGray-400 text-xs uppercase font-bold block pt-1 pb-4`)
  - Nav items with distinct icons and active color highlight
- **Header Banner & Stats (`HeaderStats.js` style):**
  - Dark header background (`bg-blueGray-800 dark:bg-slate-900 pb-32 pt-8`)
  - Overlapping 4-card statistics row with circular colored icon badges (`rounded-full p-3`)
- **Main Card Content (`CardTable.js` style):**
  - Responsive container overlapping or nested within the header
  - White / dark slate card container with `shadow-lg rounded border-0`
  - Uppercase tracked table header cells (`bg-blueGray-50 text-blueGray-500 text-xs uppercase font-semibold px-6 py-3`)
- **Auth Page (`Auth.js` style):**
  - Full-screen `bg-blueGray-800` canvas with centered auth card
  - Quick demo login buttons with subtle shadows
  - Uppercase rounded input fields and action buttons
