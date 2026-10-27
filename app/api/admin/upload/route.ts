import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { adminUser, validMutation, noStore } from '@/lib/cms-server';
import { serviceClient } from '@/lib/supabase/service';
import { uploadTypes, validUpload } from '@/lib/security';

export const dynamic = 'force-dynamic';

const MAX_SUPABASE_VIDEO_SIZE = 50 * 1024 * 1024;

function r2Config() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/, '');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;

  try {
    const parsed = new URL(publicUrl);
    if (parsed.protocol !== 'https:' || parsed.pathname !== '/' || parsed.search || parsed.hash) return null;
  } catch {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

async function createR2Upload(type: string, extension: string) {
  const config = r2Config();
  if (!config) return null;

  const key = `videos/${crypto.randomUUID()}.${extension}`;
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: type }),
    { expiresIn: 900 },
  );

  return {
    storage: 'r2',
    uploadUrl,
    headers: { 'Content-Type': type },
    url: `${config.publicUrl}/${key}`,
  };
}

export async function POST(request: Request) {
  if (!await adminUser() || !validMutation(request)) {
    return Response.json({ error: 'Entre com a conta administradora.' }, { status: 403, headers: noStore });
  }

  try {
    const raw = await request.text();
    if (raw.length > 4000) return Response.json({ error: 'Solicitação inválida.' }, { status: 400, headers: noStore });

    const { type, size } = JSON.parse(raw);
    if (typeof type !== 'string' || !validUpload(type, size)) {
      return Response.json(
        { error: 'Formatos aceitos: JPG, PNG, WebP e AVIF até 25 MB; MP4 e WebM até 500 MB.' },
        { status: 400, headers: noStore },
      );
    }

    if (type.startsWith('video/')) {
      const r2Upload = await createR2Upload(type, uploadTypes[type]);
      if (r2Upload) return Response.json(r2Upload, { headers: noStore });

      if (size > MAX_SUPABASE_VIDEO_SIZE) {
        return Response.json(
          { error: 'Vídeos acima de 50 MB precisam do R2. Configure as variáveis R2 na Vercel para enviar arquivos maiores.' },
          { status: 503, headers: noStore },
        );
      }
    }

    const path = crypto.randomUUID() + '.' + uploadTypes[type];
    const storage = serviceClient().storage.from('amdv-media');
    const { data, error } = await storage.createSignedUploadUrl(path, { upsert: false });
    if (error || !data) throw error;
    const { data: publicData } = storage.getPublicUrl(path);
    return Response.json(
      { storage: 'supabase', path, token: data.token, bucket: 'amdv-media', url: publicData.publicUrl },
      { headers: noStore },
    );
  } catch (error) {
    console.error('upload sign', error);
    return Response.json(
      { error: 'Não foi possível preparar o upload. Confira as configurações do armazenamento do site.' },
      { status: 503, headers: noStore },
    );
  }
}
