'use client';

import { createClient } from '@supabase/supabase-js';
import { publicSupabaseConfig } from './supabase/config';

type UploadPreparation = {
  storage: 'r2' | 'supabase';
  url: string;
  uploadUrl?: string;
  headers?: Record<string, string>;
  path?: string;
  token?: string;
  bucket?: string;
};

export async function uploadMedia(file: File) {
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-AMDV-Admin': '1' },
    body: JSON.stringify({ type: file.type, size: file.size }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Falha ao preparar upload.');

  const upload = data as UploadPreparation;
  if (upload.storage === 'r2' && upload.uploadUrl) {
    const result = await fetch(upload.uploadUrl, {
      method: 'PUT',
      headers: upload.headers,
      body: file,
    });
    if (!result.ok) throw new Error('Falha no envio para o Cloudflare R2. Confira a política CORS do bucket.');
    return upload.url;
  }

  if (!upload.path || !upload.token || !upload.bucket) throw new Error('Resposta de upload inválida.');
  const { url, key } = publicSupabaseConfig();
  if (!url || !key) throw new Error('A configuração pública do armazenamento está incompleta. Confira as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY na Vercel.');
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error } = await client.storage.from(upload.bucket).uploadToSignedUrl(upload.path, upload.token, file, {
    contentType: file.type,
    cacheControl: '31536000',
  });
  if (error) throw new Error('Falha no envio do arquivo. Confira o tamanho e tente novamente.');
  return upload.url;
}
