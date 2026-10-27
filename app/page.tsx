import {ScrollMotion} from '@/components/scroll-motion';
import {Header,Hero,Works,About,Instagram,Contact,Footer,Cursor} from '@/components/portfolio';
import {SocialManagement} from '@/components/social-management';
import {PortfolioProvider} from '@/components/portfolio-context';
import {readContent} from '@/lib/cms-server';
import {publicContent} from '@/lib/cms-model';
export const dynamic='force-dynamic';
export default async function Page(){let content;try{content=publicContent((await readContent()).content);}catch(e){console.error('portfolio read',e);return <main className="unavailable"><h1>Voltamos em instantes.</h1><p>Não foi possível carregar o portfólio agora.</p><a href="/">Tentar novamente</a></main>;}return <PortfolioProvider content={content}><a className="skip" href="#trabalhos">Ir para trabalhos</a><Header/><main id="top"><Hero/><Works/><SocialManagement/><About/><Instagram/><Contact/></main><Footer/><Cursor/><ScrollMotion/></PortfolioProvider>}

