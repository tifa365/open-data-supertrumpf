import '@/styles/globals.css';
import localFont from 'next/font/local';

// Barlow (SIL OFL) — free stand-in for FF Clan, the ODIS brand typeface
const barlow = localFont({
  src: [
    { path: '../src/fonts/barlow-400.woff2', weight: '400', style: 'normal' },
    { path: '../src/fonts/barlow-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../src/fonts/barlow-700.woff2', weight: '700', style: 'normal' },
    { path: '../src/fonts/barlow-700-italic.woff2', weight: '700', style: 'italic' },
    { path: '../src/fonts/barlow-800.woff2', weight: '800', style: 'normal' },
  ],
  fallback: ['-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export default function App({ Component, pageProps }) {
  return (
    <div className={barlow.className}>
      <Component {...pageProps} />
    </div>
  );
}
