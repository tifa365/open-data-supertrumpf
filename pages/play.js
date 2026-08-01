import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSwipeNav from '@/lib/useSwipeNav';
import SupertrumpfCard from '@/components/SupertrumpfCard';
import CardBack from '@/components/CardBack';
import { loadCardData, getMapPath, getArtworkPath } from '@/lib/dataLoader';
import { CATEGORIES, compareCards } from '@/lib/categories';

const blue = "#002F6C";
const yellow = "#F4E85A";

// Top Trumps against the computer: each run deals 9 random cards per
// side from the 58, the player picks the category every round, the
// better value wins both cards. Lower wins for NO₂, Versiegelung and
// Rettungsdienst-Anfahrt.
const HAND_SIZE = 9;

export default function Play() {
  const router = useRouter();
  const [allCards, setAllCards] = useState([]);
  const [playerDeck, setPlayerDeck] = useState([]);
  const [aiDeck, setAiDeck] = useState([]);
  const [phase, setPhase] = useState('loading'); // loading | pick | reveal | over
  const [selectedKey, setSelectedKey] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [round, setRound] = useState(1);

  const startGame = useCallback((cards) => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setPlayerDeck(shuffled.slice(0, HAND_SIZE));
    setAiDeck(shuffled.slice(HAND_SIZE, HAND_SIZE * 2));
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

  // Swipe up (from the bottom of the page) to return to the start page
  useSwipeNav({ onPullUp: () => router.push('/') });

  const playerCard = playerDeck[0];
  const aiCard = aiDeck[0];

  const playRound = useCallback((key) => {
    const cat = CATEGORIES.find((c) => c.key === key);
    setSelectedKey(key);
    setRoundWinner(compareCards(cat, playerDeck[0], aiDeck[0]));
    setPhase('reveal');
  }, [playerDeck, aiDeck]);

  const nextRound = () => {
    const p = playerDeck[0];
    const a = aiDeck[0];
    let nextPlayer = playerDeck.slice(1);
    let nextAi = aiDeck.slice(1);
    if (roundWinner === 'player') {
      nextPlayer = [...nextPlayer, p, a];
    } else if (roundWinner === 'ai') {
      nextAi = [...nextAi, a, p];
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

  // The round that decides the game: the loser is about to hand over
  // their last card
  const isFinalRound =
    phase === 'reveal' &&
    (roundWinner === 'player'
      ? aiDeck.length === 1
      : roundWinner === 'ai'
        ? playerDeck.length === 1
        : false);

  // The player's card with its result flourish, shared by the mobile
  // and desktop branches below
  const playerCardFx = playerCard && (
    <ResultFx side="player" phase={phase} roundWinner={roundWinner} isFinalRound={isFinalRound}>
      <SupertrumpfCard
        data={playerCard}
        mapPath={getMapPath(playerCard.Ortsteil)}
        onSelectCategory={phase === 'pick' ? playRound : undefined}
        highlightKey={selectedKey}
        highlightTone={
          roundWinner === 'player' ? 'win' : roundWinner === 'ai' ? 'lose' : undefined
        }
      />
    </ResultFx>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#2E3EA1" }}>
      {/* Desktop only — on mobile the game starts right at the top and
          the title sits at the bottom of the page */}
      <header className="hidden flex-wrap items-start justify-between gap-3 px-6 pt-5 lg:flex">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Open Data Supertrumpf
        </h1>
        <Link href="/" className="btn-stamp btn-stamp-secondary">
          ← Zur Startseite
        </Link>
      </header>
      <div className="container mx-auto px-4 pb-6 pt-3 lg:pt-2">

        {phase === 'loading' && (
          <p className="py-20 text-center text-blue-100">Karten werden gemischt …</p>
        )}

        {phase !== 'loading' && (
          <>
            {phase === 'over' ? (
              <div className="py-16 text-center">
                <p className="mb-2 text-lg text-blue-100">Runde {round}</p>
                <h2 className="mb-6 text-4xl font-extrabold text-white">
                  {playerDeck.length === 0
                    ? 'Der Computer hat alle Karten gewonnen.'
                    : 'Du hast alle Karten gewonnen!'}
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
                {/* Mobile („Kompakter Gegner“): der Computer belegt nur
                    eine schmale Zeile am oberen Rand — erst verdeckt,
                    nach der Wahl mit Artwork, Name und dem Wert der
                    gespielten Kategorie. Karte, Ergebnis und Button
                    passen so ohne Scrollen auf einen Screen. */}
                <div className="lg:hidden" style={{ perspective: '900px' }}>
                  <p className="mb-2 text-center text-sm font-bold text-white">Computer-Karte</p>
                  <OpponentStrip
                    aiCard={aiCard}
                    revealed={phase === 'reveal'}
                    selectedCat={selectedCat}
                    aiCount={aiDeck.length}
                    roundWinner={roundWinner}
                  />
                  <p className="mb-2 mt-4 text-center text-sm font-bold text-white">Deine Karte</p>
                  <div className="flex justify-center">{playerCardFx}</div>
                </div>

                {/* Desktop: beide Karten nebeneinander */}
                <div
                  className="hidden items-start justify-center gap-8 lg:flex"
                  style={{ zoom: 1.22, perspective: '900px' }}
                >
                  <div className="text-center">
                    <p className="mb-6 text-sm font-bold text-white">Deine Karte</p>
                    {playerCardFx}
                  </div>

                  <div className="self-center text-3xl font-extrabold text-white">
                    vs.
                  </div>

                  <div className="text-center">
                    <p className="mb-6 text-sm font-bold text-white">Computer</p>
                    {phase === 'reveal' ? (
                      <ResultFx side="ai" phase={phase} roundWinner={roundWinner} isFinalRound={isFinalRound}>
                        <SupertrumpfCard
                          data={aiCard}
                          mapPath={aiCard && getMapPath(aiCard.Ortsteil)}
                          highlightKey={selectedKey}
                          highlightTone={
                            roundWinner === 'ai' ? 'win' : roundWinner === 'player' ? 'lose' : undefined
                          }
                        />
                      </ResultFx>
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

                {phase === 'reveal' && roundWinner && (
                  <div key={round} className="result-callout" aria-hidden="true">
                    <span
                      style={{
                        color:
                          roundWinner === 'player'
                            ? '#B9E7AF'
                            : roundWinner === 'ai'
                              ? '#F5B8B8'
                              : '#F4E85A',
                      }}
                    >
                      {roundWinner === 'player'
                        ? 'Gewonnen!'
                        : roundWinner === 'ai'
                          ? 'Verloren'
                          : 'Unentschieden'}
                    </span>
                  </div>
                )}

                <p className="mt-3 text-center text-sm text-blue-100 lg:mt-14" aria-live="polite">
                  {phase === 'pick' &&
                    'Runde ' + round + ' – wähle eine Kategorie auf deiner Karte.'}
                  {phase === 'reveal' && selectedCat && (
                    roundWinner === 'tie'
                      ? `${selectedCat.label}: Unentschieden – beide behalten ihre Karte.`
                      : roundWinner === 'player'
                        ? `${selectedCat.label}: Du gewinnst die Runde und übernimmst die Karte!`
                        : `${selectedCat.label}: Der Computer gewinnt die Runde.`
                  )}
                </p>

                {phase === 'reveal' && (
                  <div className="mt-3 text-center lg:mt-4">
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

                <div className="mt-4 lg:mt-6">
                  <DeckBar playerCount={playerDeck.length} aiCount={aiDeck.length} />
                </div>

                <p className="mt-6 text-center text-xs text-blue-200">
                  Bei Luftqualität (NO₂), Versiegelung und Rettungsdienst-Anfahrt gewinnt
                  der niedrigere Wert.
                </p>
              </>
            )}

          </>
        )}

        <div className="mt-8 text-center lg:hidden">
          <p className="mb-3 text-sm font-extrabold tracking-tight text-white">
            Open Data Supertrumpf
          </p>
          <Link href="/" className="btn-stamp btn-stamp-secondary">
            ↑ Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wraps a card with the round-result flourish: the winner flips once
// in place (card back visible mid-turn) and gets a light sweep; the
// loser dims. The game-deciding round flips slower with a soft glow.
function ResultFx({ side, phase, roundWinner, isFinalRound, children }) {
  if (phase !== 'reveal' || !roundWinner || roundWinner === 'tie') {
    return <div className="relative">{children}</div>;
  }
  if (roundWinner !== side) {
    return <div className="fx-lose relative">{children}</div>;
  }
  return (
    <div className={`relative ${isFinalRound ? 'fx-win fx-win-final' : 'fx-win'}`}>
      <div style={{ backfaceVisibility: 'hidden' }}>{children}</div>
      <div
        className="absolute inset-0"
        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
      >
        <CardBack />
      </div>
      <span className="fx-shine" />
    </div>
  );
}

// Mobile only: the computer's card as a slim strip. Face-down while the
// player picks; after the reveal it shows artwork, name and the played
// category's value, tinted green/red/yellow with the round outcome.
function OpponentStrip({ aiCard, revealed, selectedCat, aiCount, roundWinner }) {
  const tone =
    roundWinner === 'ai' ? '#B9E7AF' : roundWinner === 'player' ? '#F5B8B8' : yellow;
  return (
    <div
      className="mx-auto flex w-full max-w-[340px] items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-lg"
      style={{ color: blue }}
    >
      {revealed ? (
        <img
          src={getArtworkPath(aiCard.Ortsteil)}
          alt={`Karte von ${aiCard.Ortsteil}`}
          className="h-11 w-11 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: '#ACD7EF' }}
        >
          {/* Mini card back: tilted map tile with red pin */}
          <svg width="26" height="26" viewBox="0 0 60 60" aria-hidden="true">
            <rect
              x="13" y="20" width="34" height="34" rx="4"
              fill="white" stroke={blue} strokeWidth="2.5"
              transform="rotate(-12 30 37)"
            />
            <path
              d="M38 6c-4.4 0-8 3.6-8 8 0 6 8 15 8 15s8-9 8-15c0-4.4-3.6-8-8-8z"
              fill="#D8232A"
            />
            <circle cx="38" cy="14" r="3" fill="white" />
          </svg>
        </div>
      )}
      <div className="min-w-0">
        {revealed ? (
          <>
            <p className="truncate text-sm font-extrabold leading-tight">
              {aiCard.Ortsteil}{' '}
              <span className="text-[11px] font-normal text-gray-500">· {aiCard.Bezirk}</span>
            </p>
            {selectedCat && (
              <span
                className="mt-0.5 inline-block max-w-full truncate rounded-full px-2 text-[11px] font-bold"
                style={{ backgroundColor: tone }}
              >
                {selectedCat.label}&nbsp;&nbsp;{selectedCat.format(aiCard)}
              </span>
            )}
          </>
        ) : (
          <>
            <p className="text-sm font-extrabold leading-tight">Noch verdeckt</p>
            <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 text-[11px] text-gray-500">
              wartet auf deine Wahl
            </span>
          </>
        )}
      </div>
      <div className="ml-auto shrink-0 text-right text-[11px] font-bold leading-tight text-gray-500">
        {aiCount} Karten
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
