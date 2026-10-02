# AMDV-016 — A Menina do Vídeo 016

Código-fonte do portfólio audiovisual e do painel administrativo.

Exportação: 02/10/2026. Base: versão publicada 4, commit `1717fec517f92936c1b84c3b8b9cdb80902b2f39`.

## O que está incluído

- Portfólio responsivo com animações de scroll e páginas de projetos.
- Painel `/admin`: projetos, ordenação, rascunhos, galerias, textos, clientes e contatos.
- Upload de imagens e vídeos; reprodução de links do YouTube e Vimeo.
- Código das APIs, esquema do banco e migração SQL.
- Imagens demonstrativas, dependências fixadas e configurações de compilação.
- Verificações de autorização, salvamento, conflitos, rascunhos e arquivos em `scripts/check-cms.mjs`.

## Colocar no GitHub

1. Extraia o ZIP.
2. Coloque o conteúdo da pasta `AMDV-016` na raiz do seu repositório. `package.json`, `app`, `components` e `README.md` devem estar na raiz.
3. Inclua os arquivos de configuração que começam com ponto, como `.gitignore`, `.npmrc` e `.openai/hosting.json`.
4. Faça o commit e envie ao GitHub. Não envie `node_modules`, `.env`, `.wrangler`, `.sites-runtime` nem arquivos de credenciais.

O ZIP não contém histórico Git, tokens, senhas, dependências instaladas nem arquivos temporários. O README original da base está em `README-PLATAFORMA.md`.

## Hospedagem e dependências externas

Esta exportação é do código atual, não uma migração de hospedagem.

O projeto usa React, convenções do Next.js App Router, Tailwind e Framer Motion. A compilação usa **Vinext/Vite**, com execução em **Cloudflare Workers** na plataforma Sites.

- **D1 / binding `DB`:** conteúdo editável, revisões e metadados dos arquivos.
- **R2 / binding `BUCKET`:** imagens e vídeos enviados no admin.
- **Login:** autenticação do ChatGPT intermediada pela plataforma Sites.
- **Autorização:** conferência da administradora no servidor em `lib/cms-server.ts`.

Criar um repositório GitHub não conecta automaticamente o banco nem publica o site. Para executar em outra hospedagem, é necessário configurar armazenamento e banco equivalentes e adaptar a autenticação. **Não está pronto para importar e publicar diretamente na Vercel como um Next.js convencional.**

Não confie em cabeçalhos de identidade enviados pelo visitante em uma hospedagem independente. O código atual confia nesses cabeçalhos porque a plataforma Sites os valida antes de encaminhá-los. Fora dela, substitua esse mecanismo por autenticação verificada no servidor; não remova a proteção do admin.

A configuração `.openai/hosting.json` identifica o Site atual e seus bindings lógicos. Ela não contém credenciais de acesso.

## Conteúdo e mídia

Os arquivos e conteúdos padrão estão em `public/images`, `lib/portfolio.ts` e `lib/cms-model.ts`. Os créditos das imagens demonstrativas estão em `public/images/CREDITS.txt`.

**Alterações salvas pelo admin no banco e arquivos enviados ao R2 não fazem parte do ZIP.** Eles permanecem na hospedagem atual. Uma migração completa exige exportar e importar esses dados e mídias separadamente. O código contém a estrutura para ler e editar esses registros.

## Instalação e compilação local

Requisitos: Node.js compatível com `engines` em `package.json` (>= 22.13.0) e pnpm 11.25.0. Preserve `pnpm-lock.yaml`.

Com o pnpm instalado:

```bash
pnpm install --frozen-lockfile
pnpm build
```

Ou use `corepack pnpm` no lugar de `pnpm` quando Corepack estiver disponível.

Para preparar o banco **local** depois da primeira compilação:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_sour_black_panther.sql
```

Aplique essa migração apenas uma vez por banco local. Ela cria as tabelas, sem copiar dados de produção.

Depois:

```bash
pnpm dev
```

O endereço local será mostrado no terminal. O login real do ChatGPT e o acesso administrativo dependem da plataforma Sites; não há senha local criada nesta exportação.

Verificação do código compilado em um banco isolado:

```bash
node scripts/check-cms.mjs
```

O teste simula a identidade fornecida pela plataforma somente no ambiente local isolado. Não altera o banco de produção.

## Estrutura principal

- `app/page.tsx`: página inicial.
- `app/projetos/[slug]/page.tsx`: página de projeto.
- `app/admin/page.tsx`: acesso administrativo.
- `components/admin-panel.tsx`: editor do admin.
- `components/portfolio.tsx`: seções do portfólio.
- `components/scroll-motion.tsx`: movimentos de scroll.
- `lib/cms-model.ts`: validação e conteúdo inicial.
- `lib/cms-server.ts`: banco e autorização no servidor.
- `app/api/admin`: salvamento e upload.
- `app/media/[id]/route.ts`: entrega dos arquivos.
- `db/schema.ts` e `drizzle/`: esquema e migração do banco.

Uploads diretos: até 25 MB. Para vídeos maiores, use YouTube ou Vimeo.
