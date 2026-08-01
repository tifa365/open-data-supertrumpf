import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SupertrumpfCard from '@/components/SupertrumpfCard';
import { loadCardData, getMapPath, getArtworkPath } from '@/lib/dataLoader';
import useSwipeNav from '@/lib/useSwipeNav';

const TURN_MS = 200;

export default function Home() {
  const router = useRouter();
  const [cardData, setCardData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turning, setTurning] = useState(null); // null | 'next' | 'prev'

  // Swipe shortcuts, mirrored by the arrows on the buttons: pull down
  // (from the top of the page) to play, left to the gallery, right to
  // solitaire
  useSwipeNav({
    onLeft: () => router.push('/gallery'),
    onRight: () => router.push('/solitaire'),
    onPullDown: () => router.push('/play'),
  });

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
          Open Data Supertrumpf
        </h1>
        
        <div className="text-center mb-5">
          <Link href="/play" className="btn-stamp btn-stamp-primary">
            Jetzt gegen den Computer spielen<span className="lg:hidden"> ↓</span>
          </Link>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <Link href="/gallery" className="btn-stamp btn-stamp-secondary">
            <span className="lg:hidden">← </span>Galerie-Ansicht
          </Link>
          <Link href="/solitaire" className="btn-stamp btn-stamp-secondary">
            Solitaire-Ansicht<span className="lg:hidden"> →</span>
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
            
            <div className="flex items-center justify-center gap-4">
              <button onClick={handlePrevious} className="btn-stamp btn-stamp-secondary">
                ← Vorherige
              </button>
              <span className="px-2 py-2 font-bold" style={{ color: '#002F6C' }}>
                {currentIndex + 1} / {cardData.length}
              </span>
              <button onClick={handleNext} className="btn-stamp btn-stamp-secondary">
                Nächste →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}