import type {Metadata} from 'next';import './globals.css';import Navbar from '@/components/Navbar';import Footer from '@/components/Footer';
export const metadata:Metadata={title:{default:'IMDb — Movies, TV & Celebrities',template:'%s — IMDb'},description:'An independent cinematic movie database UI redesign powered by TMDB.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body className="font-sans antialiased"><Navbar/>{children}<Footer/></body></html>}
