# 🎉 Contos de Festas - Planejamento do Projeto

## Visão Geral

Site vitrine para empresa de **peg e monte** com:

- Catálogo de kits com fotos
- Painel admin para a proprietária gerenciar kits e fotos
- Montagem de orçamento com envio automático via WhatsApp
- Botão de WhatsApp flutuante

> **Foco:** Site bonito, simples e funcional. Sem controle de estoque, sem pagamento online. O atendimento e pagamento (PIX) acontecem pelo WhatsApp.

## Stack Tecnológica

| Camada         | Tecnologia              |
| -------------- | ----------------------- |
| Frontend       | Next.js 16 + TypeScript |
| Estilização    | TailwindCSS + shadcn/ui |
| Backend        | Fastify (SOLID)         |
| Banco de Dados | PostgreSQL + Prisma     |
| Autenticação   | JWT (@fastify/jwt)      |
| Upload         | Cloudinary              |
| Deploy Front   | Vercel                  |
| Deploy Back    | Railway ou Render       |

## Identidade Visual

- **Cor Principal (Carmim):** `#722e43`
- **Rosa claro:** `#e8a0b4` (detalhes, bordas)
- **Rosa escuro:** `#9b3a5a` (hover, variações)
- **Dourado/Creme:** `#d4a853` (destaques, estrelinhas)
- **Fundo:** `#fff9f5` (off-white quente)
- **Texto:** `#2d1a22` (escuro vinho)
- **Muted:** `#8c7080` (texto secundário)

## Resumo dos Sprints (Frontend First)

| Sprint | Foco                                    | Status       |
| ------ | --------------------------------------- | ------------ |
| 1      | Configuração Inicial                    | ✅ Concluído |
| 2      | Design System + Layout Base             | ⬜ Pendente  |
| 3      | Landing Page (Site Público)             | ⬜ Pendente  |
| 4      | Catálogo de Kits + WhatsApp             | ⬜ Pendente  |
| 5      | Painel Admin (Frontend)                 | ⬜ Pendente  |
| 6      | Backend (Banco, Auth, API, Upload)      | ⬜ Pendente  |
| 7      | Integração Front + Back + Deploy        | ⬜ Pendente  |

## Como Funciona o Site

### Para o visitante (cliente):
1. Entra no site e vê os kits disponíveis com fotos
2. Pode filtrar por categoria
3. Seleciona os itens que tem interesse
4. Clica em "Solicitar Orçamento via WhatsApp"
5. Abre o WhatsApp com mensagem pré-montada com os itens escolhidos
6. Conversa com a proprietária, combina valores e paga via PIX

### Para a proprietária (admin):
1. Faz login no painel admin
2. Adiciona/edita/remove kits
3. Faz upload de fotos dos kits
4. Gerencia categorias

## Arquivos de Sprint

- [Sprint 1 - Configuração Inicial](./sprint_1.md) ✅
- [Sprint 2 - Design System + Layout Base](./sprint_2.md)
- [Sprint 3 - Landing Page](./sprint_3.md)
- [Sprint 4 - Catálogo + WhatsApp](./sprint_4.md)
- [Sprint 5 - Painel Admin (Frontend)](./sprint_5.md)
- [Sprint 6 - Backend (Banco, Auth, API)](./sprint_6.md)
- [Sprint 7 - Integração + Deploy](./sprint_7.md)

## Funcionalidades Futuras (Pós-MVP)

- [ ] Plataforma de cursos online
- [ ] Calendário visual de disponibilidade
- [ ] Blog para SEO
- [ ] Google Analytics
- [ ] Página de FAQ
