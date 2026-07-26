// Load and parse CSV data for the cards
export async function loadCardData() {
  try {
    const response = await fetch('/data/supertrumpf.csv');
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

// Convert area name to SVG filename format
export function getMapPath(ortsteil) {
  const filename = ortsteil.replace(/[ /]/g, "_");
  return `/maps/${filename}.svg`;
}
