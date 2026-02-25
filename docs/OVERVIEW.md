# 🎉 Contos de Festas - Planejamento do Projeto

## Visão Geral

Plataforma web para empresa de **peg e monte** com:

- Catálogo de kits para aluguel
- Sistema de controle de aluguéis
- Plataforma de cursos online
- Sistema de pagamentos
- Painel administrativo

> **Prioridade:** KITS primeiro, CURSOS depois

## Stack Tecnológica

| Camada         | Tecnologia              |
| -------------- | ----------------------- |
| Frontend       | Next.js 16 + TypeScript |
| Estilização    | TailwindCSS + shadcn/ui |
| Backend        | Fastify (SOLID)         |
| Banco de Dados | PostgreSQL + Prisma     |
| Autenticação   | JWT (@fastify/jwt)      |
| Pagamentos     | Stripe (+ PIX)          |
| Upload         | Cloudinary              |
| Deploy Front   | Vercel                  |
| Deploy Back    | Railway ou Render       |

## Resumo dos Sprints

| Sprint | Foco                           | Status       |
| ------ | ------------------------------ | ------------ |
| 1      | Configuração Inicial           | ✅ Concluído |
| 2      | Banco de Dados (Docker/Prisma) | ⬜ Pendente  |
| 3      | Autenticação                   | ⬜ Pendente  |
| 4      | **CRUD de Kits** (PRIORIDADE)  | ⬜ Pendente  |
| 5      | **Painel Admin (Kits)**        | ⬜ Pendente  |
| 6      | **Sistema de Aluguéis**        | ⬜ Pendente  |
| 7      | **Deploy MVP (Kits)**          | ⬜ Pendente  |
| ---    | --- **SITE NO AR** ---         | 🚀           |
| 8      | CRUD de Cursos                 | ⬜ Futuro    |
| 9      | Pagamentos + Área do Aluno     | ⬜ Futuro    |
| 10     | Finalização Cursos             | ⬜ Futuro    |

## Fases do Projeto

### Fase 1: MVP - Kits e Aluguéis (Sprints 1-7) 🎯

- Configuração do ambiente
- Banco de dados
- Autenticação
- CRUD de kits e categorias
- Painel admin para gestão
- Sistema de aluguéis
- **DEPLOY** → Site no ar com página "Cursos em breve"

### Fase 2: Cursos Online (Sprints 8-10) 📚

- CRUD de cursos, módulos e aulas
- Pagamentos com Stripe
- Área do aluno com progresso
- Atualização do deploy

## Estimativa de Tempo

- **Total:** 10 semanas
- **Carga sugerida:** ~15-20h por semana

## Arquivos de Sprint

### Fase 1: MVP - Kits (Site no ar!)

- [Sprint 1 - Configuração Inicial](./sprint_1.md) ✅
- [Sprint 2 - Banco de Dados](./sprint_2.md)
- [Sprint 3 - Autenticação](./sprint_3.md)
- [Sprint 4 - CRUD de Kits](./sprint_4.md)
- [Sprint 5 - Painel Admin (Kits)](./sprint_5.md)
- [Sprint 6 - Sistema de Aluguéis](./sprint_6.md)
- [Sprint 7 - Deploy MVP](./sprint_7.md)

### Fase 2: Cursos Online

- [Sprint 8 - CRUD de Cursos](./sprint_8.md)
- [Sprint 9 - Pagamentos + Área do Aluno](./sprint_9.md)
- [Sprint 10 - Finalização](./sprint_10.md)

## Funcionalidades Futuras (Pós-MVP)

- [ ] Calendário visual de aluguéis
- [ ] Cupons de desconto
- [ ] Certificados de conclusão de cursos
- [ ] Blog para SEO
- [ ] App mobile (React Native)
- [ ] Sistema de afiliados
- [ ] Notificações por WhatsApp
