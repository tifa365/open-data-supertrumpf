import React from 'react';
import { MapPin } from "lucide-react";
import useMapSvg from '@/hooks/useMapSvg';

export default function TinyCard({ data, mapPath }) {
  const blue = "#002F6C";
  const yellow = "#F4E85A";
  const svgContent = useMapSvg(mapPath, { fill: blue, strokeWidth: '0.3' });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      style={{
        width: '90px',
        height: '130px',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* District badge */}
      <div style={{ 
        backgroundColor: '#f3f4f6',
        padding: '2px 4px',
        textAlign: 'center'
      }}>
        <span style={{ 
          fontSize: '8px',
          fontWeight: '600',
          color: blue 
        }}>
          {data.Bezirk.split('-')[0]}
        </span>
      </div>

      {/* Map */}
      <div style={{ 
        height: '35px',
        backgroundColor: '#f9fafb',
        padding: '2px'
      }}>
        {svgContent ? (
          <div 
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div style={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={12} color="#9ca3af" />
          </div>
        )}
      </div>

      {/* District name */}
      <div style={{ 
        backgroundColor: '#eff6ff',
        padding: '2px 4px',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          fontSize: '9px',
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
        padding: '4px',
        fontSize: '7px',
        color: blue
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2px'
        }}>
          <span>Fläche</span>
          <span style={{ fontWeight: '600' }}>{data.Fläche}</span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2px'
        }}>
          <span>Einw.</span>
          <span style={{ fontWeight: '600' }}>
            {Math.round(data.Einwohner/1000)}k
          </span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2px'
        }}>
          <span>NO₂</span>
          <span style={{ fontWeight: '600' }}>{data.Luft}</span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Imbisse</span>
          <span style={{ fontWeight: '600' }}>{data.Imbisse}</span>
        </div>
      </div>
    </div>
  );
}