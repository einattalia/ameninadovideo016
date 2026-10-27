'use client';
import {useState} from 'react';
import {embedUrl} from '@/lib/cms-model';

function autoplayEmbedUrl(src:string){
 const url=new URL(src);
 url.searchParams.set('autoplay','1');
 url.searchParams.set('loop','1');
 if(url.hostname==='www.youtube-nocookie.com'){
  url.searchParams.set('mute','1');
  const videoId=url.pathname.split('/').filter(Boolean).pop();
  if(videoId)url.searchParams.set('playlist',videoId);
 }else{
  url.searchParams.set('muted','1');
 }
 return url.toString();
}

export function VideoPlayer({src,poster,title='Vídeo AMDV-016',autoplay=false}:{src:string;poster?:string;title?:string;autoplay?:boolean}){
 const [failed,setFailed]=useState(false);
 const embed=embedUrl(src);
 if(embed)return <iframe className="portfolio-embed" src={autoplay?autoplayEmbedUrl(embed):embed} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>;
 if(failed)return <div className="video-failure"><p>Não foi possível reproduzir este vídeo.</p><a href={src} target="_blank" rel="noreferrer">Abrir o arquivo original</a></div>;
 return <video className="portfolio-video" controls playsInline preload={autoplay?'metadata':'none'} autoPlay={autoplay} muted={autoplay} loop={autoplay} poster={poster} src={src} onError={()=>setFailed(true)}>Seu navegador não suporta este vídeo.</video>
}
export function VideoPreview({src,title}:{src:string;title:string}){const embed=embedUrl(src);if(embed)return <iframe className="portfolio-video-preview" src={autoplayEmbedUrl(embed)} title={title} allow="autoplay; fullscreen; picture-in-picture" aria-hidden="true" tabIndex={-1} referrerPolicy="strict-origin-when-cross-origin"/>;return <video className="portfolio-video-preview" src={src} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"/>}
