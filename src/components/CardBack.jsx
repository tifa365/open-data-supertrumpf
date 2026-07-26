import React from 'react';

// Card back from the printed design: light blue, circular
// "OPEN DATA SUPERTRUMPF" text around a red map pin.
export default function CardBack() {
  return (
    <div
      className="flex h-[470px] w-[340px] flex-col items-center justify-center overflow-hidden"
      style={{
        borderRadius: "1.1rem",
        backgroundColor: "#ACD7EF",
        boxShadow: "0 12px 32px rgba(0,18,54,0.28)",
      }}
    >
      <div className="relative h-64 w-64">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <path
              id="cardback-curve"
              fill="none"
              d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
            />
          </defs>
          <text fill="#002F6C" fontSize="15" fontWeight="700" letterSpacing="4">
            <textPath href="#cardback-curve">OPEN DATA SUPERTRUMPF</textPath>
          </text>
        </svg>

        {/* Stylized map tile with red pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-20 w-20">
            <div
              className="absolute left-2 top-6 h-16 w-16 -rotate-12 border-2 bg-white p-1"
              style={{ borderColor: "#002F6C", borderRadius: "6px" }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <line x1="18" y1="22" x2="82" y2="32" stroke="#002F6C" strokeWidth="3" />
                <line x1="18" y1="22" x2="30" y2="80" stroke="#002F6C" strokeWidth="3" />
                <line x1="82" y1="32" x2="70" y2="72" stroke="#002F6C" strokeWidth="3" />
                <line x1="30" y1="80" x2="70" y2="72" stroke="#002F6C" strokeWidth="3" />
                <circle cx="18" cy="22" r="5" fill="#002F6C" />
                <circle cx="82" cy="32" r="5" fill="#002F6C" />
                <circle cx="30" cy="80" r="5" fill="#002F6C" />
                <circle cx="70" cy="72" r="5" fill="#002F6C" />
                <circle cx="50" cy="48" r="5" fill="#002F6C" />
              </svg>
            </div>
            <svg viewBox="0 0 24 24" className="absolute -top-1 left-6 h-12 w-12">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="#D8232A"
              />
              <circle cx="12" cy="9" r="2.6" fill="white" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs tracking-wide" style={{ color: "#002F6C", opacity: 0.75 }}>
        präsentiert von ODIS
      </div>
    </div>
  );
}
