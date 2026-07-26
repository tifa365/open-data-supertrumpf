import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import useMapSvg from '@/hooks/useMapSvg';

export default function MiniSupertrumpfCard({ data, mapPath }) {
  const blue = "#002F6C";
  const yellow = "#F4E85A";
  const svgContent = useMapSvg(mapPath, { fill: blue, strokeWidth: '0.5' });

  if (!data) {
    return <div>Loading...</div>;
  }

  const formatNumber = (num) => {
    const n = parseInt(num);
    return n >= 1000 ? `${Math.round(n/1000)}k` : n.toString();
  };

  return (
    <Card
      className="w-[140px] h-[220px] overflow-hidden bg-white cursor-pointer hover:z-10 hover:scale-110 transition-all duration-200"
      style={{
        borderRadius: "0.375rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        border: `1px solid ${blue}`,
      }}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Bezirk Badge */}
        <div className="bg-white px-2 py-1">
          <div className="text-center">
            <span
              className="text-[9px] font-bold"
              style={{ color: blue }}
            >
              {data.Bezirk}
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="flex h-12 w-full items-center justify-center bg-gray-50">
          {svgContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="w-full h-full p-1"
            />
          ) : (
            <MapPin size={16} className="text-gray-400" />
          )}
        </div>

        {/* Ortsteil name */}
        <div className="bg-blue-100 py-1 px-2">
          <h2 className="text-center text-[10px] font-bold truncate" style={{ color: blue }}>
            {data.Ortsteil}
          </h2>
        </div>

        {/* Data rows */}
        <div className="flex-1 px-2 py-1 bg-white">
          <div className="text-[8px]" style={{ color: blue }}>
            <div className="flex justify-between py-[1px]">
              <span>Fläche</span>
              <span className="font-bold">{data.Fläche}km²</span>
            </div>
            <div className="flex justify-between py-[1px]">
              <span>Einwohner</span>
              <span className="font-bold">{formatNumber(data.Einwohner)}</span>
            </div>
            <div className="flex justify-between py-[1px]">
              <span>Frauen%</span>
              <span className="font-bold">{data.Straßen}%</span>
            </div>
            <div className="flex justify-between py-[1px]">
              <span>Solar</span>
              <span className="font-bold">{data.Solar}GWh</span>
            </div>
            <div className="flex justify-between py-[1px]">
              <span>NO₂</span>
              <span className="font-bold">{data.Luft}</span>
            </div>
            <div className="flex justify-between py-[1px]">
              <span>Versieg.</span>
              <span className="font-bold">{data.Versiegelung}%</span>
            </div>
            <div className="flex justify-between py-[1px]">
              <span>Imbisse</span>
              <span className="font-bold">{data.Imbisse}</span>
            </div>
            <div className="flex justify-between py-[1px]">
              <span>Rettung</span>
              <span className="font-bold">{data.Min}:{data.Sek}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}