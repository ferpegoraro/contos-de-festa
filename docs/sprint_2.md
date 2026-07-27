# Sprint 2 - Design System + Layout Base ✅

**Foco:** Configurar identidade visual da marca e componentes de layout reutilizáveis

## Tarefas

### Design System — Cores e Tokens

- [x] Configurar CSS variables da marca no `globals.css` (`:root`)
  - Primary (Carmim): `#722e43`
  - Rosa claro: `#e8a0b4`
  - Dourado/Creme: `#d4a853`
  - Fundo off-white: `#fff9f5`
  - Texto escuro vinho: `#2d1a22`
  - Muted: `#8c7080`
- [x] Mapear tokens para shadcn/ui (`--primary`, `--secondary`, `--accent`, `--muted`, `--destructive`, etc.)
- [x] Configurar tokens de cards, popovers, borders, inputs e ring
- [x] Configurar variáveis de sidebar para futuro painel admin (`--sidebar-*`)
- [x] Configurar variáveis de charts (`--chart-1` a `--chart-5`)
- [x] Definir `--radius: 0.75rem` com escala (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`)

### Design System — Tipografia

- [x] Configurar Google Fonts via `next/font` no `layout.tsx`
  - **Heading:** Playfair Display (pesos 400–800) — elegante, serifa
  - **Body:** Nunito (pesos 300–700) — legível, amigável
- [x] Expor como CSS variables (`--font-heading`, `--font-body`)
- [x] Aplicar `font-heading` em `h1`–`h6` e `font-body` no `body` via `@layer base`
- [x] Configurar `antialiased` no body

### Componentes de Layout

#### `Header` (`src/components/layout/header.tsx`)
- [x] Navbar fixa (`fixed top-0 z-50`) com transição transparente → escuro ao scroll
  - Sem scroll: `bg-transparent`
  - Com scroll: `bg-[#2d1a22]/95 backdrop-blur-md shadow-lg`
- [x] **Desktop:** Logo (imagem + nome) | Links de navegação com underline rosa ativo | CTA "Fale Conosco" (botão branco arredondado com ícone WhatsApp)
- [x] **Mobile:** Logo | Botão hambúrguer (ícone Menu/X do Lucide)
- [x] Menu mobile slide-down com `backdrop-blur-lg` e `border-t border-white/5`
  - Links com hover `bg-white/5` e transição suave
  - CTA "Fale Conosco" no rodapé do menu
  - Fecha ao clicar em qualquer link (`setMobileOpen(false)`)
- [x] Detecção de página ativa via `usePathname()` com underline rosa `w-3/4`
- [x] Logo com efeito glow (`blur-xl`) no hover

#### `Footer` (`src/components/layout/footer.tsx`)
- [x] Gradiente escuro: `from-[#2d1a22] via-[#3d2832] to-[#2d1a22]`
- [x] Linha dourada decorativa no topo (`via-[#d4a853]/50`)
- [x] Circles decorativos com `blur-3xl` (carmim e dourado)
- [x] Grid 12 colunas responsivo:
  - **Brand (col-span-5):** Logo com glow dourado, nome, tagline, descrição, ícones sociais
  - **Navegação (col-span-3):** Links do `navLinks` com ícone Sparkles dourado
  - **Contato (col-span-4):** WhatsApp, e-mail, endereço com ícones coloridos em caixas
- [x] Ícones sociais com hover colorido:
  - Instagram → dourado (`#d4a853`)
  - WhatsApp → verde (`#25D366`)
  - E-mail → rosa (`#e8a0b4`)
- [x] Barra inferior com copyright dinâmico e "Feito com ❤ para suas festas"

#### `ConditionalFooter` (`src/components/layout/conditional-footer.tsx`)
- [x] Wrapper client-side que esconde o footer na home (`pathname === "/"`)
- [x] Permite hero imersivo full-screen sem footer sobrepondo

#### `WhatsAppFab` (`src/components/shared/whatsapp-fab.tsx`)
- [x] Botão flutuante fixo (`fixed bottom-6 right-6 z-50`)
- [x] Cor verde WhatsApp (`#25d366`) com hover mais escuro
- [x] Ícone `MessageCircle` do Lucide com `scale-110` no hover
- [x] Animação `ping` com `opacity-20` como pulse
- [x] Link direto para WhatsApp com mensagem pré-preenchida
- [x] `aria-label` para acessibilidade

### Layout Root (`src/app/layout.tsx`)

- [x] Fontes carregadas via `next/font/google` com `display: "swap"`
- [x] Metadata SEO configurada:
  - Title template: `"%s | Contos de Festa"`
  - Default: `"Contos de Festa | Pegue & Monte"`
  - Description e keywords relevantes para peg e monte
- [x] Estrutura: `Header` → `<main>{children}</main>` → `ConditionalFooter` → `WhatsAppFab`
- [x] `lang="pt-BR"` no HTML

### Barrel Export (`src/components/layout/index.ts`)

- [x] Re-export centralizado: `Header`, `Footer`, `ConditionalFooter`

### Constantes (`src/constants/site.ts`)

- [x] `siteConfig` centralizado com: nome, tagline, descrição, WhatsApp, Instagram, e-mail, endereço
- [x] `navLinks` com rotas: Início, Kits, Categorias, Sobre

### Hero da Página Inicial (`src/app/page.tsx`)

- [x] Seção full-screen (`min-h-screen`) com `flex items-center justify-center`
- [x] Background gradiente carmim: `from-[#722e43] via-[#5a2435] to-[#2d1a22]`
- [x] Marca d'água da logo no fundo (`opacity-[0.03]`, 500px)
- [x] 3 circles animados com `framer-motion`:
  - Rosa superior esquerdo (pulsando y + scale, 8s)
  - Rosa inferior direito (pulsando y + scale invertido, 10s)
  - Carmim central (pulsando scale + opacity, 12s)
- [x] Logo grande (220×220) com entrada animada (`scale 0.5→1`, `y 20→0`)
- [x] Glow branco atrás da logo (`blur-3xl scale-150`)
- [x] Heading animado: "Criando contos de festas com amor e alegria 💖"
- [x] Subtitle animado com destaque rosa
- [x] 2 botões CTA com efeito shimmer no hover:
  - **"Ver Nossos Kits"** — branco com texto carmim, ícone PartyPopper + ArrowRight, sombra, `scale-105` hover
  - **"Fale Conosco"** — glassmorphism (`bg-white/10 backdrop-blur-sm border-white/20`), ícone WhatsApp verde
- [x] Gradiente fade no rodapé (`from-[#2d1a22] to-transparent`)

## Globals CSS — Estrutura Final

```css
/* Imports */
@import "tailwindcss"
@import "tw-animate-css"
@import "shadcn/tailwind.css"

/* Theme Tokens (inline) */
@theme inline { ... }     → cores, fontes, radius mapeados para Tailwind

/* CSS Variables (:root) */
:root { ... }              → 30+ variáveis da identidade visual

/* Base Layer */
@layer base { ... }        → border, outline, body bg/text/font, headings font
```

## Critérios de Conclusão

- [x] Cores da marca aplicadas em todo o site via CSS variables
- [x] Tipografia consistente (Playfair Display para headings, Nunito para body)
- [x] Navbar responsiva funcionando em desktop e mobile
- [x] Footer completo com informações de contato e redes sociais
- [x] Botão WhatsApp flutuante com link funcional
- [x] Hero imersivo com animações suaves
- [x] Site visualmente consistente com a identidade carmim/rosa/dourado

## Arquivos Criados/Modificados

| Arquivo                                    | Ação     | Descrição                              |
| ------------------------------------------ | -------- | -------------------------------------- |
| `src/app/globals.css`                      | Criado   | Design tokens e identidade visual      |
| `src/app/layout.tsx`                       | Criado   | Layout root com fontes, SEO, estrutura |
| `src/app/page.tsx`                         | Criado   | Hero full-screen com animações         |
| `src/components/layout/header.tsx`         | Criado   | Navbar responsiva com scroll effect    |
| `src/components/layout/footer.tsx`         | Criado   | Footer com grid 12 colunas             |
| `src/components/layout/conditional-footer.tsx` | Criado | Wrapper que esconde footer na home |
| `src/components/layout/index.ts`           | Criado   | Barrel export dos componentes layout   |
| `src/components/shared/whatsapp-fab.tsx`   | Criado   | Botão flutuante WhatsApp               |
| `src/constants/site.ts`                    | Criado   | Configurações centralizadas do site    |
| `src/lib/utils.ts`                         | Criado   | Utilitário `cn()` para classes         |
