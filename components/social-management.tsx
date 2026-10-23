'use client';

import {usePortfolio} from '@/components/portfolio-context';

const managementSteps = [
  {number:'01',title:'Planejamento',description:'Definimos os temas e objetivos da comunicação.'},
  {number:'02',title:'Organização',description:'Estruturamos o calendário e a rotina de conteúdo.'},
  {number:'03',title:'Postagens',description:'Cuidamos da publicação dos conteúdos nas redes.'},
  {number:'04',title:'Análise',description:'Acompanhamos os resultados durante a gestão.'},
];

export function SocialManagement(){
  const {settings}=usePortfolio();
  const clients=settings.socialClients.filter(client=>client.published);
  const testimonials=settings.socialTestimonials.filter(testimonial=>testimonial.published);
  const initials=settings.socialTeamName.split(/\s+/).filter(Boolean).slice(0,2).map(name=>name[0]).join('').toUpperCase();

  return <section id="gestao-redes" className="section social-management">
    <div className="section-meta mono"><span><i>03</i> / PRESENÇA DIGITAL</span><span>GESTÃO DE REDES SOCIAIS</span></div>
    <div className="heading-row social-management-heading">
      <h2>{settings.socialManagementTitle}<span className="orange">.</span></h2>
      <p className="preline">{settings.socialManagementDescription}</p>
    </div>
    <div className="management-steps">
      {managementSteps.map(step=><article className="management-step" key={step.number}>
        <span className="mono orange">{step.number}</span>
        <h3>{step.title}</h3>
        <p>{step.description}</p>
      </article>)}
    </div>
    <div className="management-people">
      <article className="management-team">
        <div className="management-card-label mono">QUEM FAZ ACONTECER</div>
        <div className="team-person">
          <span className="team-initials" aria-hidden="true">{initials||'BL'}</span>
          <div><h3>{settings.socialTeamName}</h3><p className="mono">{settings.socialTeamRole}</p></div>
        </div>
        <p className="team-description">{settings.socialTeamBio}</p>
      </article>
      <article className="management-clients">
        <div className="management-card-label mono">CLIENTES ATUAIS</div>
        <p className="management-client-intro">Marcas que confiam a presença nas redes à nossa equipe.</p>
        {clients.length?<ul className="management-client-list">{clients.map(client=><li key={client.id}>
          {client.url?<a href={client.url} target="_blank" rel="noreferrer">{client.name||client.handle||'Cliente'} <span aria-hidden="true">↗</span></a>:<span>{client.name||client.handle||'Cliente'}</span>}
          {client.handle&&<small className="mono">{client.handle}</small>}
        </li>)}</ul>:<p className="management-empty mono">NOVOS CLIENTES EM BREVE</p>}
      </article>
    </div>
    <div className="management-testimonials">
      <div className="management-testimonials-heading">
        <div className="management-card-label mono">FEEDBACKS</div>
        <h3>O que dizem sobre o trabalho.</h3>
      </div>
      {testimonials.length?<div className="testimonial-grid">{testimonials.map(testimonial=><figure className="testimonial-card" key={testimonial.id}>
        <span className="testimonial-mark" aria-hidden="true">“</span>
        <blockquote>{testimonial.quote}</blockquote>
        {testimonial.client&&<figcaption className="mono">{testimonial.client}</figcaption>}
      </figure>)}</div>:<p className="testimonial-empty">Um espaço para compartilhar as experiências de quem já trabalhou com a gente.</p>}
    </div>
    <a className="management-cta" href="#contato">VAMOS PLANEJAR SUA PRESENÇA DIGITAL <span aria-hidden="true">↗</span></a>
  </section>;
}


