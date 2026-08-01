import { useEffect, useRef } from 'react';

// Swipe navigation between pages. Attaches window touch listeners and
// calls the matching handler on a decisive gesture:
//   onLeft / onRight — horizontal swipe of ≥ 60px that is clearly more
//     horizontal than vertical, so vertical scrolling never triggers it
//   onPullDown — downward swipe of ≥ 90px that STARTED while the page
//     was scrolled to the very top; scrolling through the page can
//     therefore never fire it. Native pull-to-refresh is disabled via
//     overscroll-behavior in globals.css so the gesture reaches us.
export default function useSwipeNav(handlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const startRef = useRef(null);

  useEffect(() => {
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) {
        startRef.current = null;
        return;
      }
      const t = e.touches[0];
      startRef.current = { x: t.clientX, y: t.clientY, atTop: window.scrollY <= 0 };
    };

    const onTouchEnd = (e) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start || e.touches.length > 0) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const { onLeft, onRight, onPullDown } = handlersRef.current ?? {};
      if (Math.abs(dx) >= 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
        if (dx < 0) onLeft?.();
        else onRight?.();
      } else if (dy >= 90 && dy > 1.5 * Math.abs(dx) && start.atTop) {
        onPullDown?.();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}
