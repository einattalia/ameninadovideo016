import { z } from 'zod';
import { projects as originalProjects, categories } from './portfolio';
const text = (max = 300) => z.string().trim().max(max);
export const mediaUrl = z.string().trim().max(2000).refine(v => !v || /^\/(?:images|media)\/[a-zA-Z0-9_.\/-]+$/.test(v) || (() => {try {const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}})(), 'Use um arquivo enviado ou um link HTTPS válido.');
export const projectSchema = z.object({
 id:text(100).min(1), slug:text(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use letras minúsculas e hífens no endereço.'),
 name:text(100).min(1,'Informe o nome do projeto.'), client:text(150), category:z.enum(categories as [string,...string[]]), tags:z.array(z.enum(categories as [string,...string[]])).max(8), year:text(4).regex(/^\d{4}$/),
 image:mediaUrl, alt:text(300), description:text(3000), video:mediaUrl, gallery:z.array(z.object({url:mediaUrl.refine(v=>!!v,'Adicione a imagem ou retire este item da galeria.'),alt:text(300)})).max(20), details:text(4000), credits:text(1000), demo:z.boolean(),published:z.boolean()
}).superRefine((p,c)=>{if(p.published&&!p.image)c.addIssue({code:'custom',path:['image'],message:'Adicione uma capa antes de publicar o projeto.'});});
export const settingsSchema = z.object({
 heroImage:mediaUrl, heroAlt:text(), heroQuote:text(500), heroDemo:z.boolean(), showreelPoster:mediaUrl, showreelVideo:mediaUrl, showreelCaption:text(200),
 aboutImage:mediaUrl, aboutAlt:text(), aboutTitle:text(150), aboutText:text(5000), positioning:text(300),
 contactTitle:text(150), contactText:text(1000), instagram:mediaUrl, instagramLabel:text(50), whatsapp:z.string().trim().regex(/^$|^[0-9]{10,15}$/, 'WhatsApp: informe DDI e DDD, apenas números.'), email:z.union([z.literal(''),z.string().email('Informe um e-mail válido.')]), location:text(150),
 menuWorks:text(60).min(1),menuAbout:text(60).min(1),menuContact:text(60).min(1),
 clients:z.array(text(150).min(1)).max(40), socialItems:z.array(z.object({image:mediaUrl.refine(v=>!!v,'Adicione uma imagem à publicação.'),url:mediaUrl,alt:text(300)})).max(6)
});
export const contentSchema = z.object({settings:settingsSchema,projects:z.array(projectSchema).max(100)}).superRefine((d,c)=>{const slugs=new Set<string>();const ids=new Set<string>();d.projects.forEach((p,i)=>{if(slugs.has(p.slug))c.addIssue({code:'custom',path:['projects',i,'slug'],message:'Este endereço já está em uso em outro projeto.'});if(ids.has(p.id))c.addIssue({code:'custom',path:['projects',i,'id'],message:'Projeto duplicado.'});slugs.add(p.slug);ids.add(p.id);});});
export type Project = z.infer<typeof projectSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type PortfolioContent = z.infer<typeof contentSchema>;
export type ContentSnapshot = {content:PortfolioContent;revision:number;updatedAt:string|null};
export const defaultContent:PortfolioContent = {
 projects:originalProjects.map(p=>({...p,id:p.slug,published:true,gallery:[],details:'Uma proposta de linguagem visual: luz, textura e ritmo como parte da narrativa.',credits:'DIREÇÃO CRIATIVA / CAPTAÇÃO / MONTAGEM'})),
 settings:{heroImage:'/images/live.webp',heroAlt:'Luzes de palco sobre uma multidão, imagem demonstrativa',heroQuote:'Eu transformo momentos\nem histórias que merecem\nser vistas.',heroDemo:true,showreelPoster:'/images/bar.webp',showreelVideo:'',showreelCaption:'O que fica quando\no momento passa.',aboutImage:'/images/camera.webp',aboutAlt:'Câmera de cinema em detalhe, imagem demonstrativa de bastidores',aboutTitle:'EU GOSTO\nDO QUE\nÉ REAL.',aboutText:'Um gesto que quase passa despercebido. A energia de uma sala cheia. O silêncio antes de alguma coisa acontecer.\n\nÉ desse lugar que vem o meu olhar. Gosto de chegar perto, entender o que move cada história e encontrar um jeito de fazer você sentir também.\n\nA AMDV-016 é esse encontro entre presença e intenção. Da primeira ideia ao último corte, criar imagens que tenham algo a dizer.',positioning:'Meu trabalho começa\nantes do REC.',contactTitle:'TEM UMA\nHISTÓRIA?',contactText:'Uma ideia, um evento, uma marca.\nOu uma história que precisa ganhar movimento.\nVamos encontrar o jeito de contar.',instagram:'https://www.instagram.com/amdv016/',instagramLabel:'@AMDV016',whatsapp:'',email:'',location:'SÃO CARLOS / SP — BRASIL',menuWorks:'MEU OLHAR',menuAbout:'POR TRÁS DA CÂMERA',menuContact:'VAMOS CRIAR',clients:[],socialItems:[]}
};
export function publicContent(content:PortfolioContent):PortfolioContent{return {...content,projects:content.projects.filter(p=>p.published)};}
export function embedUrl(value:string):string|null {try{const u=new URL(value);if(['www.youtube.com','youtube.com','m.youtube.com','youtu.be'].includes(u.hostname)){const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop();return id&&/^[\w-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}?rel=0`:null;}if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(u.hostname)){const id=u.pathname.split('/').filter(Boolean).find(s=>/^\d+$/.test(s));const hash=u.searchParams.get('h')||u.pathname.split('/').filter(Boolean)[1];return id?`https://player.vimeo.com/video/${id}${hash&&/^[a-f0-9]{6,20}$/.test(hash)?'?h='+hash:''}`:null;}}catch{}return null;}
