# Design Direction: LabFlow (Laboratory Inventory & Borrowing System)

## 1. Identity & Purpose
- **System Name:** LabFlow (Laboratory Inventory & Borrowing Management System)
- **Domain:** Computer Laboratory Management (hardware, peripherals, network equipment, tools)
- **Design Philosophy:** Utilitarian, precise, high data-density with clear visual hierarchy, accessible, and fast. Built for lab administrators and staff performing operational duties.

## 2. Liveliness Dials (Antislop Core Part 3)
- **ENERGY: 1 (Calm)**: Restrained, professional, focused on data clarity and task execution without unnecessary visual noise or dramatic flair.
- **RHYTHM: 2 (Structured)**: Deliberate cadence between quick summary metrics, action-oriented forms, and clear tabular data views.
- **MOTION: 1 (Functional)**: Subtle hover feedback and modal state transitions only. Zero looping pulses, zero bouncing decorations.

## 3. Color Palette & Typography
- **Core Dark / Structure:** Slate Navy (`#0F172A`, `#1E293B`)
- **Backgrounds:**
  - Light mode: Pure white (`#FFFFFF`) with subtle canvas `#F8FAFC` and borders `#E2E8F0`
  - Dark mode: Slate `#0B0F17` with surface `#1E293B` and borders `#334155`
- **Primary Functional Accent:** Emerald/Teal (`#0D9488` / `#059669`) for positive status, primary actions, and confirmed states.
- **Warning / Alert Accents:** Amber (`#D97706`) for low stock / borrowed items; Rose (`#E11D48`) for danger / deletion actions.
- **Contrast Guarantee:** Every text pairing complies with WCAG AA minimum 4.5:1 for standard body text and 3:1 for large text.
- **Typography:** Inter / system sans-serif font stack. Clear tabular figures (`font-variant-numeric: tabular-nums`) for numbers and codes.

## 4. Components & Affordances
- **Interactive Elements:** Explicit `cursor: pointer` on all buttons, interactive table rows, and toggles (`cursor: not-allowed` on disabled elements).
- **Focus Rings:** Distinct 2px offset focus ring (`focus-visible:ring-2 focus-visible:ring-teal-500`) for keyboard accessibility.
- **Buttons:** Minimum tap target of 44x44px on touch viewports.
- **Empty & Error States:** Clear contextual explanations stating what is missing and the direct action to take.
- **Theme Support:** Fully verified Light and Dark modes.
