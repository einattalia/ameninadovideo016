import 'server-only';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {publicSupabaseConfig} from './config';
export async function authClient(){
 const {url,key}=publicSupabaseConfig();
 if(!url||!key)throw new Error('Supabase não configurado.');
 const jar=await cookies();
 return createServerClient(url,key,{
  cookieOptions:{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'},
  cookies:{
   getAll:()=>jar.getAll(),
   setAll(items){
    try{items.forEach(({name,value,options})=>jar.set(name,value,options));}
    catch{/* Server Components cannot write cookies; proxy refreshes them. */}
   }
  }
 });
}
