import React from 'react';
import { MapPin } from "lucide-react";
import { CATEGORIES } from '@/lib/categories';
import { getArtworkPath } from '@/lib/dataLoader';

const blue = "#002F6C";
const yellow = "#F4E85A";

// Row highlight backgrounds: yellow while picking / on a tie,
// green on the round winner's card, red on the loser's.
const HIGHLIGHT_COLORS = { win: '#B9E7AF', lose: '#F5B8B8' };

// Canonical card, modeled on the printed Supertrumpf design:
// street-map artwork on top, Bezirk badge with yellow drop, Ortsteil
// title between rules, Fläche/Einwohner next to the Berlin locator,
// then the remaining categories as ruled rows.
// Pass onSelectCategory/highlightKey to make the rows playable;
// highlightTone ('win' | 'lose') colors the highlighted row.
export default function SupertrumpfCard({ data, mapPath, onSelectCategory, highlightKey, highlightTone }) {
  if (!data) {
    return <div>Loading...</div>;
  }

  const interactive = typeof onSelectCategory === 'function';
  const highlightColor = HIGHLIGHT_COLORS[highlightTone] ?? yellow;
  const [flaeche, einwohner, ...rest] = CATEGORIES;

  return (
    <div
      className="w-[340px] overflow-hidden bg-white"
      style={{ borderRadius: "1.1rem", boxShadow: "0 12px 32px rgba(0,18,54,0.28)" }}
    >
      {/* Artwork: district in yellow on its faded street map */}
      <div className="relative h-[190px] bg-gray-100">
        <img
          src={getArtworkPath(data.Ortsteil)}
          alt={`Karte von ${data.Ortsteil}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute left-4 top-3">
          <span className="relative inline-block">
            <span
              className="absolute inset-0 translate-x-[4px] translate-y-[4px]"
              style={{ backgroundColor: yellow }}
            />
            <span
              className="relative inline-block border-2 bg-white px-3 py-[3px] text-xs font-bold tracking-wide"
              style={{ borderColor: blue, color: blue }}
            >
              {data.Bezirk}
            </span>
          </span>
        </div>
      </div>

      <div className="px-5 pb-4" style={{ color: blue }}>
        <div className="border-y-2" style={{ borderColor: blue }}>
          {/* Single line at fixed line-height, so long names shrink
              instead of wrapping and changing the card height */}
          <h2
            className="overflow-hidden whitespace-nowrap py-1.5 text-center font-extrabold tracking-tight"
            style={{
              lineHeight: "28px",
              fontSize:
                data.Ortsteil.length > 28 ? "15px" : data.Ortsteil.length > 22 ? "17px" : "20px",
            }}
          >
            {data.Ortsteil}
          </h2>
        </div>

        {/* Fläche + Einwohner:innen beside the Berlin locator */}
        <div
          className="flex items-center justify-between gap-3 border-b py-1.5"
          style={{ borderColor: blue }}
        >
          <div className="min-w-0 flex-1">
            <StatLine cat={flaeche} data={data} interactive={interactive}
              highlighted={highlightKey === flaeche.key}
              highlightColor={highlightColor}
              onSelect={() => onSelectCategory?.(flaeche.key)} />
            <StatLine cat={einwohner} data={data} interactive={interactive}
              highlighted={highlightKey === einwohner.key}
              highlightColor={highlightColor}
              onSelect={() => onSelectCategory?.(einwohner.key)} />
          </div>
          {mapPath ? (
            <img
              src={mapPath}
              alt="Lage in Berlin"
              className="h-[56px] w-[76px] shrink-0 object-contain"
            />
          ) : (
            <MapPin size={24} className="shrink-0 text-gray-400" />
          )}
        </div>

        {rest.map((cat, i) => (
          <StatRow
            key={cat.key}
            cat={cat}
            data={data}
            interactive={interactive}
            highlighted={highlightKey === cat.key}
            highlightColor={highlightColor}
            onSelect={() => onSelectCategory?.(cat.key)}
            isLast={i === rest.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function StatLine({ cat, data, interactive, highlighted, highlightColor, onSelect }) {
  const content = (
    <>
      <span className="font-normal">{cat.label}&nbsp;&nbsp;</span>
      <span className="font-bold">{cat.format(data)}</span>
    </>
  );
  const style = { backgroundColor: highlighted ? highlightColor : undefined };
  if (!interactive) {
    return <div className="text-[13px] leading-6" style={style}>{content}</div>;
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className="-mx-1 block w-full cursor-pointer px-1 text-left text-[13px] leading-6 hover:bg-[#FBF6C9]"
      style={style}
    >
      {content}
    </button>
  );
}

function StatRow({ cat, data, interactive, highlighted, highlightColor, onSelect, isLast }) {
  const className = `flex w-full items-baseline justify-between py-[5px] text-[13px] ${isLast ? '' : 'border-b'}`;
  const style = { borderColor: blue, backgroundColor: highlighted ? highlightColor : undefined };
  const content = (
    <>
      <span className="font-normal">{cat.label}</span>
      <span className="font-bold">{cat.format(data)}</span>
    </>
  );
  if (!interactive) {
    return <div className={className} style={style}>{content}</div>;
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${className} -mx-1 cursor-pointer px-1 hover:bg-[#FBF6C9]`}
      style={style}
    >
      {content}
    </button>
  );
}
