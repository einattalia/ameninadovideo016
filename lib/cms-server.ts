import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {defaultContent,contentSchema,type ContentSnapshot,type PortfolioContent} from './cms-model';
// Verified owner account from the Site access policy. This is a server-side allowlist;
// platform-authenticated site user IDs are stored as the durable audit identity.
const ownerEmails = new Set(['ei.nattaliag@gmail.com']);
export async function adminUser(){const user=await getChatGPTUser();return user&&ownerEmails.has(user.email.toLowerCase())?user:null;}
export function database(){if(!env.DB)throw new Error('Database unavailable');return env.DB;}
export function bucket(){if(!env.BUCKET)throw new Error('Storage unavailable');return env.BUCKET;}
export async function readContent():Promise<ContentSnapshot>{const row=await database().prepare('SELECT content, revision, updated_at FROM portfolio_content WHERE id = ?').bind(1).first<{content:string;revision:number;updated_at:string}>();if(!row)return {content:structuredClone(defaultContent),revision:0,updatedAt:null};return {content:contentSchema.parse(JSON.parse(row.content)),revision:row.revision,updatedAt:row.updated_at};}
export async function saveContent(content:PortfolioContent,revision:number,userId:string){const timestamp=new Date().toISOString();const json=JSON.stringify(content);const statement=revision===0?database().prepare('INSERT OR IGNORE INTO portfolio_content (id, content, revision, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)').bind(1,json,1,timestamp,userId):database().prepare('UPDATE portfolio_content SET content = ?, revision = revision + 1, updated_at = ?, updated_by = ? WHERE id = ? AND revision = ?').bind(json,timestamp,userId,1,revision);const result=await statement.run();return result.meta.changes===1?{content,revision:revision+1,updatedAt:timestamp}:null;}
export function validMutation(request:Request){const origin=request.headers.get('origin');return request.headers.get('x-amdv-admin')==='1' && (!origin || origin===new URL(request.url).origin || origin==='https://amdv-016-portfolio.ei-nattaliag.chatgpt.site');}
export const noStore={'Cache-Control':'no-store, private'};
