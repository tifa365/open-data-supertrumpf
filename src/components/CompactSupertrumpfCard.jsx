import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import useMapSvg from '@/hooks/useMapSvg';

export default function CompactSupertrumpfCard({ data, mapPath }) {
  const blue = "#002F6C";
  const yellow = "#F4E85A";
  const lightBlue = "#E6F2FF";
  const svgContent = useMapSvg(mapPath, { fill: '#4169E1', strokeWidth: '0.5' });

  if (!data) {
    return <div>Loading...</div>;
  }

  const formatResponseTime = () => {
    return `${data.Min} Min.`;
  };

  const formatNumber = (num) => {
    return parseInt(num).toLocaleString('de-DE');
  };

  return (
    <Card
      className="w-[200px] h-[300px] overflow-hidden bg-white cursor-pointer hover:shadow-xl transition-shadow"
      style={{
        borderRadius: "0.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: `2px solid ${blue}`,
      }}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* District Badge */}
        <div className="bg-white p-2 border-b-2" style={{ borderColor: blue }}>
          <div className="text-center">
            <span
              className="inline-block px-3 py-1 text-xs font-bold text-white rounded"
              style={{ backgroundColor: '#4169E1' }}
            >
              {data.Bezirk}
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="flex h-20 w-full items-center justify-center bg-gray-50 border-b-2" style={{ borderColor: blue }}>
          {svgContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="w-full h-full p-2"
            />
          ) : (
            <MapPin size={24} className="text-gray-400" />
          )}
        </div>

        {/* District name */}
        <div className="bg-blue-100 py-2 px-3 border-b-2" style={{ borderColor: blue }}>
          <h2 className="text-center text-sm font-bold" style={{ color: blue }}>
            {data.Ortsteil}
          </h2>
        </div>

        {/* Data rows */}
        <div className="flex-1 px-3 py-2 bg-white">
          <table className="w-full text-[11px]" style={{ color: blue }}>
            <tbody>
              <tr className="border-b">
                <td className="py-1">Fläche</td>
                <td className="text-right font-bold">{data.Fläche}km²</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Einwohner:innen</td>
                <td className="text-right font-bold">{formatNumber(data.Einwohner)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Straßen mit Frauennamen</td>
                <td className="text-right font-bold">{data.Straßen}%</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Solarpotenzial</td>
                <td className="text-right font-bold">{data.Solar} GWh/a</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Luftqualität (NO₂)</td>
                <td className="text-right font-bold">{data.Luft} µg/m³</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Versiegelung</td>
                <td className="text-right font-bold">{data.Versiegelung}%</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Schnellimbisse</td>
                <td className="text-right font-bold">{data.Imbisse}</td>
              </tr>
              <tr>
                <td className="py-1">Rettungsdienst-Anfahrt</td>
                <td className="text-right font-bold">{formatResponseTime()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}