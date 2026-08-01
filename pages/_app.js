import { useEffect } from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  // Back button stays in the app: navigating within Supertrumpf already
  // builds correct history, but a sub-page opened from outside (deep
  // link, new tab, search result) would leave the site on "zurück".
  // For that case, slip the start page underneath the current history
  // entry once per tab, so back leads there instead.
  useEffect(() => {
    const home = `${router.basePath || ''}/`;
    if (window.location.pathname === home) return;
    if (document.referrer.startsWith(window.location.origin)) return;
    if (window.sessionStorage.getItem('odis-back-target')) return;
    window.sessionStorage.setItem('odis-back-target', '1');

    const pageState = window.history.state;
    const pageUrl = window.location.href;
    window.history.replaceState({ odisHome: true }, '', home);
    window.history.pushState(pageState, '', pageUrl);

    // Next's router ignores the injected entry's foreign state, so
    // load the start page ourselves when the user goes back to it
    const onPop = (e) => {
      if (e.state && e.state.odisHome) window.location.reload();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={barlow.className}>
      <Component {...pageProps} />
    </div>
  );
}
