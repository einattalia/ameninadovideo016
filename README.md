# AMDV-016 — portfólio e admin

Versão para Vercel com Next.js nativo, React, Tailwind e Supabase (Auth, banco e mídia).

**Comece por [LEIA-ME-VERCEL.md](LEIA-ME-VERCEL.md).** O guia explica a substituição do pacote antigo, as configurações de deploy e a ativação do admin.

O site público funciona com conteúdo inicial sem conexão ao banco. Para salvar alterações no admin, configure o Supabase seguindo o guia.

```sh
npm ci
npm run build
npm run start
```

Node.js 24. Não envie arquivos .env com credenciais ao GitHub.
