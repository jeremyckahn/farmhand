# 7. Pixel Art UI Theme

Date: 2026-10-03

## Status

Accepted

## Context

Farmhand's game art is pixel art, but its UI chrome (cards, dialogs, buttons, icons and fonts) used stock Material UI styling: smooth rounded corners, blurred shadows, vector icons and regular web fonts. We wanted the whole UI to look like retro pixel art and to stay:

- **Scalable:** UI elements are every size, so the chrome can't be fixed-size bitmaps.
- **Themeable:** frame colors come from the MUI palette and per-component colors, so they can't be hand-drawn per color either.
- **Mostly invisible to components:** the look should come from the MUI theme and a few shared helpers, so most components need no pixel-art-specific code.

Several of the techniques below are unusual, and some have non-obvious constraints. This record explains how the theme works, so it can be changed safely.

See https://github.com/jeremyckahn/farmhand/pull/797 for the implementation and the alternatives that were tried.

## Decision

### Frames: 9-slice `border-image` with generated SVG sprites

`src/styles/pixel.ts` draws frames with CSS 9-slice scaling (`border-image`).

- **Sprites:** each frame is a tiny SVG sprite (3×3 or 4×4 art pixels), generated at runtime from a text pixel map by `pixelArtUrl()` and inlined as a data URI. For example:

  ```
  .O..    O = outline color
  O.OD    D = drop shadow
  .ODD    . = transparent
  .DD.
  ```

- **Scaling:** the browser slices the sprite into corners, edges and a center. Corners render at a fixed size and edges stretch, so a frame fits any element while every art pixel stays exactly `PIXEL_SIZE` (3) CSS pixels (`px(n)` converts art pixels to CSS).
- **Colors:** because the sprites are generated SVGs, their colors can come from the palette at runtime. `pixelFrameSx({ outline, shadow })` returns the `sx` styles for a frame:
  - `shadow: true` adds a hard drop shadow inside the right and bottom border slices.
  - `shadow: 'pressed'` keeps that space but leaves it empty, so a pressed control doesn't change size.
- **What the sprite holds:** only the outline, the notched corners and the shadow. The element's own background fills the interior because it's clipped to the padding box (`backgroundClip: 'padding-box'`), which keeps the corners and shadow transparent.
- **Bevel:** the light/dark bevel is an inset `box-shadow` from `pixelBevel()`, not part of the sprite. Background colors can therefore change freely (hover, selected cards, palette colors) without regenerating any images.

### Theme and shared styles

`src/mui-theme.ts` applies the pixel look through the MUI theme, mostly in `components.*.styleOverrides`:

- **Global:**
  - `shape.borderRadius` is `0`.
  - Every `shadows` elevation is the same hard, unblurred shadow.
  - Ripples, switch thumbs and slider thumbs are square.
- **Framed surfaces:** cards, table containers, accordions, popovers, dialogs, tabs, tooltips and alerts all use `pixelFrameSx`. Cards share `cardStyleSx` in `src/styles/sx.ts`, which other card-like chrome also spreads in (e.g. the quick-select toolbelt).
- **Buttons:**
  - **Contained** buttons and floating buttons share `raisedControlSx`: a shadowed frame that `pixelPressedSx` shifts into its shadow while pressed.
  - **Outlined** buttons get a colored frame.
  - **Text** buttons get an invisible frame of the same size, so toggling a button between variants (e.g. the selected item in `ItemList`) doesn't shift the layout.
  - Outline colors come from `outlineFor()`: a darkened shade of the palette color, or a neutral color for `inherit`/`default`.
- **Fixed colors:** colors that aren't in the MUI palette live in `src/styles/tokens.ts` (`cardOutline`, `dialogOutline`, `neutralOutline`, `disabledOutline`).

### Icons: pixel maps rendered as `SvgIcon`s

`src/components/PixelIcon` replaces `@mui/icons-material` and Font Awesome, neither of which is a dependency anymore.

- **Drawing format:** icons are 12×12 text pixel maps. `#` is a solid pixel, `+` is a half-tone pixel (same color, reduced opacity) and anything else is transparent.
- **Rendering:** `createPixelIcon(rows, name)` merges each row's runs of pixels into a single crisp `<path>` and renders it in an MUI `SvgIcon`. The result is a drop-in replacement for an `@mui/icons-material` icon:
  - It takes the same props (`color`, `fontSize`, `sx`, …).
  - It's colored with `currentColor`.
  - It has a `data-testid` of `${name}Icon`.
- **Variants:** `flipX`, `flipY` and `rotate` derive variants from one map (e.g. all four chevrons).
- **Size:** at MUI's default 24px icon size each art pixel is exactly 2px. Sizes that aren't multiples of 12px look slightly uneven.
- **MUI's built-in icons** are replaced through theme `defaultProps`: Alert's `iconMapping`, Select's `IconComponent`, and Checkbox's `icon`/`checkedIcon`/`indeterminateIcon`.

### Fonts: two logical families with `size-adjust`

- **Families:** components use `fonts.display` (headings, buttons and other UI labels) and `fonts.body` (running text) from `src/styles/tokens.ts`. Those map to the custom families `"Farmhand Display"` and `"Farmhand Body"`, whose faces are declared in `src/styles/fonts.ts`:
  - **Display:** Jersey 10.
  - **Body:** Jersey 20, with Jersey 25 as its bold.
- **Declaration:** the faces are `@font-face` rules injected through `MuiCssBaseline`, using the woff2 files from the `@fontsource/*` packages rather than importing their CSS. That lets each face set `size-adjust`. Pixel fonts have much smaller glyphs per em than typical web fonts, so each face's cap height is matched to the font it replaced (Francois One for display, Public Sans for body). That keeps layouts the same without touching font sizes anywhere.
- **No faux styles:** `font-synthesis: none` is set on `body`, because faux bold and italics smear the pixel grid.
- **Alternatives considered:** Pixelify Sans (hard-to-read digits), Tiny5, VT323, DotGothic16, Press Start 2P, Silkscreen and others were compared before settling on the Jersey family. Using one design throughout is consistent, it has clear digits, and it has a real bold.

### Notifications with actions use a button

Notifications with an `onClick` (currently only the "game update available" notification) render a labeled button through the Alert's `action` prop (see `NotificationAlert` in `src/components/NotificationSystem`). The Alert itself is never clickable, because on Android a clickable framed Alert could get stuck showing a corrupted, partially dark pressed state.

## Consequences

### Benefits

- **Consistent look for free:** most components get the pixel look automatically, with no pixel-art-specific code.
- **Scales and themes:** frames, icons and fonts scale to any size and pick up palette colors.
- **One place to change things:** the frame look lives in `pixel.ts` and the theme, icons in one module, and typefaces in `fonts.ts`.

### Rules to follow

- **Use `backgroundColor`, not `background`,** to recolor anything with a pixel frame (including anything built on `cardStyleSx`). The `background` shorthand resets `background-clip` to `border-box`, which paints the color under the transparent corners and drop shadow.
- **Don't add `border-radius`, blurred `box-shadow`s or `filter` blurs** to UI chrome. Use `pixelFrameSx`, `pixelBevel`, `pixelDropShadowFilter` (for arbitrary shapes like sprites) or the theme's `shadows`.
- **Don't enable `arrow` on Tooltips.** MUI's arrow is a rotated square that doesn't fit the pixel frame.
- **Don't make whole Alerts clickable.** Give the notification an `onClick` and an `actionLabel` so it renders a button instead.
- **Import icons from `src/components/PixelIcon`,** not `@mui/icons-material` or Font Awesome. To add one, draw a 12×12 map in `icons.ts` and wrap it with `createPixelIcon`.
- **Refer to fonts only through `fonts.display` and `fonts.body`.** To change a typeface, edit `src/styles/fonts.ts`. Measure the new font's cap height and set its `size-adjust` so it matches the existing faces, and declare every weight it should render. With `font-synthesis: none`, a weight that has no face falls back to the nearest one rather than being faked.
- **Unicode-range faces need care.** When several faces share a family and their `unicode-range`s overlap, the last-declared face wins. Faces of one family must also use exactly the same `font-weight` values: a range like `400 700` on one face can make Chrome stop falling back to the others.

### Known limitations

- **Text fields:** outlined text fields only get square corners and a 2px border, not a full frame, because of how MUI draws the gap for the field label.
- **Button size:** contained and outlined buttons are a few pixels larger than stock MUI buttons because of the frame borders.
- **Font coverage:** only the latin and latin-ext font subsets are declared. Other scripts fall back to `sans-serif`.
