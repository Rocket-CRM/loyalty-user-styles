# loyalty-user-styles

Consumer-facing design system for loyalty member-facing WeWeb components.

## What This Package Provides

1. **Static SCSS tokens** — typography scale (Graphik TH), spacing, neutral palette, effects — extracted from Figma (App Loyalty Client V2.0.0)
2. **CSS custom properties** — `--loyalty-*` vars for brand colors and border radii, dynamically set per-merchant at runtime
3. **SCSS mixins** — cards, buttons, pills, tags, inputs, modals, layout helpers, tab bars, bottom sheets, stat cards, slip modals, benefit/package cards
4. **JS theme utility** — reads merchant display settings from a WeWeb variable and applies them as CSS custom properties

## Installation

```bash
npm install loyalty-user-styles
```

Peer dependency: `sass >= 1.50.0`

## Usage

### SCSS

```scss
@use 'loyalty-user-styles/scss/tokens' as *;
@use 'loyalty-user-styles/scss/typography' as *;
@use 'loyalty-user-styles/scss/mixins' as *;

.my-card {
  @include loyalty-card;
  padding: $loyalty-space-7;
}

.my-tab-bar {
  @include loyalty-tab-bar;
}
```

### JavaScript

```javascript
import { applyMerchantTheme, useTheme, callRpc } from 'loyalty-user-styles/js/theme'
```

## CSS Custom Properties

| Variable | Source | Default |
|----------|--------|---------|
| `--loyalty-primary` | `primary_color` | `#FF2353` |
| `--loyalty-secondary` | `secondary_color` | `#003593` |
| `--loyalty-primary-tint` | derived (8% alpha) | `rgba(255,35,83,0.08)` |
| `--loyalty-secondary-tint` | derived (8% alpha) | `rgba(0,53,147,0.08)` |
| `--loyalty-radius-cards` | `border_radius_cards` | `12px` |
| `--loyalty-radius-buttons` | `border_radius_buttons` | `8px` |
| `--loyalty-radius-modals` | `border_radius_modals` | `16px` |
| `--loyalty-radius-pill` | fixed | `9999px` |
