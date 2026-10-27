'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {Menu,Play} from 'lucide-react';
import {workCollections} from '@/lib/portfolio';
import {usePortfolio} from '@/components/portfolio-context';
import {VideoPlayer} from '@/components/video-player';

export function Header(){const {settings}=usePortfolio();const instagram=settings.instagram;const [open,setOpen]=useState(false);return <header><Link href="/" className="brand" aria-label="AMDV-016 — A Menina do Vídeo"><img className="brand-logo" src="/images/amdv-016-claro.png" alt="" /><small>A MENINA DO VÍDEO</small></Link><nav aria-label="Navegação principal" className={open?'nav open':'nav'}>{[{label:settings.menuWorks,id:'trabalhos'},{label:settings.menuSocial,id:'gestao-redes'},{label:settings.menuAbout,id:'sobre'},{label:settings.menuContact,id:'contato'}].map(x=><a key={x.id} href={'/#'+x.id} onClick={()=>setOpen(false)}>{x.label}</a>)}</nav><div className="header-social"><a className="instagram-link" href={instagram} target="_blank" rel="noreferrer">{settings.instagramLabel}</a>{settings.whatsapp&&<a className="whatsapp-link" href={"https://wa.me/"+settings.whatsapp} target="_blank" rel="noreferrer">WHATSAPP</a>}</div><button className="menu" aria-label="Abrir navegação" aria-expanded={open} onClick={()=>setOpen(!open)}><Menu/></button></header>}

export function Cursor(){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const move=(e:MouseEvent)=>{if(!ref.current)return;ref.current.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;const el=(e.target as HTMLElement).closest('[data-cursor]');ref.current.dataset.visible=el?'true':'false';ref.current.innerText=el?.getAttribute('data-cursor')||''};window.addEventListener('mousemove',move,{passive:true});return()=>window.removeEventListener('mousemove',move)},[]);return <div ref={ref} className="cursor" aria-hidden="true"/>}

export function Hero(){const {settings}=usePortfolio();const reduced=useReducedMotion();return <section className="hero"><div className="hero-image"><img src={settings.heroImage||'/images/live.webp'} alt={settings.heroAlt} fetchPriority="high"/></div><div className="hero-top mono"><span>DIREÇÃO CRIATIVA & AUDIOVISUAL</span><span>{settings.location}</span></div><motion.div className="hero-title" initial={reduced?false:{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:1}}><div className="hero-label mono"><span className="orange">UM OLHAR.<br/>MUITAS HISTÓRIAS.</span><span>EST. 016</span></div><motion.h1 className="hero-logo-heading" aria-label="AMDV-016" initial={reduced?false:{opacity:0,scale:.94,filter:"blur(8px)"}} animate={{opacity:1,scale:1,filter:"blur(0px)"}} transition={{duration:1.25,delay:.18,ease:[.22,1,.36,1]}}><img src="/images/amdv-016-claro.png" alt="AMDV-016" fetchPriority="high" /></motion.h1><div className="hero-bottom"><p className="signature">A MENINA DO VÍDEO 016</p><p className="hero-quote">{settings.heroQuote.replace(/\n/g, " ")}</p></div></motion.div><div className="hero-foot mono"><a href="#trabalhos">EXPLORE AS SESSÕES <span className="scroll-line"/></a><span>A MENINA DO VÍDEO 016</span><span>01 / 03</span></div></section>}

export function Works(){
 const {projects}=usePortfolio();
 const featuredCount=(item:string)=>projects.filter(project=>project.tags.includes(item)).reduce((total,project)=>{
  const available=[project.video,...project.videos].filter(Boolean);
  return total+project.featuredVideos.filter(video=>available.includes(video)).length;
 },0);
 const firstCollection=workCollections.find(item=>featuredCount(item)>0)||workCollections[0];
 const [collection,setCollection]=useState(firstCollection);
 const [selectedVideoKey,setSelectedVideoKey]=useState('');
 const collectionProjects=projects.filter(project=>project.tags.includes(collection));
 const entries=collectionProjects.flatMap(project=>[project.video,...project.videos].flatMap((video,index)=>video&&project.featuredVideos.includes(video)?[{key:project.slug+':'+index,project,video,index}]:[]));
 const activeEntry=entries.find(entry=>entry.key===selectedVideoKey)||entries[0];
 const activeProject=activeEntry?.project;
 const activeVideo=activeEntry?.video||'';
 const activeIndex=activeEntry?entries.findIndex(entry=>entry.key===activeEntry.key)+1:0;
 const independentEvent=Boolean(activeProject&&(activeProject.category==='EVENTOS'||activeProject.tags.includes('EVENTOS')));
 function selectCollection(next:string){setCollection(next);setSelectedVideoKey('');}

 return <section id="trabalhos" className="section cinematic-portfolio">
  <div className="section-meta mono"><span><i>02</i> / FILMES EM CENA</span><span>UMA SELEÇÃO DE HISTÓRIAS</span></div>
  <div className="heading-row cinematic-heading"><div><p className="mono orange">SELEÇÃO AMDV-016</p><h2>TRÊS FORMAS<br/>DE CONTAR<span className="orange">.</span></h2></div><p>Escolha uma sessão.<br/>O próximo quadro é seu.</p></div>
  <div className="cinema-collections" aria-label="Escolha uma sessão">
   {workCollections.map((item,index)=>{
    const count=featuredCount(item);
    return <button key={item} type="button" aria-pressed={collection===item} className={'cinema-collection '+(collection===item?'is-active':'')} onClick={()=>selectCollection(item)}>
     <span className="mono">0{index+1}</span><span>{item}</span><span className="cinema-collection-count mono">{String(count).padStart(2,'0')} VÍDEOS</span>
    </button>;
   })}
  </div>
  <div className="cinema-work-layout">
   <div className="cinema-feature">
    <div className="cinema-screen" key={activeEntry?.key||collection}>
     {activeEntry?<VideoPlayer src={activeVideo} title={activeProject?.name||'Vídeo AMDV-016'} autoplay={Boolean(activeProject?.autoplayVideo)}/>:<div className="cinema-empty"><span className="mono orange">ESCOLHA OS VÍDEOS DE DESTAQUE</span><p>Marque no painel os vídeos que quer exibir na página principal.</p><Link href="/admin">ORGANIZAR PROJETOS</Link></div>}
     {activeEntry&&activeProject&&<div className="cinema-screen-labels"><span className="mono">{collection} / {String(activeIndex).padStart(2,'0')}</span>{!independentEvent&&(activeProject.clientInstagram?<a className="mono cinema-client-chip" href={activeProject.clientInstagram} target="_blank" rel="noreferrer" aria-label={'Instagram de '+activeProject.client}>{activeProject.demo?'ESTUDO VISUAL':activeProject.client||'AMDV-016'}</a>:<span className="mono">{activeProject.demo?'ESTUDO VISUAL':activeProject.client||'AMDV-016'}</span>)}<Link className="cinema-project-open" href={'/projetos/'+activeProject.slug} aria-label={'Abrir o projeto '+activeProject.name} data-cursor="VER">ABRIR</Link></div>}
    </div>
    {activeEntry&&activeProject&&<div className="cinema-project-caption">
     <div className="cinema-project-title"><span className="mono orange">{!independentEvent&&<>{activeProject.clientInstagram?<a className="cinema-client-link" href={activeProject.clientInstagram} target="_blank" rel="noreferrer" aria-label={'Instagram de '+activeProject.client}>{activeProject.client||'AMDV-016'}</a>:activeProject.client||'AMDV-016'} · </>}{activeProject.year}</span><h3>{activeProject.name}</h3></div>
     <div className="cinema-project-copy">{activeProject.clientDescription&&<div className="client-work-summary"><span className="mono">{independentEvent?'O QUE FOI FEITO':'O QUE FIZEMOS'}</span><p>{activeProject.clientDescription}</p></div>}<p>{activeProject.description}</p>{activeProject.credits&&<span className="mono">{activeProject.credits}</span>}{!independentEvent&&activeProject.clientWebsite&&<a className="client-website-link" href={activeProject.clientWebsite} target="_blank" rel="noreferrer">VISITAR SITE</a>}<Link href={'/projetos/'+activeProject.slug}>VER PROJETO </Link></div>
    </div>}
   </div>
   <aside className="cinema-index" aria-label={'Vídeos em destaque da sessão '+collection}>
    <div className="cinema-index-heading"><span className="mono">SESSÃO / {collection}</span><span className="mono">{String(entries.length).padStart(2,'0')} VÍDEOS</span></div>
    {entries.length?<ol className="cinema-project-list">{entries.map((entry,index)=>{
     const eventEntry=entry.project.category==='EVENTOS'||entry.project.tags.includes('EVENTOS');
     const videoLabel=entry.index===0?'VÍDEO PRINCIPAL':'VÍDEO '+String(entry.index+1).padStart(2,'0');
     return <li key={entry.key}>
      <button type="button" className={'cinema-project-button '+(activeEntry?.key===entry.key?'is-active':'')} aria-pressed={activeEntry?.key===entry.key} onClick={()=>setSelectedVideoKey(entry.key)}>
       <span className="mono cinema-project-number">{String(index+1).padStart(2,'0')}</span><span className="cinema-project-name">{entry.project.name}<small>{videoLabel} · {entry.project.year}</small></span>
      </button>{!eventEntry&&entry.project.clientInstagram&&<a className="cinema-index-client" href={entry.project.clientInstagram} target="_blank" rel="noreferrer" aria-label={'Instagram de '+entry.project.client}>{entry.project.client||'INSTAGRAM'}</a>}
     </li>;
    })}</ol>:<p className="cinema-index-empty">Nenhum vídeo está marcado para destaque nesta sessão. Escolha os vídeos pelo painel.</p>}
    <Link href="/admin" className="cinema-index-admin">ADICIONAR TRABALHO </Link>
   </aside>
  </div>
 </section>;
}

export function About(){const {settings}=usePortfolio();const lines=settings.aboutTitle.split('\n');return <section id="sobre" className="section about"><div className="section-meta mono"><span><i>04</i> / BEHIND THE CAMERA</span><span>A MENINA DO VÍDEO 016</span></div><div className="about-layout"><div className="about-image"><img loading="lazy" src={settings.aboutImage||settings.heroImage} alt={settings.aboutAlt}/><span className="mono">O OLHAR COMEÇA ANTES DA CÂMERA.</span></div><div className="about-copy"><p className="mono orange">SOBRE / AMDV-016</p><h2>{lines.map((line,i)=><span key={i}>{i===lines.length-1?<em>{line}</em>:line}{i<lines.length-1&&<br/>}</span>)}</h2>{settings.aboutText.split(/\n\s*\n/).map((text,i)=><p className="preline" key={i}>{text}</p>)}<span className="mono">DIREÇÃO · CAPTAÇÃO · EDIÇÃO</span></div></div><blockquote className="preline">{settings.positioning.split(/(REC)/).map((part,i)=>part==='REC'?<span className="orange" key={i}>REC</span>:part)}</blockquote></section>}
export function Instagram(){const {settings,projects}=usePortfolio();const posts=settings.socialItems.length?settings.socialItems:projects.slice(0,3).map(p=>({image:p.image,alt:p.alt,url:settings.instagram}));return <section className="section social"><div className="section-meta mono"><span><i>05</i> / FORA DO ENQUADRAMENTO</span><a href={settings.instagram} target="_blank" rel="noreferrer">{settings.instagramLabel} </a></div><h2>CONTINUAMOS<br/>POR AQUI<span className="orange">.</span></h2><div className="social-images">{posts.map((p,i)=><a key={i} href={p.url||settings.instagram} target="_blank" rel="noreferrer" aria-label="Ver conteúdo no Instagram" data-cursor="VER"><img loading="lazy" src={p.image} alt={p.alt}/><span className="mono">BASTIDORES / INSPIRAÇÃO</span></a>)}</div>{!settings.socialItems.length&&<p className="mono">ACOMPANHE OS CONTEÚDOS NO INSTAGRAM</p>}</section>}
export function Contact(){const {settings}=usePortfolio();const primary=settings.whatsapp?'https://wa.me/'+settings.whatsapp:settings.email?'mailto:'+settings.email:settings.instagram;const lines=settings.contactTitle.split('\n');return <section id="contato" className="section contact"><div className="section-meta mono"><span><i>06</i> / A PRÓXIMA HISTÓRIA</span><span>COMEÇA COM UMA CONVERSA</span></div><h2>{lines.map((line,i)=><span key={i} className="contact-line">{i===lines.length-1?<em>{line}</em>:line}{i<lines.length-1&&<br/>}</span>)}<span className="orange">*</span></h2><div className="contact-bottom"><p className="preline">{settings.contactText}</p>{primary&&<a className="contact-button" href={primary} target="_blank" rel="noreferrer">VAMOS CONVERSAR</a>}</div><div className="contact-links mono">{settings.instagram&&<a href={settings.instagram} target="_blank" rel="noreferrer">INSTAGRAM</a>}{settings.whatsapp&&<a href={'https://wa.me/'+settings.whatsapp} target="_blank" rel="noreferrer">WHATSAPP</a>}{settings.email&&<a href={'mailto:'+settings.email}>E-MAIL</a>}</div></section>}
export function Footer(){const {settings}=usePortfolio();return <footer><Link href="/" className="brand footer-brand" aria-label="AMDV-016 — A Menina do Vídeo"><img className="brand-logo" src="/images/amdv-016-claro.png" alt="" /><small>A MENINA DO VÍDEO</small></Link><span className="mono">A MENINA DO VÍDEO 016<br/>{settings.location}</span><span className="mono">© 2026 AMDV-016</span><div className="footer-actions"><a href="#top" className="mono">VOLTAR AO TOPO ↑</a><a href="/admin" className="mono">ADMIN</a></div></footer>}
export function ProjectVideo({video,demo=false,autoplay=false}:{video:string;demo?:boolean;autoplay?:boolean}){return video?<VideoPlayer src={video} autoplay={autoplay}/>:<div className="project-pending project-video-placeholder"><div><Play/><p className="mono">{demo?'VÍDEO EM CURADORIA':'VÍDEO AINDA NÃO ADICIONADO'}</p><p>{demo?'O filme deste estudo será incluído aqui.':'Este projeto ainda não tem um vídeo principal.'}</p></div></div>}

