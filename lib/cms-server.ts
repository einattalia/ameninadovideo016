import 'server-only';
import {defaultContent,contentSchema,type ContentSnapshot,type PortfolioContent} from './cms-model';
import {authConfigured} from './supabase/config';
import {authClient} from './supabase/server';
import {serviceClient} from './supabase/service';
import {isAllowedAdmin} from './security';
export {validMutation} from './security';
export async function adminUser(){if(!authConfigured()||!process.env.ADMIN_USER_ID)return null;try{const client=await authClient();const {data,error}=await client.auth.getUser();if(error||!isAllowedAdmin(data.user?.id,process.env.ADMIN_USER_ID))return null;return {userId:data.user!.id,email:data.user!.email||''};}catch{return null;}}
export async function readContent():Promise<ContentSnapshot>{if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return {content:structuredClone(defaultContent),revision:0,updatedAt:null};const {data,error}=await serviceClient().from('amdv_portfolio_content').select('content, revision, updated_at').eq('id',1).maybeSingle();if(error)throw error;if(!data)return {content:structuredClone(defaultContent),revision:0,updatedAt:null};return {content:contentSchema.parse(data.content),revision:Number(data.revision),updatedAt:data.updated_at};}
export async function saveContent(content:PortfolioContent,revision:number,userId:string){const timestamp=new Date().toISOString();const row={content,revision:revision+1,updated_at:timestamp,updated_by:userId};const db=serviceClient();const result=revision===0?await db.from('amdv_portfolio_content').insert({id:1,...row}).select('revision').maybeSingle():await db.from('amdv_portfolio_content').update(row).eq('id',1).eq('revision',revision).select('revision').maybeSingle();if(result.error){if(result.error.code==='23505')return null;throw result.error;}return result.data?{content,revision:revision+1,updatedAt:timestamp}:null;}
export const noStore={'Cache-Control':'no-store, private'};

export async function submitClientFeedback(client:string,quote:string){
 for(let attempt=0;attempt<3;attempt++){
  const snapshot=await readContent();
  if(snapshot.revision<1||!snapshot.updatedAt)throw new Error('O cadastro do portfólio ainda não está pronto para receber feedbacks.');
  if(snapshot.content.settings.socialTestimonials.length>=100)return 'limit';
  const content={...snapshot.content,settings:{...snapshot.content.settings,socialTestimonials:[...snapshot.content.settings.socialTestimonials,{id:crypto.randomUUID(),client,quote,consent:true,published:false}]}};
  const result=await serviceClient().from('amdv_portfolio_content').update({content,revision:snapshot.revision+1,updated_at:new Date().toISOString()}).eq('id',1).eq('revision',snapshot.revision).select('revision').maybeSingle();
  if(result.error)throw result.error;
  if(result.data)return 'saved';
 }
 return 'conflict';
}
