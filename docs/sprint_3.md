# Sprint 3 - Landing Page (Seções Estáticas) ✅ Concluído

**Foco:** Completar a página inicial com seções que não dependem de dados do backend

## Tarefas

### Hero Section ✅ (feito na Sprint 2)

- [x] Headline principal com chamada de ação
- [x] Subtítulo explicando o serviço de peg e monte
- [x] Botão CTA "Ver Nossos Kits" → leva para `/kits`
- [x] Botão CTA "Fale Conosco" → abre WhatsApp

### Seção "Como Funciona" ✅

- [x] 3 passos: Escolha → Monte seu Orçamento → WhatsApp
- [x] Ícones e descrições curtas
- [x] Posicionar abaixo do hero na home

### Seção Social / Confiança ✅

- [x] Depoimentos de clientes (3 depoimentos)
- [x] Números/estatísticas (500+ festas, 98% satisfação, 30+ kits, 5+ anos)

### Página Sobre (`/sobre`) ✅

- [x] História da empresa
- [x] Foto da proprietária (placeholder para upload futuro)
- [x] Valores e diferenciais (4 cards: carinho, praticidade, qualidade, atendimento)
- [x] CTA para WhatsApp

### Página de Kits (`/kits`) ✅

- [x] Rota criada com tema escuro
- [x] Estado vazio ("Em breve!") com CTA para WhatsApp

### Responsividade ✅

- [x] Hero responsivo mobile first
- [x] Todas as seções responsivas (grid adapta de 1 → 2 → 3/4 colunas)

## Critérios de Conclusão

- [x] Landing page com todas as seções estáticas
- [x] Página `/sobre` completa
- [x] Identidade visual consistente (tema escuro, carmim, rosa, dourado)
- [x] Tudo responsivo

## Arquivos Criados/Modificados

| Arquivo                                        | Ação       | Descrição                                      |
| ---------------------------------------------- | ---------- | ---------------------------------------------- |
| `src/components/sections/how-it-works.tsx`     | Criado     | Seção 3 passos (Escolha → Orçamento → WhatsApp)|
| `src/components/sections/social-proof.tsx`     | Criado     | Stats + depoimentos de clientes                |
| `src/components/sections/index.ts`             | Criado     | Barrel export das seções                        |
| `src/app/page.tsx`                             | Modificado | Adicionou HowItWorks e SocialProof após hero   |
| `src/app/sobre/page.tsx`                       | Criado     | Página Sobre com história, valores e CTA        |
| `src/app/kits/page.tsx`                        | Criado     | Catálogo com estado vazio (Sprint anterior)      |
