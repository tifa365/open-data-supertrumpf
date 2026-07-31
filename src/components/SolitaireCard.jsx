import React from 'react';
import { getArtworkPath } from '@/lib/dataLoader';

export default function SolitaireCard({ data }) {
  const blue = "#002F6C";
  const yellow = "#F4E85A";

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      style={{
        width: '150px',
        height: '220px',
        backgroundColor: 'white',
        border: `2px solid ${blue}`,
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* District badge with yellow shadow */}
      <div style={{ 
        padding: '6px',
        textAlign: 'center',
        borderBottom: `1px solid ${blue}`
      }}>
        <div style={{ 
          position: 'relative',
          display: 'inline-block'
        }}>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'translate(3px, 3px)',
              borderRadius: '4px',
              backgroundColor: yellow
            }}
          />
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              borderRadius: '4px',
              border: `2px solid ${blue}`,
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              backgroundColor: 'white',
              color: blue
            }}
          >
            {data.Bezirk}
          </span>
        </div>
      </div>

      {/* District artwork */}
      <div style={{
        height: '60px',
        backgroundColor: '#f9fafb',
        borderBottom: `1px solid ${blue}`,
        overflow: 'hidden'
      }}>
        <img
          src={getArtworkPath(data.Ortsteil)}
          alt={`Karte von ${data.Ortsteil}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* District name */}
      <div style={{ 
        backgroundColor: '#dbeafe',
        padding: '4px',
        textAlign: 'center',
        borderBottom: `1px solid ${blue}`
      }}>
        <h3 style={{ 
          fontSize: '12px',
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: blue
        }}>
          {data.Ortsteil}
        </h3>
      </div>

      {/* Key stats */}
      <div style={{ 
        padding: '6px',
        fontSize: '10px',
        color: blue,
        height: 'calc(100% - 120px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '3px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span>Fläche</span>
          <span style={{ fontWeight: 'bold' }}>{data.Fläche} km²</span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '3px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span>Einwohner</span>
          <span style={{ fontWeight: 'bold' }}>
            {parseInt(data.Einwohner).toLocaleString('de-DE')}
          </span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '3px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span>NO₂</span>
          <span style={{ fontWeight: 'bold' }}>{data.Luft} µg/m³</span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '3px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span>Versiegelung</span>
          <span style={{ fontWeight: 'bold' }}>{data.Versiegelung}%</span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Imbisse</span>
          <span style={{ fontWeight: 'bold' }}>{data.Imbisse}</span>
        </div>
      </div>
    </div>
  );
}