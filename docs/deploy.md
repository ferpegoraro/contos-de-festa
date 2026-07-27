# 🚀 Checklist de Deploy — Contos de Festas

Plano escolhido: **API + banco sempre ligados (sem cold start), custo baixo e com teto travado.**

| Peça | Onde | Custo |
| --- | --- | --- |
| Site (frontend) | **Vercel** | grátis |
| API + Postgres (sempre ligados) | **Railway** (Hobby) | ~US$5–8/mês, **teto US$12** |
| Fotos | **Cloudinary** | grátis (já configurado) |
| Domínio | **registro.br** (`.com.br`) | ~R$40/ano |

> Código já pronto: proxy `/api` no Next (cookie first-party), `npm run start:back`, `npm run prisma:deploy`, Helmet, CORS restrito, rate limit, cookie `Secure` em produção e **cache nas rotas públicas** (aguenta pico de acessos sem sobrecarregar o Railway).

---

## 0. Antes de começar

- [ ] Código commitado e no GitHub (`git push`)
- [ ] Gerar segredos **novos** de produção (não reusar os de dev):
  ```bash
  openssl rand -base64 32   # JWT_SECRET
  openssl rand -base64 24   # ADMIN_REGISTRATION_KEY
  ```

## 1. Railway — API + Banco (railway.com)

- [ ] Criar conta (login com GitHub) e assinar o plano **Hobby**
- [ ] **New Project → Deploy PostgreSQL** (cria o banco primeiro)
- [ ] No mesmo projeto: **New → GitHub Repo** → escolher `contos-de-festas`
- [ ] No serviço da API, aba **Settings**:
  - **Build Command:** `npm ci && npm run prisma:generate`
  - **Start Command:** `npm run prisma:deploy && npm run start:back`
    - (roda as migrations no start, quando o banco já está acessível, e sobe a API)
- [ ] Aba **Variables** do serviço da API:

  | Variável | Valor |
  | --- | --- |
  | `NODE_ENV` | `production` |
  | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referência ao banco do projeto) |
  | `JWT_SECRET` | gerado no passo 0 |
  | `ADMIN_REGISTRATION_KEY` | gerado no passo 0 |
  | `FRONTEND_URL` | URL do site na Vercel (preencher depois do passo 3) |
  | `CLOUDINARY_CLOUD_NAME` | mesmo do dev |
  | `CLOUDINARY_API_KEY` | mesmo do dev |
  | `CLOUDINARY_API_SECRET` | mesmo do dev |

- [ ] Aba **Settings → Networking → Generate Domain** (gera a URL pública da API)
- [ ] Testar: abrir `https://SEU-APP.up.railway.app/` deve responder `{"status":"ok"}`

## 2. 🔒 Travar o teto de gasto (US$12) — o passo que te deixa dormir

- [ ] Railway → **Workspace/Account Settings → Usage** → definir **Usage Limit / Hard Limit = US$12**
- [ ] Confirmar que **não há auto-scaling / replicas extras** (Hobby: 1 réplica, é o padrão)

> Se por qualquer motivo (bug, loop) o uso chegar em US$12, o Railway **pausa o serviço** em vez de continuar cobrando. Pior caso = site tira uma soneca, **nunca uma dívida**. No dia a dia o custo fica em ~US$5–8; o US$12 é só a rede de segurança.

## 3. Frontend — Vercel (vercel.com)

- [ ] **Add New → Project** → importar o repositório (Next.js, detecta sozinho)
- [ ] Variáveis de ambiente:

  | Variável | Valor |
  | --- | --- |
  | `API_PROXY_TARGET` | URL da API no Railway (ex.: `https://SEU-APP.up.railway.app`) |
  | `NEXT_PUBLIC_API_URL` | `/api` ← modo proxy (cookie de login funciona) |
  | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5511964656024` |

- [ ] Deploy → copiar a URL da Vercel
- [ ] Voltar no **Railway** e preencher `FRONTEND_URL` com essa URL (CORS)

> **Por que o proxy?** O cookie de login é `SameSite=Lax`. Vercel e Railway são domínios diferentes — sem o proxy o navegador não enviaria o cookie e o login quebraria. Com `NEXT_PUBLIC_API_URL=/api`, o browser fala só com o domínio do site e o Next repassa pro Railway.
>
> ⚠️ Efeito colateral do proxy: a Vercel limita upload a **4,5MB** por request. Fotos maiores falham no painel — comprimir antes, ou usar o subdomínio próprio do passo 4 (`api.contosdefestas.com.br`), que dispensa o proxy.

## 4. Domínio — registro.br (`.com.br`)

- [ ] Registrar **`contosdefestas.com.br`** em [registro.br](https://registro.br) (precisa de CPF/CNPJ, ~R$40/ano)
- [ ] **Vercel → Project → Settings → Domains** → adicionar `contosdefestas.com.br` e `www`
- [ ] Copiar os registros DNS que a Vercel mostrar e colar no painel do registro.br (A / CNAME)
- [ ] Atualizar `FRONTEND_URL` no Railway para `https://contosdefestas.com.br`
- [ ] (Opcional, dispensa o proxy) criar `api.contosdefestas.com.br` apontando pro Railway e trocar `NEXT_PUBLIC_API_URL` para essa URL — resolve o limite de 4,5MB de upload

## 5. Criar a admin de produção

- [ ] Acessar `https://contosdefestas.com.br/admin/register`
- [ ] Cadastrar nome, e-mail e senha da proprietária + o `ADMIN_REGISTRATION_KEY` de produção
- [ ] Login em `/login` e criar/limpar dados: apagar os kits de teste ("oi", "Dourado e Preto"), ajustar categoria "adultos", definir o preço do tipo "Kit de Mesa"

## 6. Smoke test final

- [ ] Home, `/kits` e `/categorias` carregam **na hora** (sem espera — always-on)
- [ ] Login funciona e **continua logado após F5** (valida o cookie via proxy)
- [ ] Criar kit com foto no painel → aparece no catálogo
- [ ] Botão de WhatsApp abre a conversa com a mensagem montada
- [ ] Testar no celular (4G, fora do Wi-Fi)
- [ ] Compartilhar o link no WhatsApp e ver se aparece a prévia (ver OG image — pendente)

## Notas

- **Sem cold start:** Railway Hobby mantém API + banco ligados 24h. Não precisa de keep-alive/UptimeRobot.
- **Aguenta a audiência (11k no Insta):** páginas e fotos vêm de Vercel + Cloudinary (CDN, escala de graça); o Railway só entrega dados leves e **com cache** — pico de visitas quase não toca nele.
- **Migrations:** rodam sozinhas no start (`prisma migrate deploy`). Novos deploys aplicam migrations pendentes automaticamente.
