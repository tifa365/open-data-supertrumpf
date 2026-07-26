# ODIS Card Game Implementation

This implementation creates an interactive card display for the Berlin Prognoseräume Supertrumpf card game.

## Features

- React/Next.js application with Tailwind CSS
- SVG map integration for each district
- Data loaded from CSV file
- Interactive navigation between cards
- Styled to match the design with blue (#002F6C) and yellow (#F4E85A) colors

## Project Structure

```
src/
├── components/
│   ├── SupertrumpfCard.jsx    # Main card component
│   └── ui/
│       └── card.jsx          # Base UI card component
├── lib/
│   ├── dataLoader.js         # CSV data loading utility
│   └── utils.js              # Helper utilities
└── styles/
    └── globals.css           # Global styles with Tailwind

pages/
├── index.js                  # Main app page
└── _app.js                   # Next.js app wrapper

public/
├── data/
│   └── supertrumpf.csv       # Card data
└── maps/
    └── *.svg                 # District SVG maps
```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open the local URL printed by Next.js in your browser

## Card Component Features

- District badge with shadow effect
- SVG map display for each area
- Data rows for all 8 comparison categories
- Proper formatting for German numbers
- Responsive design

## Data Categories

1. Fläche (Area in km²)
2. Einwohner:innen (Population)
3. Straßen mit Frauennamen (Female street names %)
4. Solarpotenzial (Solar potential GWh/a)
5. Luftqualität NO₂ (Air quality µg/m³)
6. Versiegelung (Soil sealing %)
7. Schnellimbiss-Anzahl (Fast food count)
8. Rettungsdienst-Anfahrt (Emergency response time)

## Styling

The card matches the original design with:
- Blue borders and text (#002F6C)
- Yellow shadow effects (#F4E85A)
- Deep drop shadow for card depth
- Rounded corners (1.75rem)
- Thick dividers between sections
