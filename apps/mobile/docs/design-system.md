# Design system

NexPG uses a **hand-crafted design system** shared by mobile and web. UI is **not** generic AI templates — fixed tokens and components in both repos.

## Source of truth

| Token / asset | Mobile (`NexPG`) | Web (`NexPG-Web`) |
|---------------|------------------|-------------------|
| Colors, spacing | `src/theme/tokens.ts` | `src/theme/tokens.ts` + CSS vars in `app/globals.css` |
| Fonts | `@expo-google-fonts/*` | Google Fonts in `globals.css` |
| Bed grid | `src/components/BedGrid.tsx` | `src/components/BedGrid.tsx` |
| Buttons, fields | `src/components/` | `src/components/` (CSS modules) |

When you change a color, update **both** `tokens.ts` files (and web `globals.css`).

## Palette

| Name | Hex | Use |
|------|-----|-----|
| Paper | `#F7F5F1` | Background |
| Ink | `#16302B` | Primary text |
| Ochre | `#C97A2B` | Accent, CTAs |
| Green | `#3C7A5E` | Occupied / paid |
| Red | `#B8433D` | Pending / refund due |

## Typography

- **Fraunces** — headings
- **Inter** — body and labels
- **IBM Plex Mono** — rupee amounts

## Signature motif

**Bed occupancy grid** — small cells per bed, occupied in ink, empty in paper with border.

**Paper grain** — subtle decorative overlay on login and download hero sections.

## Rules for new screens

1. Import colors from tokens / CSS variables — no new random hex values.
2. Reuse `Button`, `Field`, `BedGrid`.
3. User-facing copy in **English only**.
4. Keep mobile and web visually aligned when adding features.

## Layout

- **Mobile:** full-screen Expo app, bottom tabs.
- **Web (`NexPG-Web`):** fixed **left sidebar** (dark ink), wide **main content** with stat cards, data tables, and two-column settings panels — not a centered phone column.
