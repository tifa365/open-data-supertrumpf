import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import SupertrumpfCard from '@/components/SupertrumpfCard';
import CardBack from '@/components/CardBack';
import { loadCardData, getMapPath } from '@/lib/dataLoader';
import { CATEGORIES, compareCards } from '@/lib/categories';

const blue = "#002F6C";
const yellow = "#F4E85A";

// Classic Top Trumps against the computer: the deck is split in half,
// the active side picks a category, the better value wins both cards,
// and the winner picks next. Lower wins for NO₂, Versiegelung and
// Rettungsdienst-Anfahrt.
export default function Play() {
  const [allCards, setAllCards] = useState([]);
  const [playerDeck, setPlayerDeck] = useState([]);
  const [aiDeck, setAiDeck] = useState([]);
  const [phase, setPhase] = useState('loading'); // loading | pick | reveal | over
  const [turn, setTurn] = useState('player');
  const [selectedKey, setSelectedKey] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [round, setRound] = useState(1);

  const startGame = useCallback((cards) => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffled.length / 2);
    setPlayerDeck(shuffled.slice(0, half));
    setAiDeck(shuffled.slice(half));
    setTurn('player');
    setSelectedKey(null);
    setRoundWinner(null);
    setRound(1);
    setPhase('pick');
  }, []);

  useEffect(() => {
    loadCardData().then((cards) => {
      setAllCards(cards);
      if (cards.length > 0) startGame(cards);
    });
  }, [startGame]);

  const playerCard = playerDeck[0];
  const aiCard = aiDeck[0];

  const playRound = useCallback((key) => {
    const cat = CATEGORIES.find((c) => c.key === key);
    setSelectedKey(key);
    setRoundWinner(compareCards(cat, playerDeck[0], aiDeck[0]));
    setPhase('reveal');
  }, [playerDeck, aiDeck]);

  // The computer picks the category on which its card beats the most
  // of the full deck.
  useEffect(() => {
    if (phase !== 'pick' || turn !== 'ai' || !aiCard) return;
    const timer = setTimeout(() => {
      let bestKey = CATEGORIES[0].key;
      let bestScore = -1;
      for (const cat of CATEGORIES) {
        const v = cat.get(aiCard);
        const beaten = allCards.filter((d) =>
          cat.higherWins ? cat.get(d) < v : cat.get(d) > v
        ).length;
        if (beaten > bestScore) {
          bestScore = beaten;
          bestKey = cat.key;
        }
      }
      playRound(bestKey);
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, turn, aiCard, allCards, playRound]);

  const nextRound = () => {
    const p = playerDeck[0];
    const a = aiDeck[0];
    let nextPlayer = playerDeck.slice(1);
    let nextAi = aiDeck.slice(1);
    if (roundWinner === 'player') {
      nextPlayer = [...nextPlayer, p, a];
      setTurn('player');
    } else if (roundWinner === 'ai') {
      nextAi = [...nextAi, a, p];
      setTurn('ai');
    } else {
      nextPlayer = [...nextPlayer, p];
      nextAi = [...nextAi, a];
    }
    setPlayerDeck(nextPlayer);
    setAiDeck(nextAi);
    setSelectedKey(null);
    setRoundWinner(null);
    setRound((r) => r + 1);
    setPhase(nextPlayer.length === 0 || nextAi.length === 0 ? 'over' : 'pick');
  };

  const selectedCat = selectedKey && CATEGORIES.find((c) => c.key === selectedKey);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#2E3EA1" }}>
      <div className="container mx-auto px-4 py-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Open Data Supertrumpf
          </h1>
          <Link href="/" className="text-sm text-blue-100 underline hover:text-white">
            Zur Kartenübersicht
          </Link>
        </header>

        {phase === 'loading' && (
          <p className="py-20 text-center text-blue-100">Karten werden gemischt …</p>
        )}

        {phase !== 'loading' && (
          <>
            <DeckBar playerCount={playerDeck.length} aiCount={aiDeck.length} />

            {phase === 'over' ? (
              <div className="py-16 text-center">
                <p className="mb-2 text-lg text-blue-100">Runde {round}</p>
                <h2 className="mb-6 text-4xl font-extrabold text-white">
                  {playerDeck.length === 0
                    ? 'Der Computer hat alle Karten gewonnen.'
                    : 'Du hast alle 58 Karten gewonnen!'}
                </h2>
                <button
                  type="button"
                  onClick={() => startGame(allCards)}
                  className="btn-stamp btn-stamp-primary"
                >
                  Nochmal spielen
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-center text-sm text-blue-100" aria-live="polite">
                  {phase === 'pick' && turn === 'player' &&
                    'Runde ' + round + ' – wähle eine Kategorie auf deiner Karte.'}
                  {phase === 'pick' && turn === 'ai' &&
                    'Runde ' + round + ' – der Computer wählt eine Kategorie …'}
                  {phase === 'reveal' && selectedCat && (
                    roundWinner === 'tie'
                      ? `${selectedCat.label}: Unentschieden – beide behalten ihre Karte.`
                      : roundWinner === 'player'
                        ? `${selectedCat.label}: Du gewinnst die Runde und übernimmst die Karte!`
                        : `${selectedCat.label}: Der Computer gewinnt die Runde.`
                  )}
                </p>

                <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
                  <div className="text-center">
                    <p className="mb-2 text-sm font-bold text-white">Deine Karte</p>
                    <SupertrumpfCard
                      data={playerCard}
                      mapPath={playerCard && getMapPath(playerCard.Ortsteil)}
                      onSelectCategory={
                        phase === 'pick' && turn === 'player' ? playRound : undefined
                      }
                      highlightKey={selectedKey}
                    />
                  </div>

                  <div className="hidden self-center text-3xl font-extrabold text-white lg:block">
                    vs.
                  </div>

                  <div className="text-center">
                    <p className="mb-2 text-sm font-bold text-white">Computer</p>
                    {phase === 'reveal' ? (
                      <SupertrumpfCard
                        data={aiCard}
                        mapPath={aiCard && getMapPath(aiCard.Ortsteil)}
                        highlightKey={selectedKey}
                      />
                    ) : (
                      /* Invisible copy of the player's card sizes the back
                         to exactly match the face-up card */
                      <div className="relative">
                        <div className="invisible" aria-hidden="true">
                          <SupertrumpfCard
                            data={playerCard}
                            mapPath={playerCard && getMapPath(playerCard.Ortsteil)}
                          />
                        </div>
                        <div className="absolute inset-0">
                          <CardBack />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {phase === 'reveal' && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={nextRound}
                      className="btn-stamp btn-stamp-primary"
                    >
                      {playerDeck.length <= 1 || aiDeck.length <= 1
                        ? 'Ergebnis anzeigen'
                        : 'Nächste Runde'}
                    </button>
                  </div>
                )}

                <p className="mt-8 text-center text-xs text-blue-200">
                  Bei Luftqualität (NO₂), Versiegelung und Rettungsdienst-Anfahrt gewinnt
                  der niedrigere Wert.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DeckBar({ playerCount, aiCount }) {
  const total = playerCount + aiCount;
  const playerShare = total === 0 ? 50 : (playerCount / total) * 100;
  return (
    <div className="mx-auto mb-6 max-w-xl">
      <div className="mb-1 flex justify-between text-sm font-bold text-white">
        <span>Du · {playerCount} Karten</span>
        <span>Computer · {aiCount} Karten</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${playerShare}%`, backgroundColor: yellow }}
        />
      </div>
    </div>
  );
}
