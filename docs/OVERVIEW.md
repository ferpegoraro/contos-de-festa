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

## Resumo dos Sprints

| Sprint | Foco                          | Status       |
| ------ | ----------------------------- | ------------ |
| 1      | Configuração Inicial          | ✅ Concluído |
| 2      | Banco de Dados (Docker/Prisma)| ⬜ Pendente  |
| 3      | Auth Admin + CRUD de Kits     | ⬜ Pendente  |
| 4      | Painel Admin + Upload Imagens | ⬜ Pendente  |
| 5      | Site Público + WhatsApp       | ⬜ Pendente  |
| 6      | Deploy + Polimento            | ⬜ Pendente  |

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
- [Sprint 2 - Banco de Dados](./sprint_2.md)
- [Sprint 3 - Auth Admin + CRUD de Kits](./sprint_3.md)
- [Sprint 4 - Painel Admin + Upload](./sprint_4.md)
- [Sprint 5 - Site Público + WhatsApp](./sprint_5.md)
- [Sprint 6 - Deploy + Polimento](./sprint_6.md)

## Funcionalidades Futuras (Pós-MVP)

- [ ] Plataforma de cursos online
- [ ] Calendário visual de disponibilidade
- [ ] Blog para SEO
- [ ] Google Analytics
- [ ] Página de FAQ
