import {adminUser,readContent} from '@/lib/cms-server';
import {missingConfiguration} from '@/lib/supabase/service';
import {AdminPanel} from '@/components/admin-panel';
import {AdminLogin} from '@/components/admin-login';
export const dynamic='force-dynamic';
export const metadata={title:'Admin — AMDV-016',robots:{index:false,follow:false}};
export default async function AdminPage(){const missing=missingConfiguration();if(missing.length)return <main className="admin-gate"><span className="brand">AMDV<span>—</span>016</span><h1>Vamos conectar<br/>seu estúdio.</h1><p>O site já está disponível. Para ativar o admin, configure o Supabase seguindo o arquivo LEIA-ME-VERCEL.md do projeto.</p><p>Falta configurar:</p><ul>{missing.map(key=><li key={key}><code>{key}</code></li>)}</ul><a href="/">Voltar ao portfólio</a></main>;if(!await adminUser())return <AdminLogin/>;try{return <AdminPanel initial={await readContent()}/>;}catch(e){console.error('admin load',e);return <main className="admin-gate"><h1>Não foi possível carregar.</h1><p>Confira a configuração do Supabase e se o script supabase/setup.sql foi executado.</p><a className="admin-primary" href="/admin">Tentar novamente</a></main>;}}
