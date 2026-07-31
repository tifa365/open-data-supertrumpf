import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SupertrumpfCard from '@/components/SupertrumpfCard';
import { loadCardData, getMapPath } from '@/lib/dataLoader';

// Gallery: browse all 58 cards as a carousel of canonical cards —
// the active card centered, neighbors beside it, arrow keys work.
export default function Gallery() {
  const [cardData, setCardData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadCardData().then(setCardData);
  }, []);

  const count = cardData.length;
  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + count) % count),
    [count]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % count),
    [count]
  );

  useEffect(() => {
    if (count === 0) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, prev, next]);

  // Active card plus two neighbors on each side
  const visible = [];
  for (let off = -2; count > 0 && off <= 2; off++) {
    const index = (activeIndex + off + count) % count;
    visible.push({ card: cardData[index], off, index });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2E3EA1' }}>
      <header className="px-6 pt-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Open Data Supertrumpf
        </h1>
        <p className="text-sm text-blue-100">Galerie – alle 58 Prognoseräume</p>
      </header>

      <div className="container mx-auto px-4 pb-10 pt-6">
        {/* Desktop: active card with neighbors */}
        <div className="hidden items-center justify-center gap-6 lg:flex">
          {visible.map(({ card, off, index }) => (
            <div
              key={index}
              className={`cursor-pointer transition-all duration-300 ${
                off === 0 ? 'scale-100' : 'scale-90 opacity-60 hover:opacity-90'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <SupertrumpfCard data={card} mapPath={getMapPath(card.Ortsteil)} />
            </div>
          ))}
        </div>

        {/* Mobile: single card with arrows */}
        <div className="relative mx-auto w-fit lg:hidden">
          {cardData[activeIndex] && (
            <SupertrumpfCard
              data={cardData[activeIndex]}
              mapPath={getMapPath(cardData[activeIndex].Ortsteil)}
            />
          )}
          <button
            type="button"
            aria-label="Vorherige Karte"
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Nächste Karte"
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {count > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button type="button" onClick={prev} className="btn-stamp btn-stamp-secondary">
              ← Vorherige
            </button>
            <span className="text-sm font-bold text-white">
              {activeIndex + 1} / {count}
            </span>
            <button type="button" onClick={next} className="btn-stamp btn-stamp-secondary">
              Nächste →
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-100 underline hover:text-white">
            Zur Kartenübersicht
          </Link>
        </div>
      </div>
    </div>
  );
}
