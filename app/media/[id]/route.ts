import {bucket,database} from '@/lib/cms-server';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[a-f0-9-]{36}\.(jpg|png|webp|avif|mp4|webm)$/.test(id))return new Response('Não encontrado',{status:404});
 try{
  const asset=await database().prepare('SELECT mime, size FROM portfolio_assets WHERE id = ?').bind(id).first<{mime:string;size:number}>();
  if(!asset)return new Response('Não encontrado',{status:404});
  const requested=request.headers.get('range');let range:{offset:number;length:number}|undefined;
  if(requested){
   const match=/^bytes=(\d*)-(\d*)$/.exec(requested);
   if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${asset.size}`}});
   const start=match[1]?Number(match[1]):Math.max(0,asset.size-Number(match[2]));
   const end=match[1]&&match[2]?Math.min(Number(match[2]),asset.size-1):asset.size-1;
   if(start>end||start>=asset.size||(!match[1]&&Number(match[2])===0))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${asset.size}`}});
   range={offset:start,length:end-start+1};
  }
  const object=await bucket().get(id,range?{range}:undefined);
  if(!object)return new Response('Não encontrado',{status:404});
  const headers=new Headers({'Content-Type':asset.mime,'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','ETag':object.httpEtag,'Content-Length':String(range?.length??object.size)});
  if(range)headers.set('Content-Range',`bytes ${range.offset}-${range.offset+range.length-1}/${object.size}`);
  return new Response(object.body,{status:range?206:200,headers});
 }catch(e){console.error('media read',e);return new Response('Mídia temporariamente indisponível',{status:503});}
}
