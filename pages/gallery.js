import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSwipeNav from '@/lib/useSwipeNav';
import SupertrumpfCard from '@/components/SupertrumpfCard';
import { loadCardData, getMapPath } from '@/lib/dataLoader';

const CARD_WIDTH = 340;
const CARD_GAP = 24;

// Gallery: all 58 canonical cards on one long conveyor-belt track;
// prev/next slides the track one card, arrow keys work, clicking a
// neighbor jumps to it.
export default function Gallery() {
  const router = useRouter();
  const [cardData, setCardData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadCardData().then(setCardData);
  }, []);

  const count = cardData.length;
  const prev = useCallback(() => setActiveIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setActiveIndex((i) => Math.min(count - 1, i + 1)),
    [count]
  );

  // Horizontal swipes browse the track like the arrow keys; swiping
  // right on the first card — where no previous card exists — leaves
  // to the start page
  useSwipeNav({
    onLeft: next,
    onRight: () => {
      if (activeIndex === 0) router.push('/');
      else prev();
    },
  });

  useEffect(() => {
    if (count === 0) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, prev, next]);

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#2E3EA1' }}>
      <header className="flex flex-wrap items-start justify-between gap-3 px-6 pt-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Open Data Supertrumpf
          </h1>
          <p className="text-sm text-blue-100">Galerie – alle 58 Prognoseräume</p>
        </div>
        <Link href="/" className="btn-stamp btn-stamp-secondary">
          ← Zur Startseite
        </Link>
      </header>

      <div className="pb-10 pt-6">
        {/* Conveyor: one long track, slid so the active card is centered */}
        <div className="relative h-[520px] w-full overflow-hidden">
          <div
            className="absolute left-1/2 top-0 flex items-start transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{
              gap: `${CARD_GAP}px`,
              transform: `translateX(${-activeIndex * (CARD_WIDTH + CARD_GAP) - CARD_WIDTH / 2}px)`,
            }}
          >
            {cardData.map((card, index) => (
              <div
                key={card.Ortsteil}
                className={`shrink-0 cursor-pointer transition-all duration-500 motion-reduce:transition-none ${
                  index === activeIndex ? '' : 'scale-90 opacity-60 hover:opacity-90'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <SupertrumpfCard data={card} mapPath={getMapPath(card.Ortsteil)} />
              </div>
            ))}
          </div>
        </div>

        {count > 0 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={activeIndex === 0}
              className="btn-stamp btn-stamp-secondary disabled:pointer-events-none disabled:opacity-40"
            >
              ← Vorherige
            </button>
            <span className="text-sm font-bold text-white">
              {activeIndex + 1} / {count}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={activeIndex === count - 1}
              className="btn-stamp btn-stamp-secondary disabled:pointer-events-none disabled:opacity-40"
            >
              Nächste →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
