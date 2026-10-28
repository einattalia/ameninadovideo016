import Link from 'next/link';
import {FeedbackForm} from '@/components/feedback-form';

export const metadata={title:'Compartilhe sua experiência — AMDV-016',robots:{index:false,follow:false}};

export default function FeedbackPage(){
 return <main className="feedback-page">
  <div className="feedback-brand"><Link href="/" className="brand" aria-label="AMDV-016 — A Menina do Vídeo"><span>AMDV<span>—</span>016</span><small>A MENINA DO VÍDEO</small></Link></div>
  <section className="feedback-card">
   <p className="mono orange">AMDV-016 / SUA EXPERIÊNCIA</p>
   <h1>O que você achou<br/><em>do nosso trabalho?</em></h1>
   <p className="feedback-intro">Seu depoimento ajuda outras pessoas a conhecerem nosso trabalho. Ele só será publicado no portfólio depois de uma revisão.</p>
   <FeedbackForm/>
  </section>
  <Link className="feedback-back mono" href="/">VOLTAR AO PORTFÓLIO</Link>
 </main>;
}
