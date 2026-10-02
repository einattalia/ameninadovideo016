export function publicSupabaseConfig(){return {url:process.env.NEXT_PUBLIC_SUPABASE_URL||'',key:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||''};}
export function authConfigured(){const {url,key}=publicSupabaseConfig();return Boolean(url&&key);}
