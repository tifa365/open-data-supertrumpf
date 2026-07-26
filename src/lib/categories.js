// The 8 card categories: how to read, format, and compare them.
// higherWins: false marks categories where the lower value wins the trick
// (cleaner air, less sealing, faster ambulance).
const de = (v) => Number(v).toLocaleString('de-DE');

export const CATEGORIES = [
  {
    key: 'flaeche',
    label: 'Fläche',
    higherWins: true,
    get: (d) => parseFloat(d['Fläche']),
    format: (d) => `${de(d['Fläche'])} km²`,
  },
  {
    key: 'einwohner',
    label: 'Einwohner:innen',
    higherWins: true,
    get: (d) => parseInt(d.Einwohner),
    format: (d) => de(d.Einwohner),
  },
  {
    key: 'strassen',
    label: 'Straßen mit Frauennamen',
    higherWins: true,
    get: (d) => parseFloat(d['Straßen']),
    format: (d) => `${de(d['Straßen'])} %`,
  },
  {
    key: 'solar',
    label: 'Solarpotenzial',
    higherWins: true,
    get: (d) => parseFloat(d.Solar),
    format: (d) => `${de(d.Solar)} GWh/a`,
  },
  {
    key: 'luft',
    label: 'Luftqualität (NO₂)',
    higherWins: false,
    get: (d) => parseFloat(d.Luft),
    format: (d) => `${de(d.Luft)} µg/m³`,
  },
  {
    key: 'versiegelung',
    label: 'Versiegelung',
    higherWins: false,
    get: (d) => parseFloat(d.Versiegelung),
    format: (d) => `${de(d.Versiegelung)} %`,
  },
  {
    key: 'imbisse',
    label: 'Schnellimbiss-Anzahl',
    higherWins: true,
    get: (d) => parseInt(d.Imbisse),
    format: (d) => de(d.Imbisse),
  },
  {
    key: 'rettung',
    label: 'Rettungsdienst-Anfahrt',
    higherWins: false,
    get: (d) => parseInt(d.Min) * 60 + parseInt(d.Sek),
    format: (d) => `${d.Min} Min. ${d.Sek} Sek.`,
  },
];

// Round outcome for one category: 'player' | 'ai' | 'tie'
export function compareCards(cat, playerCard, aiCard) {
  const pv = cat.get(playerCard);
  const av = cat.get(aiCard);
  if (pv === av) return 'tie';
  return (pv > av) === cat.higherWins ? 'player' : 'ai';
}
