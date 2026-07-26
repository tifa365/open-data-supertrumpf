import React, { useEffect, useState } from 'react';
import SolitaireCard from '@/components/SolitaireCard';
import CompactSupertrumpfCard from '@/components/CompactSupertrumpfCard';
import { loadCardData, getMapPath } from '@/lib/dataLoader';

export default function Solitaire() {
  const [cardData, setCardData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadCardData().then(data => {
      setCardData(data);
    });
  }, []);

  // Create rows of 5 cards each
  const rows = [];
  for (let i = 0; i < cardData.length; i += 5) {
    rows.push(cardData.slice(i, i + 5));
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #059669, #064e3b)',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>
          Berlin Prognoseräume - Solitaire
        </h1>
        <p style={{ color: '#86efac', fontSize: '16px' }}>
          {cardData.length} Karten - Klicken für Details
        </p>
      </div>
      
      <div style={{ 
        maxWidth: '850px',
        margin: '0 auto'
      }}>
        {rows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            style={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}
          >
            {row.map((card, cardIndex) => (
              <div 
                key={`${rowIndex}-${cardIndex}`} 
                onClick={() => setSelectedCard(card)}
              >
                <SolitaireCard 
                  data={card} 
                  mapPath={getMapPath(card.Ortsteil)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Detailed view modal */}
      {selectedCard && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px'
          }}
          onClick={() => setSelectedCard(null)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '16px',
              maxWidth: '450px',
              position: 'relative',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#002F6C' }}>
                  {selectedCard.Ortsteil}
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280', marginTop: '5px' }}>
                  {selectedCard.Bezirk}
                </p>
              </div>
              <button 
                style={{
                  fontSize: '30px',
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setSelectedCard(null)}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CompactSupertrumpfCard 
                data={selectedCard} 
                mapPath={getMapPath(selectedCard.Ortsteil)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}