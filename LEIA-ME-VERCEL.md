# AMDV-016 — instalação na Vercel

Esta versão usa Next.js nativo. Ela substitui o pacote anterior, que dependia do ambiente Cloudflare/Vinext. O comando de build agora gera `.next/routes-manifest.json`.

## 1. Substituir o código no GitHub

Faça uma cópia de segurança do repositório. Extraia este ZIP e substitua o código antigo pelo conteúdo da pasta AMDV-016, preservando a pasta `.git` se trabalhar localmente. Não misture os dois pacotes: arquivos antigos de Cloudflare/Vinext podem causar conflitos.

O `package.json`, `package-lock.json` e `vercel.json` devem ficar na raiz do projeto selecionado pela Vercel. Inclua também `app`, `components`, `lib`, `public`, `supabase` e os demais arquivos deste pacote. Não envie `node_modules`, `.next` ou arquivos com senhas.

## 2. Configurar a Vercel

No projeto da Vercel, confira estas configurações de build:

| Configuração | Valor |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | Pasta que contém o package.json deste pacote |
| Node.js | 24.x |
| Install Command | npm ci |
| Build Command | npm run build |
| Output Directory | .next |

O arquivo `vercel.json` já define framework, instalação, build e saída. Remova overrides antigos que apontem para `dist`, `build`, Vite ou Vinext. Envie o commit e faça um novo deploy sem reutilizar o cache antigo.

Não crie manualmente routes-manifest.json e não envie a pasta .next para o GitHub: o Next gera esses arquivos durante o build.

O portfólio abre com conteúdo inicial mesmo sem o Supabase. O admin mostra as configurações pendentes até concluir os passos abaixo.

## 3. Preparar o Supabase para o admin

Use preferencialmente um projeto Supabase dedicado a este portfólio.

1. Crie ou selecione o projeto no painel do Supabase.
2. Abra o SQL Editor, cole todo o conteúdo de `supabase/setup.sql` e execute. Isso cria a tabela de conteúdo com RLS e o bucket público de mídia.
3. Em Authentication > Users, adicione seu usuário com e-mail e senha. Confirme o e-mail do usuário pelo painel caso seja necessário.
4. Copie o UUID desse usuário. Apenas esse UUID terá acesso ao painel administrativo.
5. No diálogo Connect ou em Settings > API Keys, obtenha a URL do projeto e a chave publicável. Obtenha também uma chave secreta de servidor.

Em Environment Variables da Vercel, adicione:

| Nome exato | Valor |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | URL HTTPS do seu projeto Supabase |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Chave publicável do projeto |
| SUPABASE_SERVICE_ROLE_KEY | Chave secreta de servidor (sb_secret_...) ou chave legada service_role |
| ADMIN_USER_ID | UUID do usuário criado em Authentication |

O nome SUPABASE_SERVICE_ROLE_KEY é o nome esperado pelo código; ele também aceita a chave secreta atual. Nunca coloque essa chave em uma variável NEXT_PUBLIC, no GitHub ou em mensagens. Cole-a somente nas configurações seguras do ambiente.

Selecione Production e, se quiser testar previews com o mesmo banco, também Preview. Faça um novo deploy depois de cadastrar as variáveis, pois as variáveis públicas são incorporadas ao build.

## 4. Entrar e editar

Acesse `https://SEU-DOMINIO/admin` e entre com o e-mail e a senha do usuário criado. Edite textos, projetos e mídias, salve e confira a página pública. Não há cadastro público. Para trocar a pessoa administradora, altere ADMIN_USER_ID e faça novo deploy. Para recuperar acesso, gerencie o usuário no painel do Supabase.

O painel reúne as partes editáveis do site:

| Aba | O que você pode alterar |
| --- | --- |
| Projetos | Criar, ordenar, editar, publicar ou deixar como rascunho; capa, vídeo principal, até 10 vídeos adicionais, até 20 fotos, descrição, créditos e categorias. |
| Página inicial | Imagem de abertura, texto, showreel, links do menu e publicações em destaque. |
| Sobre & clientes | Foto, título, história, frase de posicionamento e lista de clientes. |
| Contato | Texto, WhatsApp, e-mail, Instagram e localização. |

Cada projeto pode reunir vários vídeos e fotos na página própria. Antes de divulgar um rascunho, marque “Visível no portfólio” e salve.

Uploads aceitam JPG, PNG, WebP, AVIF, MP4 e WebM de até 25 MiB cada. Os arquivos são enviados diretamente ao Supabase usando autorização temporária emitida pelo servidor. O bucket é público: use apenas mídia destinada ao portfólio. Para vídeos maiores, use uma URL de mídia compatível com o campo do projeto.

## Desenvolvimento local

Instale Node.js 24, copie `.env.example` para `.env.local` e preencha os valores. Depois execute:

```sh
npm ci
npm run dev
```

Para verificar a versão de produção:

```sh
npm run build
npm run start
```

Testes de segurança e SQL isolado: `npm run test:security`.

## Validação e limites desta entrega

- Build de produção concluído e routes-manifest.json gerado.
- Página inicial, projeto, admin sem configuração e página inexistente verificados via HTTP.
- Acesso anônimo ao conteúdo administrativo e ao upload bloqueado; requisições de autenticação de outra origem bloqueadas.
- SQL testado em PostgreSQL isolado: permissões, RLS e controle de revisão.
- Login real e envio de mídia precisam ser verificados após conectar seu projeto Supabase. Não foram testados com credenciais reais nesta entrega.

Este pacote contém o código e o conteúdo inicial. Conteúdo salvo e uploads do banco/armazenamento do site anterior não são automaticamente transferidos. O site original permanece independente; revise os textos, imagens, links de contato e projetos antes de divulgar o novo endereço.
