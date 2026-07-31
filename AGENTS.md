# AGENTS.md

## Scope

This file applies to the repository rooted at `odis-cardgame/`.

The repository contains both the app and the offline data pipeline:

- repo root: the Next.js app project
- `cardgame/`: offline data-prep notebooks, raw open data, and map/asset exports (tracked in git so the open-data foundation stays version-controlled)
- `../planning/` (local sibling folder, not part of the repo): planning and design notes

## Project Summary

- Single Next.js app using the Pages Router.
- Purpose: present the "ODIS Berlin Prognoseraeume Supertrumpf" as an interactive web experience based on Berlin open data.
- Primary runtime data source: `public/data/supertrumpf.csv`.
- Primary visual assets: `public/maps/*.svg`.
- The source material and processing assets live in `cardgame/` (notebooks in `cardgame/scripts/`, raw data in `cardgame/data/`, map exports in `cardgame/maps/`).

## App Structure

- `pages/`
  - `_app.js`: global app wrapper
  - `_document.js`: HTML shell
  - `index.js`: single-card browser with previous/next navigation
  - `play.js`: Top Trumps game against the computer
  - `gallery.js`: gallery/carousel presentation
  - `solitaire.js`: table-style layout with detail modal
- `src/components/`
  - `SupertrumpfCard.jsx`: the canonical card, modeled on the printed design; used by home, gallery, solitaire detail, and the game; accepts optional `onSelectCategory`/`highlightKey`/`highlightTone` for the game
  - `CardBack.jsx`: card back for the game (hidden opponent card)
  - `SolitaireCard.jsx`: small grid card for the solitaire table
- `src/lib/categories.js`
  - the 8 card categories: accessors, German formatting, and win direction (lower wins for NO₂, Versiegelung, Rettungsdienst-Anfahrt)
- `src/lib/dataLoader.js`
  - loads the CSV from `/data/supertrumpf.csv`
  - resolves area names to `/maps/<Ortsteil>.svg`
- `src/styles/globals.css`: global styling
- `public/`
  - `data/supertrumpf.csv`: runtime card dataset
  - `maps/*.svg`: Berlin locator maps (district highlighted inside the Berlin outline); always use as plain `<img>` — recoloring the paths flattens the highlight
  - `maps/art/*.webp`: card artwork (district on its street map), downscaled from `cardgame/maps/png/`
- `docs/generated/`
  - generated or ad hoc setup notes kept out of the main repo root

## Working Assumptions

- Treat this as one app with multiple routes, not multiple apps.
- Prefer preserving the existing Pages Router setup unless the task explicitly asks for a migration.
- Reuse the existing CSV + SVG asset flow unless there is a strong reason to change the runtime format.
- When changing UI, keep the card metaphor central. This repo is design-driven.
- The canonical card look is the main homepage view at `/` (`pages/index.js` using `src/components/SupertrumpfCard.jsx`).
- Do not treat the gallery or solitaire card variants as the primary design reference unless a task explicitly asks for those views.

## Commands

- Install deps: `npm install`
- Run dev server: `npm run dev`
- Build: `npm run build`
- Start production build: `npm run start`
- Lint: `npm run lint`

## Repo-Specific Guardrails

- Do not treat `.next/` or `node_modules/` as source.
- Do not treat `cardgame/` notebooks/scripts as part of the frontend runtime unless the task is explicitly about the data pipeline.
- Keep route-level changes inside `pages/` unless there is a clear need to refactor shared logic into `src/`.
- If you touch CSV parsing, note that the current loader is a simple comma split and may break on quoted CSV edge cases.
- If you add new runtime data or maps, keep them under `public/`.
- If a design decision is ambiguous, follow the visual direction of the homepage card before reusing ideas from `gallery.js` or `solitaire.js`.

## Good First Checks For Future Agents

- Read `package.json` to confirm scripts and framework version.
- Inspect `pages/index.js`, `pages/gallery.js`, and `pages/solitaire.js` before making UX assumptions.
- Inspect `src/lib/dataLoader.js` before changing data shape or filenames.
- Check whether a task targets runtime UI, supporting assets, or the offline data-prep material in `cardgame/`.
