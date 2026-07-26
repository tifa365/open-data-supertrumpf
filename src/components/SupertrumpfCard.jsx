import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import useMapSvg from '@/hooks/useMapSvg';

export default function SupertrumpfCard({ data, mapPath }) {
  const blue = "#002F6C";
  const yellow = "#F4E85A";
  const svgContent = useMapSvg(mapPath, { fill: blue, strokeWidth: '1' });

  if (!data) {
    return <div>Loading...</div>;
  }

  const formatResponseTime = () => {
    return `${data.Min} Min ${data.Sek} Sek`;
  };

  const formatNumber = (num) => {
    return parseInt(num).toLocaleString('de-DE');
  };

  return (
    <Card
      className="w-[320px] overflow-hidden bg-white"
      style={{
        borderRadius: "1rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent className="p-5">
        {/* Badge */}
        <div className="relative inline-block">
          <span
            className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded"
            style={{ backgroundColor: yellow }}
          />
          <span
            className="relative inline-block rounded border-[2px] px-3 py-[2px] text-xs font-semibold tracking-wide"
            style={{ borderColor: blue, color: blue }}
          >
            {data.Bezirk}
          </span>
        </div>

        {/* Map */}
        <div className="mt-4 flex h-32 w-full items-center justify-center rounded-md bg-gray-50 overflow-hidden">
          {svgContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="w-full h-full p-3"
            />
          ) : (
            <MapPin size={36} className="text-gray-400" />
          )}
        </div>

        {/* Thick divider */}
        <hr className="my-3 border-[1.5px]" style={{ borderColor: blue }} />

        {/* Sub-district title */}
        <h2 className="text-center text-lg font-bold" style={{ color: blue }}>
          {data.Ortsteil}
        </h2>

        {/* Thick divider */}
        <hr className="my-3 border-[1.5px]" style={{ borderColor: blue }} />

        {/* Data rows with per-row dividers */}
        <div className="text-xs" style={{ color: blue }}>
          {[
            ["Fläche", `${data.Fläche} km²`],
            ["Einwohner:innen", formatNumber(data.Einwohner)],
            ["Straßen mit Frauennamen", `${data.Straßen} %`],
            ["Solarpotenzial", `${data.Solar} GWh/a`],
            ["Luftqualität (NO₂)", `${data.Luft} µg/m³`],
            ["Versiegelung", `${data.Versiegelung} %`],
            ["Schnellimbiss‑Anzahl", data.Imbisse],
            ["Rettungsdienst‑Anfahrt", formatResponseTime()],
          ].map(([label, value], i, arr) => (
            <CardRow
              key={label}
              label={label}
              value={value}
              accent={blue}
              isLast={i === arr.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CardRow({ label, value, accent, isLast }) {
  return (
    <div
      className="flex justify-between py-[3px]"
      style={{ borderBottom: isLast ? "none" : `1.5px solid ${accent}` }}
    >
      <span className="font-normal">{label}</span>
      <span className="font-bold" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}