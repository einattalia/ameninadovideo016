import {ScrollMotion} from '@/components/scroll-motion';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Header,Footer} from '@/components/portfolio';
import {PortfolioProvider} from '@/components/portfolio-context';
import {readContent} from '@/lib/cms-server';
import {publicContent} from '@/lib/cms-model';
import {VideoPlayer} from '@/components/video-player';
import {cache} from 'react';

export const dynamic='force-dynamic';
const load=cache(async()=>publicContent((await readContent()).content));
const categoryNames:Record<string,string>={musica:'MÚSICA',eventos:'EVENTOS',divulgacao:'DIVULGAÇÃO'};

export async function generateMetadata({params}:{params:Promise<{categoria:string}>}){
 const {categoria}=await params;
 const category=categoryNames[categoria];
 return {title:category?category+' — AMDV-016':'Sessão — AMDV-016',description:category?'Projetos de '+category.toLowerCase()+' da AMDV-016.':'Portfólio audiovisual AMDV-016.'};
}

export default async function CategoryPage({params}:{params:Promise<{categoria:string}>}){
 const {categoria}=await params;
 const category=categoryNames[categoria];
 if(!category)notFound();
 let content;
 try{content=await load();}catch{return <main className="unavailable"><h1>Voltamos em instantes.</h1><a href={'/trabalhos/'+categoria}>Tentar novamente</a></main>;}
 const projects=content.projects.filter(project=>project.tags.includes(category));
 return <PortfolioProvider content={content}><Header/><main id="top" className="section portfolio-category-page">
  <Link className="mono orange" href="/#trabalhos">VOLTAR ÀS SESSÕES</Link>
  <div className="portfolio-category-intro"><p className="mono orange">PASTA / AMDV-016</p><h1>{category}<span className="orange">.</span></h1><p>Uma seleção de projetos em {category.toLowerCase()}.</p></div>
  {projects.length?<div className="portfolio-category-projects">{projects.map(project=>{
   const videos=[project.video,...project.videos].filter(Boolean);
   return <article className="portfolio-category-project" key={project.id}>
    <div className="portfolio-category-project-heading"><div><span className="mono orange">{project.year} / {project.category}</span><h2>{project.name}</h2></div><p className="preline">{project.description}</p></div>
    {videos.length?<div className="portfolio-category-videos">{videos.map((video,index)=><VideoPlayer key={index} src={video} title={project.name+' — vídeo '+(index+1)}/>)}</div>:<div className="project-video-placeholder mono">VÍDEO EM CURADORIA</div>}
   </article>;
  })}</div>:<p className="portfolio-category-empty">Ainda não há projetos nesta sessão.</p>}
 </main><Footer/><ScrollMotion/></PortfolioProvider>;
}
