import {authClient} from '@/lib/supabase/server';
import {validMutation} from '@/lib/security';
import {noStore} from '@/lib/cms-server';
export async function POST(request:Request){if(!validMutation(request))return Response.json({error:'Origem não autorizada.'},{status:403,headers:noStore});try{const {error}=await (await authClient()).auth.signOut({scope:'local'});if(error)throw error;return Response.json({ok:true},{headers:noStore});}catch{return Response.json({error:'Não foi possível sair. Tente novamente.'},{status:503,headers:noStore});}}
