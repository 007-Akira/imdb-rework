'use client';
import { useEffect, useState } from 'react';
import CinemaLoader from './CinemaLoader';
import { SPLASH_STORAGE_KEY } from '@/lib/constants';
const MIN_VISIBLE_MS = 1800;
const EXIT_MS = 700;
const markSeen = () => { try {
    sessionStorage.setItem(SPLASH_STORAGE_KEY, '1');
}
catch { } };
const hasSeen = () => { try {
    return !!sessionStorage.getItem(SPLASH_STORAGE_KEY);
}
catch {
    return false;
} };
// Full-screen intro on the first visit in each browser tab. Repeat visits are hidden before paint by the
// inline script in app/layout.jsx (html[data-splash-seen] .cl-splash { display: none }).
export default function SplashScreen() {
    const [phase, setPhase] = useState('visible');
    useEffect(() => {
        // Repeat visit: the pre-paint script already hid the splash with CSS, so there is nothing to play.
        if (hasSeen())
            return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const unlock = () => { document.body.style.overflow = previousOverflow; };
        let cancelled = false;
        let exitTimer;
        const minimum = new Promise(resolve => setTimeout(resolve, MIN_VISIBLE_MS));
        const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
        Promise.all([minimum, loaded]).then(() => {
            if (cancelled)
                return;
            // Marked only once the intro has played, so a reload mid-splash shows it again.
            markSeen();
            setPhase('exiting');
            unlock();
            exitTimer = setTimeout(() => setPhase('done'), EXIT_MS);
        });
        return () => { cancelled = true; clearTimeout(exitTimer); unlock(); };
    }, []);
    if (phase === 'done')
        return null;
    return <div className="cl-splash"><CinemaLoader variant="overlay" exiting={phase === 'exiting'}/></div>;
}
