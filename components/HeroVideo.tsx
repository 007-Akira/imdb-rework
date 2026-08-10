'use client';

import {useState} from 'react';

export default function HeroVideo({videoId='ZYzbalQ6Lg8'}:{videoId?:string}){
  const [ready,setReady]=useState(false);
  return <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
    <iframe
      onLoad={()=>setReady(true)}
      className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.12] transition-opacity duration-1000 ${ready?'opacity-75':'opacity-0'}`}
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&disablekb=1&modestbranding=1&enablejsapi=1`}
      title="Official movie trailer background"
      allow="autoplay; encrypted-media"
      tabIndex={-1}
    />
  </div>
}
