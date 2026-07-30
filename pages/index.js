import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SupertrumpfCard from '@/components/SupertrumpfCard';
import { loadCardData, getMapPath, getArtworkPath } from '@/lib/dataLoader';

const TURN_MS = 200;

export default function Home() {
  const [cardData, setCardData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turning, setTurning] = useState(null); // null | 'next' | 'prev'

  useEffect(() => {
    loadCardData().then(data => {
      setCardData(data);
    });
  }, []);

  const currentCard = cardData[currentIndex];

  // Preload neighbor artwork so the card isn't blank mid-turn
  useEffect(() => {
    if (cardData.length === 0) return;
    const n = cardData.length;
    [cardData[(currentIndex + 1) % n], cardData[(currentIndex - 1 + n) % n]].forEach((c) => {
      const img = new Image();
      img.src = getArtworkPath(c.Ortsteil);
    });
  }, [currentIndex, cardData]);

  // Turn the card edge-on, swap the content, then turn it back
  const turnTo = (direction, nextIndex) => {
    if (turning) return;
    setTurning(direction);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setTurning(null);
    }, TURN_MS);
  };

  const handlePrevious = () => {
    turnTo('prev', currentIndex > 0 ? currentIndex - 1 : cardData.length - 1);
  };

  const handleNext = () => {
    turnTo('next', currentIndex < cardData.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ODIS Berlin Prognoseräume Supertrumpf
        </h1>
        
        <div className="text-center mb-4">
          <Link
            href="/play"
            className="inline-block border-2 px-8 py-3 font-bold"
            style={{ backgroundColor: '#F4E85A', borderColor: '#002F6C', color: '#002F6C' }}
          >
            Gegen den Computer spielen
          </Link>
        </div>

        <div className="text-center mb-6 space-x-4">
          <Link href="/gallery" className="text-blue-700 hover:text-blue-800 underline">
            Galerie-Ansicht
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/solitaire" className="text-blue-700 hover:text-blue-800 underline">
            Solitaire-Ansicht
          </Link>
        </div>
        
        {currentCard && (
          <>
            <div className="flex justify-center mb-6" style={{ perspective: '1200px' }}>
              <div
                className={`card-turn ${
                  turning === 'next' ? 'is-turning-next' : turning === 'prev' ? 'is-turning-prev' : ''
                }`}
              >
                <SupertrumpfCard
                  data={currentCard}
                  mapPath={getMapPath(currentCard.Ortsteil)}
                />
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePrevious}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                ← Vorherige
              </button>
              <span className="px-4 py-2 text-gray-700">
                {currentIndex + 1} / {cardData.length}
              </span>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Nächste →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}