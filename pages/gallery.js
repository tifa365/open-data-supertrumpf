import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { loadCardData, getMapPath } from '@/lib/dataLoader';

/**
 * Berlin District SupertrumpfCard Gallery
 * A collection of data cards for different Berlin districts
 */
export default function SupertrumpfGallery() {
  const [cardData, setCardData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [svgContents, setSvgContents] = useState({});

  useEffect(() => {
    loadCardData().then(data => {
      setCardData(data);
    });
  }, []);

  // Load SVG content for each card
  useEffect(() => {
    cardData.forEach(card => {
      const mapPath = getMapPath(card.Ortsteil);
      fetch(mapPath)
        .then(response => response.text())
        .then(svgText => {
          setSvgContents(prev => ({
            ...prev,
            [card.Ortsteil]: svgText
          }));
        })
        .catch(error => console.error('Error loading SVG:', error));
    });
  }, [cardData]);

  const formatNumber = (num) => {
    return parseInt(num).toLocaleString('de-DE');
  };

  const formatResponseTime = (min, sek) => {
    return `${min} Min. ${sek} Sek.`;
  };

  // Convert loaded data to district format
  const districts = cardData.map((data, index) => {
    const colors = getDistrictColors(index);
    return {
      district: data.Bezirk,
      subDistrict: data.Ortsteil,
      ...colors,
      data: [
        { label: "Fläche", value: `${data.Fläche} km²` },
        { label: "Einwohner:innen", value: formatNumber(data.Einwohner) },
        { label: "Straßen mit Frauennamen", value: `${data.Straßen}%` },
        { label: "Solarpotential", value: `${data.Solar} GWh/a` },
        { label: "Luftqualität (NO₂)", value: `${data.Luft} µg/m³` },
        { label: "Versiegelung", value: `${data.Versiegelung}%` },
        { label: "Schnellimbiss-Anzahl", value: data.Imbisse },
        { label: "Rettungsdienst-Anfahrt", value: formatResponseTime(data.Min, data.Sek) }
      ],
      svgContent: svgContents[data.Ortsteil]
    };
  });

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % districts.length);
  };
  
  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + districts.length) % districts.length);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Berlin DATA SUPERTRUMPF</h1>
      
      <div className="relative">
        {/* Desktop view: show multiple cards */}
        <div className="hidden lg:flex space-x-4 items-center justify-center">
          {districts.slice(
            Math.max(0, activeIndex - 2),
            Math.min(districts.length, activeIndex + 3)
          ).map((district, index) => {
            const globalIndex = Math.max(0, activeIndex - 2) + index;
            return (
              <div 
                key={globalIndex} 
                className={`transition-all duration-300 transform cursor-pointer ${globalIndex === activeIndex ? 'scale-100' : 'scale-90 opacity-70'}`}
                onClick={() => setActiveIndex(globalIndex)}
              >
                <GalleryCard district={district} />
              </div>
            );
          })}
        </div>

        {/* Mobile view: single card carousel */}
        <div className="lg:hidden relative">
          {districts[activeIndex] && <GalleryCard district={districts[activeIndex]} />}
          
          {/* Navigation buttons */}
          <button 
            onClick={prev}
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={next}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-4 space-x-2 flex-wrap max-w-xl mx-auto">
          {districts.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full m-1 ${index === activeIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Get colors for each district
function getDistrictColors(index) {
  const colorSchemes = [
    { color: "#002F6C", bgColor: "#B3E0FF", mapColor: "#F4E85A" },
    { color: "#00594C", bgColor: "#B3E8D9", mapColor: "#FFC876" },
    { color: "#5C0F47", bgColor: "#E7BDDA", mapColor: "#A4E8FF" },
    { color: "#6A3311", bgColor: "#FFD6B8", mapColor: "#D4F7B9" },
    { color: "#233D7B", bgColor: "#C3D0F0", mapColor: "#FFE8A8" },
    { color: "#4B0082", bgColor: "#E6E6FA", mapColor: "#FFD700" },
    { color: "#006400", bgColor: "#90EE90", mapColor: "#FFA500" },
    { color: "#8B4513", bgColor: "#F4A460", mapColor: "#87CEEB" },
  ];
  return {
    ...colorSchemes[index % colorSchemes.length],
    // Stable per-district hue so the map color doesn't change between renders
    mapHue: (index * 137) % 360,
  };
}

/**
 * GalleryCard - gallery-specific card design for Berlin districts.
 * Intentionally different from src/components/SupertrumpfCard.jsx (the canonical card).
 */
function GalleryCard({ district }) {
  const {
    district: districtName,
    subDistrict,
    color,
    bgColor,
    mapColor,
    mapHue,
    data,
    svgContent
  } = district;
  
  return (
    <div className="relative">
      {/* Background card */}
      <div className="absolute top-6 -right-6 h-full rounded-3xl shadow-md transform rotate-3 z-0" 
           style={{ backgroundColor: bgColor, width: '380px', height: '480px' }}>
        {/* DATA SUPERTRUMPF circular text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-64 w-64">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path id={`curve-${districtName}`} fill="none" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
              <text style={{ fill: color }} fontSize="14">
                <textPath xlinkHref={`#curve-${districtName}`} startOffset="0%">
                  D A T A   S U P E R T R U M P F
                </textPath>
              </text>
            </svg>
            
            {/* Map pin logo in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-16 w-16">
                <div className="absolute h-16 w-16 rounded-full bg-red-600 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full bg-white"></div>
                </div>
                <div className="absolute top-6 left-4 h-20 w-20 border-2 bg-white p-1 rounded-md transform -rotate-12"
                     style={{ borderColor: color }}>
                  <div className="h-full w-full relative">
                    <svg viewBox="0 0 100 100" className="absolute inset-0">
                      <line x1="20" y1="20" x2="80" y2="30" stroke={color} strokeWidth="1" />
                      <line x1="20" y1="20" x2="30" y2="80" stroke={color} strokeWidth="1" />
                      <line x1="80" y1="30" x2="70" y2="70" stroke={color} strokeWidth="1" />
                      <line x1="30" y1="80" x2="70" y2="70" stroke={color} strokeWidth="1" />
                      <circle cx="20" cy="20" r="3" fill={color} />
                      <circle cx="80" cy="30" r="3" fill={color} />
                      <circle cx="30" cy="80" r="3" fill={color} />
                      <circle cx="70" cy="70" r="3" fill={color} />
                      <circle cx="50" cy="50" r="3" fill={color} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Main white card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-lg p-6 pb-2" 
           style={{ width: '420px', minHeight: '480px' }}>
        {/* Title with colored background */}
        <div className="mb-6 relative inline-block">
          <div className="absolute -top-1 -left-1 h-full w-full rounded" 
               style={{ backgroundColor: mapColor }}></div>
          <div className="border-2 px-4 py-1 relative z-10 inline-block" 
               style={{ borderColor: color }}>
            <span className="font-bold" style={{ color: color }}>
              {districtName}
            </span>
          </div>
        </div>
        
        {/* Map area with actual SVG */}
        <div className="relative mb-6 h-44 w-full overflow-hidden rounded-lg"
             style={{ backgroundColor: mapColor }}>
          {svgContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="w-full h-full p-4"
              style={{
                filter: `hue-rotate(${mapHue}deg)`
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin size={48} color={color} />
            </div>
          )}
        </div>
        
        {/* District name with horizontal lines */}
        <div className="mb-5">
          <div className="h-0.5 w-full" style={{ backgroundColor: color, opacity: 0.85 }}></div>
          <div className="flex items-center py-2">
            <h2 className="w-full text-center text-xl font-bold" 
                style={{ color: color }}>
              {subDistrict}
            </h2>
          </div>
          <div className="h-0.5 w-full" style={{ backgroundColor: color, opacity: 0.85 }}></div>
        </div>
        
        {/* Data rows with colored underlines */}
        <div className="mt-5" style={{ color: color }}>
          {data.map((item, index) => (
            <DataRow 
              key={index}
              label={item.label} 
              value={item.value} 
              color={color}
              isLast={index === data.length - 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Data row component with line underneath
function DataRow({ label, value, color, isLast }) {
  return (
    <div className="mb-1">
      <div className="flex justify-between py-1">
        <span className="font-normal">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      {!isLast && <div className="h-px w-full" style={{ backgroundColor: color, opacity: 0.75 }}></div>}
    </div>
  );
}