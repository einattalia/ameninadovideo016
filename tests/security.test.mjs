import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {isAllowedAdmin,validMutation,validUpload} from '../lib/security.ts';

test('admin requires an exact configured identity',()=>{assert.equal(isAllowedAdmin('owner','owner'),true);assert.equal(isAllowedAdmin('visitor','owner'),false);assert.equal(isAllowedAdmin(undefined,'owner'),false);assert.equal(isAllowedAdmin('owner',undefined),false);});
test('mutations require a matching origin and intentional request header',()=>{const make=(origin,header='1')=>new Request('https://portfolio.example/api/admin/content',{method:'PUT',headers:{Origin:origin,'X-AMDV-Admin':header}});assert.equal(validMutation(make('https://portfolio.example')),true);assert.equal(validMutation(make('https://hostile.example')),false);assert.equal(validMutation(make('https://portfolio.example','')),false);assert.equal(validMutation(new Request('https://portfolio.example')),false);});
test('signed upload inputs restrict types and sizes',()=>{assert.equal(validUpload('image/webp',100),true);assert.equal(validUpload('video/mp4',25*1024*1024),true);assert.equal(validUpload('video/mp4',25*1024*1024+1),false);assert.equal(validUpload('text/html',100),false);assert.equal(validUpload('image/svg+xml',100),false);assert.equal(validUpload('image/png',0),false);});
test('Postgres installation, private drafts and optimistic revisions',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`);
  const sql=await readFile(new URL('../supabase/setup.sql',import.meta.url),'utf8');await db.exec(sql);
  const security=await db.query("select relrowsecurity from pg_class where relname='amdv_portfolio_content'");assert.equal(security.rows[0].relrowsecurity,true);
  for(const role of ['anon','authenticated']){await db.exec('set role '+role);await assert.rejects(db.query('select content from public.amdv_portfolio_content'),/permission denied/);await assert.rejects(db.query("insert into public.amdv_portfolio_content values(1,'{}',1,now(),'00000000-0000-4000-8000-000000000001')"),/permission denied/);await db.exec('reset role');}
  await db.exec('set role service_role');await db.query("insert into public.amdv_portfolio_content values(1,$1,1,now(),'00000000-0000-4000-8000-000000000001')",[JSON.stringify({draft:'private'})]);
  const update=await db.query("update public.amdv_portfolio_content set revision=2 where id=1 and revision=1 returning revision");assert.equal(update.rows.length,1);
  const stale=await db.query("update public.amdv_portfolio_content set revision=2 where id=1 and revision=1 returning revision");assert.equal(stale.rows.length,0);
  await db.exec('reset role');await db.exec(sql);const saved=await db.query('select revision,content from public.amdv_portfolio_content');assert.equal(saved.rows[0].revision,2);assert.equal(saved.rows[0].content.draft,'private');
  const bucket=await db.query("select * from storage.buckets where id='amdv-media'");assert.equal(Number(bucket.rows[0].file_size_limit),25*1024*1024);assert.equal(bucket.rows[0].allowed_mime_types.includes('text/html'),false);
 }finally{await db.close();}
});
