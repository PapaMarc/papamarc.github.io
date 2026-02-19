# MerWare Module Architecture

This module contains the MerWare feature pages plus shared assets used by those pages.

## Directory Layout

- `merware/`
  - `music.html`
  - `paint.html`
  - `kaprekar.html`
  - `css/`
    - `site-base.css`
    - `site-components.css`
    - `site-home.css`
    - `audio-toggle.css`
  - `js/`
    - `audio-toggle.js`
  - `resources/` (images/audio and other media)

## CSS Files and Responsibilities

### `css/site-base.css`

Global foundation styles.

- reset and box model
- root variables for global link colors
- global link states
- global typography and body defaults
- shared container and section defaults
- base heading/subtitle rules
- shared animation keyframes
- small-screen typography defaults

### `css/site-components.css`

Reusable cross-page components and shared utilities.

- canonical blue navigation bar component
  - full nav variant for homepage
  - simple nav variant for subpages (logo left, back link right)
- canonical blue footer component
- donation/support layout component classes
- shared subtitle helper variants
- nav spacing helper for fixed top bar pages

### `css/site-home.css`

Homepage-only presentation/layout styles.

- hero header styling
- CTA button styling
- portfolio cards/grid
- services cards/grid
- team section/avatar styling
- contact section and social/contact layout
- homepage-specific responsive layout rules

### `css/audio-toggle.css`

Audio play/pause control visuals.

- button/icon faces for play and pause
- pressed/active visual state styling
- focus and control appearance for the audio toggle component

## JS Files and Responsibilities

### `js/audio-toggle.js`

Shared behavior for the page audio play/pause control.

- binds to `#bg-audio` and `#bg-toggle`
- toggles play/pause state on click
- synchronizes `aria-pressed` and `aria-label`
- keeps UI state in sync with audio `play`/`pause` events

## Page Wiring

### Root homepage

- `index.html` loads:
  1. `merware/css/site-base.css`
  2. `merware/css/site-components.css`
  3. `merware/css/site-home.css`
- Uses canonical full nav and canonical footer from `site-components.css`.

### MerWare subpages

- `music.html` loads `css/site-components.css`.
- `paint.html` loads:
  - `css/site-components.css`
  - `css/audio-toggle.css`
  - `js/audio-toggle.js`
- `kaprekar.html` loads:
  - `css/site-components.css`
  - `css/audio-toggle.css`
  - `js/audio-toggle.js`
- All three use:
  - canonical simple nav (MerWare left, Back to Portfolio right)
  - canonical footer
- `paint.html` and `kaprekar.html` also use shared donation layout classes from `site-components.css`.

## Conventions Going Forward

1. Put global defaults in `site-base.css`.
2. Put reusable components in `site-components.css`.
3. Put page-specific homepage styling in `site-home.css`.
4. Keep audio-control visuals in `audio-toggle.css` and behavior in `audio-toggle.js`.
5. Prefer reusable classes over inline `style` attributes.
