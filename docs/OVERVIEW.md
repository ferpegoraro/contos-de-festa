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
- **Rosa claro:** `#e8a0b4` (detalhes, bordas, destaques em fundo escuro)
- **Rosa escuro:** `#9b3a5a` (hover, variações)
- **Rosa pérola:** `#fce8ef` (preços/destaques premium, estrelinhas)
- **Fundo:** `#fff9f5` (off-white quente)
- **Texto / fundo escuro:** `#2d1a22` (escuro vinho)
- **Muted:** `#8c7080` (texto secundário)

> O dourado `#d4a853` foi removido da identidade — substituído por tons de rosa conforme o contexto.

## Resumo dos Sprints

| Sprint | Foco                                    | Status          |
| ------ | --------------------------------------- | --------------- |
| 1      | Configuração Inicial                    | ✅ Concluído    |
| 2      | Design System + Layout Base             | ✅ Concluído    |
| 3      | Landing Page (Seções Estáticas)         | ✅ Concluído    |
| 4      | Catálogo de Kits + WhatsApp             | ✅ Concluído    |
| 5      | Backend (Banco, Auth, API, Upload)      | ✅ Concluído    |
| 6      | Painel Admin (Frontend)                 | ✅ Concluído    |
| 7      | Integração + Hardening + Deploy         | 🟡 Falta deploy |
| 8      | Refino & Qualidade (tech debt + CI)     | ✅ Concluído    |
| 9      | Preço & Itens por Tipo de Kit           | ✅ Concluído    |

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
- [Sprint 2 - Design System + Layout Base](./sprint_2.md) ✅
- [Sprint 3 - Landing Page (Seções Estáticas)](./sprint_3.md)
- [Sprint 4 - Catálogo de Kits + WhatsApp](./sprint_4.md)
- [Sprint 5 - Backend (Banco, Auth, API, Upload)](./sprint_5.md)
- [Sprint 6 - Painel Admin (Frontend)](./sprint_6.md)
- [Sprint 7 - Integração + Hardening + Deploy](./sprint_7.md) 🟡 falta deploy
- [Sprint 8 - Refino & Qualidade](./sprint_8.md) ✅
- [Sprint 9 - Preço & Itens por Tipo de Kit](./sprint_9.md) ✅
- [Guia do Painel para a proprietária](./guia_admin.md)

## Funcionalidades Futuras (Pós-MVP)

- [ ] Recuperação de senha ("esqueci minha senha" via email)
- [ ] Plataforma de cursos online
- [ ] Calendário visual de disponibilidade
- [ ] Blog para SEO
- [ ] Google Analytics
- [ ] Página de FAQ
