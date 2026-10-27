'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {Menu,Play} from 'lucide-react';
import {workCollections} from '@/lib/portfolio';
import {usePortfolio} from '@/components/portfolio-context';
import {VideoPlayer} from '@/components/video-player';

export function Header(){const {settings}=usePortfolio();const instagram=settings.instagram;const [open,setOpen]=useState(false);return <header><Link href="/" className="brand">AMDV<span>—</span>016<small>A MENINA DO VÍDEO</small></Link><nav aria-label="Navegação principal" className={open?'nav open':'nav'}>{[{label:settings.menuWorks,id:'trabalhos'},{label:settings.menuSocial,id:'gestao-redes'},{label:settings.menuAbout,id:'sobre'},{label:settings.menuContact,id:'contato'}].map(x=><a key={x.id} href={'/#'+x.id} onClick={()=>setOpen(false)}>{x.label}</a>)}</nav><div className="header-social"><a className="instagram-link" href={instagram} target="_blank" rel="noreferrer">{settings.instagramLabel}</a>{settings.whatsapp&&<a className="whatsapp-link" href={"https://wa.me/"+settings.whatsapp} target="_blank" rel="noreferrer">WHATSAPP</a>}</div><button className="menu" aria-label="Abrir navegação" aria-expanded={open} onClick={()=>setOpen(!open)}><Menu/></button></header>}

export function Cursor(){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const move=(e:MouseEvent)=>{if(!ref.current)return;ref.current.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;const el=(e.target as HTMLElement).closest('[data-cursor]');ref.current.dataset.visible=el?'true':'false';ref.current.innerText=el?.getAttribute('data-cursor')||''};window.addEventListener('mousemove',move,{passive:true});return()=>window.removeEventListener('mousemove',move)},[]);return <div ref={ref} className="cursor" aria-hidden="true"/>}

export function Hero(){const {settings}=usePortfolio();const reduced=useReducedMotion();return <section className="hero"><div className="hero-image"><img src={settings.heroImage||'/images/live.webp'} alt={settings.heroAlt} fetchPriority="high"/></div><div className="hero-top mono"><span>DIREÇÃO CRIATIVA & AUDIOVISUAL</span><span>{settings.location}</span></div><motion.div className="hero-title" initial={reduced?false:{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:1}}><div className="hero-label mono"><span className="orange">UM OLHAR. MUITAS HISTÓRIAS.</span><span>EST. 016</span></div><h1>AMDV<span className="dash">—</span>016<span className="registered">®</span></h1><div className="hero-bottom"><p className="signature">A MENINA<br/>DO VÍDEO 016</p><p className="hero-quote preline">{settings.heroQuote}</p></div></motion.div><div className="hero-foot mono"><a href="#trabalhos">EXPLORE AS SESSÕES <span className="scroll-line"/></a><span>A MENINA DO VÍDEO 016</span><span>01 / 03</span></div></section>}

export function Works(){
 const {projects,settings}=usePortfolio();
 const firstCollection=workCollections.find(collection=>projects.some(project=>project.tags.includes(collection)))||workCollections[0];
 const [collection,setCollection]=useState(firstCollection);
 const [selectedSlug,setSelectedSlug]=useState('');
 const collectionProjects=projects.filter(project=>project.tags.includes(collection));
 const activeProject=collectionProjects.find(project=>project.slug===selectedSlug)||collectionProjects[0];
 const activeVideo=activeProject?.video||activeProject?.videos.find(Boolean)||'';
 const activeIndex=activeProject?projects.findIndex(project=>project.slug===activeProject.slug)+1:0;

 function selectCollection(next:string){setCollection(next);setSelectedSlug('');}

 return <section id="trabalhos" className="section cinematic-portfolio">
  <div className="section-meta mono"><span><i>02</i> / FILMES EM CENA</span><span>UMA SELEÇÃO DE HISTÓRIAS</span></div>
  <div className="heading-row cinematic-heading"><div><p className="mono orange">SELEÇÃO AMDV-016</p><h2>TRÊS FORMAS<br/>DE CONTAR<span className="orange">.</span></h2></div><p>Escolha uma sessão.<br/>O próximo quadro é seu.</p></div>
  <div className="cinema-collections" aria-label="Escolha uma sessão">
   {workCollections.map((item,index)=>{
    const count=projects.filter(project=>project.tags.includes(item)).length;
    return <button key={item} type="button" aria-pressed={collection===item} className={'cinema-collection '+(collection===item?'is-active':'')} onClick={()=>selectCollection(item)}>
     <span className="mono">0{index+1}</span><span>{item}</span><span className="cinema-collection-count mono">{String(count).padStart(2,'0')} FILMES</span>
    </button>;
   })}
  </div>
  <div className="cinema-work-layout">
   <div className="cinema-feature">
    <div className="cinema-screen" key={activeProject?.slug||collection}>
     {activeProject?(activeVideo?<VideoPlayer src={activeVideo} poster={activeProject.image} title={activeProject.name} autoplay={activeProject.autoplayVideo}/>:<img src={activeProject.image} alt={activeProject.alt} loading="lazy"/>):<img src={settings.heroImage||'/images/live.webp'} alt={settings.heroAlt} loading="lazy"/>}
     {activeProject?<div className="cinema-screen-labels"><span className="mono">{collection} / {String(activeIndex).padStart(2,'0')}</span>{activeProject.clientInstagram?<a className="mono cinema-client-chip" href={activeProject.clientInstagram} target="_blank" rel="noreferrer" aria-label={'Instagram de '+activeProject.client}>{activeProject.demo?'ESTUDO VISUAL':activeProject.client||'AMDV-016'}</a>:<span className="mono">{activeProject.demo?'ESTUDO VISUAL':activeProject.client||'AMDV-016'}</span>}<Link className="cinema-project-open" href={'/projetos/'+activeProject.slug} aria-label={'Abrir o projeto '+activeProject.name} data-cursor="VER">ABRIR</Link></div>:<div className="cinema-empty"><span className="mono orange">SESSÃO EM CURADORIA</span><p>Os filmes desta sessão aparecem aqui quando você os marcar no painel.</p><Link href="/admin">ORGANIZAR PROJETOS </Link></div>}
    </div>
    {activeProject&&<div className="cinema-project-caption">
     <div className="cinema-project-title"><span className="mono orange">{activeProject.clientInstagram?<a className="cinema-client-link" href={activeProject.clientInstagram} target="_blank" rel="noreferrer" aria-label={'Instagram de '+activeProject.client}>{activeProject.client||'AMDV-016'}</a>:activeProject.client||'AMDV-016'} · {activeProject.year}</span><h3>{activeProject.name}</h3></div>
     <div className="cinema-project-copy">{activeProject.clientDescription&&<div className="client-work-summary"><span className="mono">O QUE FIZEMOS</span><p>{activeProject.clientDescription}</p></div>}<p>{activeProject.description}</p>{activeProject.credits&&<span className="mono">{activeProject.credits}</span>}{activeProject.clientWebsite&&<a className="client-website-link" href={activeProject.clientWebsite} target="_blank" rel="noreferrer">VISITAR SITE</a>}<Link href={'/projetos/'+activeProject.slug}>VER PROJETO </Link></div>
    </div>}
   </div>
   <aside className="cinema-index" aria-label={'Filmes da sessão '+collection}>
    <div className="cinema-index-heading"><span className="mono">SESSÃO / {collection}</span><span className="mono">{String(collectionProjects.length).padStart(2,'0')} FILMES</span></div>
    {collectionProjects.length?<ol className="cinema-project-list">{collectionProjects.map((project,index)=><li key={project.slug}>
     <button type="button" className={'cinema-project-button '+(activeProject?.slug===project.slug?'is-active':'')} aria-pressed={activeProject?.slug===project.slug} onClick={()=>setSelectedSlug(project.slug)}>
      <span className="mono cinema-project-number">{String(index+1).padStart(2,'0')}</span><span className="cinema-project-name">{project.name}<small>{project.demo?'ESTUDO VISUAL':project.clientInstagram?project.year:project.client||project.year}</small></span>
     </button>{project.clientInstagram&&<a className="cinema-index-client" href={project.clientInstagram} target="_blank" rel="noreferrer" aria-label={'Instagram de '+project.client}>{project.client||'INSTAGRAM'}</a>}
    </li>)}</ol>:<p className="cinema-index-empty">Esta sessão está sendo preparada. Adicione ou categorize um projeto pelo painel administrativo.</p>}
    <Link href="/admin" className="cinema-index-admin">ADICIONAR TRABALHO </Link>
   </aside>
  </div>
 </section>;
}

export function About(){const {settings}=usePortfolio();const lines=settings.aboutTitle.split('\n');return <section id="sobre" className="section about"><div className="section-meta mono"><span><i>04</i> / BEHIND THE CAMERA</span><span>A MENINA DO VÍDEO 016</span></div><div className="about-layout"><div className="about-image"><img loading="lazy" src={settings.aboutImage||settings.heroImage} alt={settings.aboutAlt}/><span className="mono">O OLHAR COMEÇA ANTES DA CÂMERA.</span></div><div className="about-copy"><p className="mono orange">SOBRE / AMDV-016</p><h2>{lines.map((line,i)=><span key={i}>{i===lines.length-1?<em>{line}</em>:line}{i<lines.length-1&&<br/>}</span>)}</h2>{settings.aboutText.split(/\n\s*\n/).map((text,i)=><p className="preline" key={i}>{text}</p>)}<span className="mono">DIREÇÃO · CAPTAÇÃO · EDIÇÃO</span></div></div><blockquote className="preline">{settings.positioning.split(/(REC)/).map((part,i)=>part==='REC'?<span className="orange" key={i}>REC</span>:part)}</blockquote></section>}
export function Instagram(){const {settings,projects}=usePortfolio();const posts=settings.socialItems.length?settings.socialItems:projects.slice(0,3).map(p=>({image:p.image,alt:p.alt,url:settings.instagram}));return <section className="section social"><div className="section-meta mono"><span><i>05</i> / FORA DO ENQUADRAMENTO</span><a href={settings.instagram} target="_blank" rel="noreferrer">{settings.instagramLabel} </a></div><h2>CONTINUAMOS<br/>POR AQUI<span className="orange">.</span></h2><div className="social-images">{posts.map((p,i)=><a key={i} href={p.url||settings.instagram} target="_blank" rel="noreferrer" aria-label="Ver conteúdo no Instagram" data-cursor="VER"><img loading="lazy" src={p.image} alt={p.alt}/><span className="mono">BASTIDORES / INSPIRAÇÃO</span></a>)}</div>{!settings.socialItems.length&&<p className="mono">ACOMPANHE OS CONTEÚDOS NO INSTAGRAM</p>}</section>}
export function Contact(){const {settings}=usePortfolio();const primary=settings.whatsapp?'https://wa.me/'+settings.whatsapp:settings.email?'mailto:'+settings.email:settings.instagram;const lines=settings.contactTitle.split('\n');return <section id="contato" className="section contact"><div className="section-meta mono"><span><i>06</i> / A PRÓXIMA HISTÓRIA</span><span>COMEÇA COM UMA CONVERSA</span></div><h2>{lines.map((line,i)=><span key={i} className="contact-line">{i===lines.length-1?<em>{line}</em>:line}{i<lines.length-1&&<br/>}</span>)}<span className="orange">*</span></h2><div className="contact-bottom"><p className="preline">{settings.contactText}</p>{primary&&<a className="contact-button" href={primary} target="_blank" rel="noreferrer">VAMOS CONVERSAR</a>}</div><div className="contact-links mono">{settings.instagram&&<a href={settings.instagram} target="_blank" rel="noreferrer">INSTAGRAM</a>}{settings.whatsapp&&<a href={'https://wa.me/'+settings.whatsapp} target="_blank" rel="noreferrer">WHATSAPP</a>}{settings.email&&<a href={'mailto:'+settings.email}>E-MAIL</a>}</div></section>}
export function Footer(){const {settings}=usePortfolio();return <footer><Link href="/" className="brand">AMDV<span>—</span>016</Link><span className="mono">A MENINA DO VÍDEO 016<br/>{settings.location}</span><span className="mono">© 2026 AMDV-016</span><div className="footer-actions"><a href="#top" className="mono">VOLTAR AO TOPO ↑</a><a href="/admin" className="mono">ADMIN</a></div></footer>}
export function ProjectVideo({video,poster,demo=false,autoplay=false}:{video:string;poster:string;demo?:boolean;autoplay?:boolean}){if(!video&&!demo)return <img className="project-video" src={poster} alt="Imagem do projeto"/>;return video?<VideoPlayer src={video} poster={poster} autoplay={autoplay}/>:<div className="project-pending"><img src={poster} alt="Imagem demonstrativa do projeto"/><div><Play/><p className="mono">VÍDEO AUTORAL EM CURADORIA</p><p>Este estudo apresenta a direção visual.<br/>O filme do projeto será incluído aqui.</p></div></div>}

