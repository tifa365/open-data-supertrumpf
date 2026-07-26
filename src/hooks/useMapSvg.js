import { useEffect, useState } from 'react';

// Fetch a map SVG, normalize its sizing and recolor its paths.
// Returns the prepared SVG markup (or null while loading / on error).
export default function useMapSvg(mapPath, { fill, stroke = 'white', strokeWidth = '1' } = {}) {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    if (!mapPath) return;
    let cancelled = false;

    fetch(mapPath)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (svgElement && !cancelled) {
          svgElement.removeAttribute('xmlns:xlink');
          svgElement.setAttribute('width', '100%');
          svgElement.setAttribute('height', '100%');
          svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

          const paths = svgElement.querySelectorAll('path');
          paths.forEach(path => {
            path.setAttribute('fill', fill);
            path.setAttribute('stroke', stroke);
            path.setAttribute('stroke-width', strokeWidth);
          });

          setSvgContent(svgElement.outerHTML);
        }
      })
      .catch(error => console.error('Error loading SVG:', error));

    return () => {
      cancelled = true;
    };
  }, [mapPath, fill, stroke, strokeWidth]);

  return svgContent;
}
