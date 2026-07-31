// Site base path ("" locally, "/open-data-supertrumpf" on GitHub Pages)
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Load and parse CSV data for the cards
export async function loadCardData() {
  try {
    const response = await fetch(`${BASE_PATH}/data/supertrumpf.csv`);
    const text = await response.text();
    
    // Parse CSV
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
    
    return data;
  } catch (error) {
    console.error('Error loading card data:', error);
    return [];
  }
}

// Convert area name to SVG filename format (Berlin locator map)
export function getMapPath(ortsteil) {
  const filename = ortsteil.replace(/[ /]/g, "_");
  return `${BASE_PATH}/maps/${filename}.svg`;
}

// Card artwork: the district on its street map (original print design)
export function getArtworkPath(ortsteil) {
  const filename = ortsteil.replace(/[ /]/g, "_");
  return `${BASE_PATH}/maps/art/${filename}.webp`;
}
