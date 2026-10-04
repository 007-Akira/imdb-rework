import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import { SPLASH_STORAGE_KEY } from '@/lib/constants';
export const metadata = { title: { default: 'IMDb — Movies, TV & Celebrities', template: '%s — IMDb' }, description: 'An independent cinematic movie database UI redesign powered by TMDB.' };
// Runs before the page paints: on repeat visits in this tab, hide the splash so it never flashes.
const splashCheck = `try{if(sessionStorage.getItem(${JSON.stringify(SPLASH_STORAGE_KEY)}))document.documentElement.setAttribute('data-splash-seen','')}catch(e){}`;
// suppressHydrationWarning: the script above may add data-splash-seen to <html> before React hydrates.
export default function Layout({ children }) { return <html lang="en" suppressHydrationWarning><body className="font-sans antialiased"><SplashScreen /><noscript><style>{'.cl-splash{display:none}'}</style></noscript><Script id="splash-check" strategy="beforeInteractive">{splashCheck}</Script><Navbar />{children}<Footer /></body></html>; }
