import {z} from 'zod';
import {submitClientFeedback} from '@/lib/cms-server';

export const dynamic='force-dynamic';
const inputSchema=z.object({
 client:z.string().trim().min(1,'Informe seu nome.').max(150),
 quote:z.string().trim().min(10,'Escreva pelo menos 10 caracteres.').max(2000,'O feedback é muito longo.'),
 consent:z.literal(true),
 website:z.string().max(200).optional()
});
const noStore={'Cache-Control':'no-store, private'};

export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(!origin||origin!==new URL(request.url).origin)return Response.json({error:'Origem não autorizada.'},{status:403,headers:noStore});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'Formato inválido.'},{status:415,headers:noStore});
 try{
  const body=await request.text();
  if(body.length>5000)return Response.json({error:'Conteúdo muito grande.'},{status:413,headers:noStore});
  const parsed=inputSchema.safeParse(JSON.parse(body));
  if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message||'Confira os campos e tente novamente.'},{status:400,headers:noStore});
  if(parsed.data.website)return Response.json({ok:true},{headers:noStore});
  const result=await submitClientFeedback(parsed.data.client,parsed.data.quote);
  if(result==='limit')return Response.json({error:'O formulário está temporariamente indisponível. Entre em contato pelo site.'},{status:409,headers:noStore});
  if(result==='conflict')return Response.json({error:'O conteúdo foi alterado agora. Envie novamente em alguns instantes.'},{status:409,headers:noStore});
  return Response.json({ok:true},{headers:noStore});
 }catch(e){
  console.error('feedback submission',e);
  return Response.json({error:'Não foi possível receber seu feedback agora. Tente novamente mais tarde.'},{status:503,headers:noStore});
 }
}
