# ODIS Card Game Application

The application has been successfully installed and is now running.

## Location
The app is installed at: `/home/tim/Projekte/odis_berlin_prognoseraeume_cardgame/odis-cardgame`

## Access the Application
The app is running on: http://localhost:3002

## Directory Structure
```
/home/tim/Projekte/odis_berlin_prognoseraeume_cardgame/odis-cardgame/
├── src/
│   ├── components/
│   │   ├── SupertrumpfCard.jsx    # Main card component
│   │   └── ui/
│   │       └── card.jsx          # UI card component
│   ├── lib/
│   │   ├── dataLoader.js         # CSV data loader
│   │   └── utils.js              # Utilities
│   └── styles/
│       └── globals.css           # Global styles
├── pages/
│   ├── index.js                  # Main page
│   ├── _app.js                   # App wrapper
│   └── _document.js              # Document template
├── public/
│   ├── data/
│   │   └── supertrumpf.csv       # Card data
│   └── maps/
│       └── *.svg                 # District SVG maps
├── docs/generated/               # Generated setup notes
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind config
├── postcss.config.js             # PostCSS config
└── jsconfig.json                 # Path aliases
```

The larger raw data, notebooks, and source exports now live in the sibling folder:

`/home/tim/Projekte/odis_berlin_prognoseraeume_cardgame/cardgame-archive`

## Features
- Displays all 58 Berlin admin area cards
- SVG maps for each district
- Real data from CSV file
- Navigation between cards
- Blue/yellow color scheme matching the design

## To Stop the Server
Press Ctrl+C in the terminal

## To Restart the Server
```bash
cd /home/tim/Projekte/odis_berlin_prognoseraeume_cardgame/odis-cardgame
npm run dev
```
