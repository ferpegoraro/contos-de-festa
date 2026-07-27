# Contos de Festas — Design System

## Intent

**Who:** Two audiences. A party host (usually a mom, browsing on her phone late evening, emotionally invested in making a celebration special) and the business owner (managing kits and conversations between real-world events, needs speed and clarity).

**Task:** Visitor browses kits, falls in love, sends a WhatsApp message. Owner adds kits, uploads photos, manages categories — quickly, between deliveries.

**Feel:** Warm like flipping through a party planning scrapbook. Physical-world business in a digital skin. Festive, not corporate. Soft, not minimal-tech.

---

## Palette

| Token                | Value       | Role                              |
| -------------------- | ----------- | --------------------------------- |
| `--primary`          | `#722e43`   | Carmim — primary actions, brand anchor |
| `--rosa`             | `#e8a0b4`   | Rose — highlights, active states, accents |
| `--rosa-dark`        | `#9b3a5a`   | Rose dark — hover, premium emphasis |
| `--background`       | `#fff9f5`   | Warm off-white — content surfaces |
| `--foreground`       | `#2d1a22`   | Dark wine — primary text |
| `--muted-foreground` | `#8c7080`   | Muted — secondary text |
| `--secondary`        | `#f5ede8`   | Warm neutral — muted surfaces |
| `--accent`           | `#fce8ef`   | Pearl rose — premium prices, sparkle moments on dark surfaces |
| `--border`           | `#e8d5cc`   | Warm border — cards, inputs |
| `--destructive`      | `#dc2626`   | Red — errors, delete actions |

**Why these colors:** They come from the decoration world itself — carmim is fabric, rose is ribbon, pearl is satin, wine is velvet. A monochromatic rose family from deep wine to pale pearl, not chosen from a UI palette generator.

---

## Typography

| Role     | Family            | Why                                                    |
| -------- | ----------------- | ------------------------------------------------------ |
| Headings | Playfair Display  | Serif with personality — reads like a party invitation  |
| Body     | Nunito            | Rounded, friendly, high readability on mobile          |

---

## Depth & Surfaces

**Two temperatures:**

1. **Dark immersive** — Hero, header, footer. Dark wine (`#2d1a22`) backgrounds with glassmorphism (`backdrop-blur`, `bg-white/10`, `border-white/20`). Luminous blur circles for festive atmosphere. No hard edges.

2. **Warm light** — Content pages (catalog, about, categories). Off-white (`#fff9f5`) background. White cards with soft shadows (`shadow-sm` to `shadow-md`). Rose or warm borders (`#e8d5cc`).

**Depth model:** Glow-based, not shadow-based. Blurred color circles, subtle backdrop-blur. Shadows used sparingly and always warm-toned (never gray/black shadows on light surfaces).

---

## Spacing

- **Base unit:** 4px (Tailwind default)
- **Container:** `max-w-6xl`, centered with `px-4 sm:px-6 lg:px-8`
- **Section padding:** `pt-16 pb-8` to `py-20` — generous vertical breathing room
- **Card gaps:** `gap-6` to `gap-8` in grids
- **Component internal:** `gap-2` to `gap-4`

---

## Radius

- **Base:** `0.75rem` (12px)
- **Buttons/CTAs:** `rounded-full` (pill shape — festive, not corporate)
- **Cards:** `rounded-lg` to `rounded-xl`
- **Inputs:** `rounded-md` to `rounded-lg`
- **Icon containers:** `rounded-full` or `rounded-lg`

---

## Interaction Patterns

- **Hover:** Scale (`hover:scale-105`) on CTAs, color transitions (`duration-300`) on links
- **Active link:** Rose underline (`#e8a0b4`) expanding from center
- **Mobile menu:** Slide-down with max-height transition, backdrop-blur
- **Scroll:** Header transitions from transparent to dark wine with blur
- **Animations:** Framer Motion for entrance animations. Gentle floats and scale pulses for ambient elements. `will-change-transform` for performance.

---

## Signature Elements

- **Pill-shaped CTAs** with white fill on dark backgrounds, carmim text → rose-to-rose-dark gradient on hover
- **Glowing blur circles** as ambient decoration (rose/carmim tints)
- **WhatsApp as primary conversion** — green accent (`#25D366`) always present
- **Logo glow effect** — white blur behind logo on hover
- **Pearl rose accents (`#fce8ef`)** — used for premium moments (prices, sparkle badges) on dark surfaces; reads as luminous without breaking the rose family

---

## Component Patterns

### Cards (Catalog — anticipated)
- White surface on warm off-white background
- Soft warm shadow, not gray
- Rose or warm border on hover
- Photo as hero, details below
- Pill CTA at bottom

### Admin Sidebar (anticipated)
- Dark wine (`#2d1a22`) background
- Rose (`#e8a0b4`) for active/primary items
- Dark accent (`#3d2832`) for hover states
- Compact, functional, same brand warmth

---

## Grid

- **12-column** base (footer uses `md:grid-cols-12` with 5/3/4 split)
- **Catalog grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` anticipated
- **Always responsive-first** — single column on mobile, expanding outward

---

## Don'ts

- No gray shadows — always warm-toned or glow-based
- No sharp corners on interactive elements — this is a celebration brand
- No cold neutrals — every gray leans warm (rose-tinted muted tones)
- No stock-UI blue — WhatsApp green is the only non-brand color allowed
- No dense/cramped layouts — generous spacing reflects the festive, inviting feel
