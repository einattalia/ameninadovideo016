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
 const [embedStarted,setEmbedStarted]=useState(autoplay);
 const embed=embedUrl(src);
 if(embed&&poster&&!embedStarted&&!autoplay)return <button type="button" className="portfolio-embed-cover" onClick={()=>setEmbedStarted(true)} aria-label={'Reproduzir '+title}><img src={poster} alt=""/><span aria-hidden="true">▶</span></button>;
 if(embed)return <iframe className="portfolio-embed" src={autoplay?autoplayEmbedUrl(embed):embed} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>;
 if(failed)return <div className="video-failure"><p>Não foi possível reproduzir este vídeo.</p><a href={src} target="_blank" rel="noreferrer">Abrir o arquivo original</a></div>;
 return <video className="portfolio-video" controls playsInline preload={autoplay?'metadata':'none'} autoPlay={autoplay} muted={autoplay} loop={autoplay} poster={poster} src={src} onError={()=>setFailed(true)}>Seu navegador não suporta este vídeo.</video>
}
export function VideoPreview({src,title,poster}:{src:string;title:string;poster?:string}){
 const [ready,setReady]=useState(false);
 const embed=embedUrl(src);
 if(embed)return <div className="portfolio-video-preview-wrap">{poster&&!ready&&<img className="portfolio-preview-poster" src={poster} alt=""/>}<iframe className="portfolio-video-preview" src={autoplayEmbedUrl(embed)} title={title} allow="autoplay; fullscreen; picture-in-picture" aria-hidden="true" tabIndex={-1} referrerPolicy="strict-origin-when-cross-origin" onLoad={()=>setReady(true)}/></div>;
 return <video className="portfolio-video-preview" src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onLoadedData={()=>setReady(true)}/>;
}
