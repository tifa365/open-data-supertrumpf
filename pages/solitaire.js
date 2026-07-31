import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SolitaireCard from '@/components/SolitaireCard';
import SupertrumpfCard from '@/components/SupertrumpfCard';
import { loadCardData, getMapPath } from '@/lib/dataLoader';

// Solitaire: all 58 cards laid out on the table; clicking one opens
// the canonical card as a detail view.
export default function Solitaire() {
  const [cardData, setCardData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadCardData().then(setCardData);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedCard(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2E3EA1' }}>
      <header className="px-6 pt-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Open Data Supertrumpf
        </h1>
        <p className="text-sm text-blue-100">
          Solitaire – {cardData.length} Karten, klicken für Details
        </p>
      </header>

      <div className="container mx-auto px-4 pb-10 pt-6">
        <div className="mx-auto flex max-w-[920px] flex-wrap justify-center gap-4">
          {cardData.map((card) => (
            <button
              key={card.Ortsteil}
              type="button"
              onClick={() => setSelectedCard(card)}
              className="cursor-pointer p-0 text-left"
            >
              <SolitaireCard data={card} />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-blue-100 underline hover:text-white">
            Zur Kartenübersicht
          </Link>
        </div>
      </div>

      {/* Detail view: the canonical card */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ backgroundColor: 'rgba(2, 8, 40, 0.8)' }}
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <SupertrumpfCard
              data={selectedCard}
              mapPath={getMapPath(selectedCard.Ortsteil)}
            />
            <button
              type="button"
              aria-label="Schließen"
              onClick={() => setSelectedCard(null)}
              className="absolute -right-3 -top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-xl font-bold shadow-md"
              style={{ color: '#002F6C' }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
