'use client';

import {useState,type FormEvent} from 'react';

type SubmissionState='idle'|'sending'|'sent'|'error';

export function FeedbackForm(){
 const [state,setState]=useState<SubmissionState>('idle');
 const [error,setError]=useState('');
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setState('sending');setError('');
  const form=event.currentTarget;
  const fields=new FormData(form);
  try{
   const response=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({client:fields.get('client'),quote:fields.get('quote'),consent:fields.get('consent')==='on',website:fields.get('website')})});
   const data=await response.json() as {error?:string};
   if(!response.ok)throw new Error(data.error||'Não foi possível enviar agora. Tente novamente.');
   form.reset();setState('sent');
  }catch(e){setError(e instanceof Error?e.message:'Não foi possível enviar agora. Tente novamente.');setState('error');}
 }
 if(state==='sent')return <div className="feedback-success" role="status"><span className="mono orange">RECEBIDO</span><h2>Obrigada por compartilhar.</h2><p>Seu feedback chegou e será revisado antes de aparecer no portfólio.</p></div>;
 return <form className="feedback-form" onSubmit={submit}>
  <label>Seu nome<input name="client" type="text" autoComplete="name" maxLength={150} required placeholder="Como podemos identificar você?"/></label>
  <label>Seu feedback<textarea name="quote" rows={6} maxLength={2000} minLength={10} required placeholder="Conte como foi sua experiência com a AMDV-016."/></label>
  <div className="feedback-honeypot" aria-hidden="true"><label>Deixe este campo em branco<input name="website" type="text" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="feedback-consent"><input name="consent" type="checkbox" required/><span>Autorizo o uso deste feedback no portfólio da AMDV-016. A publicação depende de revisão.</span></label>
  {error&&<p className="feedback-error" role="alert">{error}</p>}
  <button type="submit" disabled={state==='sending'}>{state==='sending'?'Enviando…':'Enviar feedback'}</button>
 </form>;
}
