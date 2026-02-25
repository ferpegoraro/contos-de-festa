# Sprint 9 - Pagamentos + Área do Aluno

**Período:** Semana 9  
**Foco:** Pagamentos com Stripe e área do aluno

> **Fase 2:** Continuação dos cursos online.

## Tarefas

### Backend - Pagamentos (Stripe)

- [ ] Criar conta Stripe e obter chaves de API
- [ ] Instalar SDK do Stripe: `npm install stripe`
- [ ] `POST /checkout/session` - Criar sessão de checkout
- [ ] `POST /webhooks/stripe` - Receber confirmação de pagamento
- [ ] `GET /orders/my` - Listar compras do usuário

### Backend - Área do Aluno

- [ ] `GET /my/courses` - Listar cursos comprados
- [ ] `GET /my/courses/:id` - Detalhes do curso comprado
- [ ] `PUT /progress/:lessonId` - Salvar progresso da aula
- [ ] `GET /progress/:courseId` - Obter progresso do curso

### Frontend - Checkout

- [ ] Botão "Comprar" no curso
- [ ] Redirecionamento para checkout Stripe
- [ ] Página de sucesso (`/checkout/success`)
- [ ] Página de cancelamento (`/checkout/cancel`)

### Frontend - Área do Usuário

- [ ] Página "Minha Conta" (`/account`)
- [ ] Página "Meus Cursos" (`/my-courses`)
  - [ ] Listar cursos comprados
  - [ ] Mostrar progresso (%)
  - [ ] Botão para continuar

### Frontend - Player de Aulas

- [ ] Página de assistir aula (`/courses/[slug]/lesson/[lessonId]`)
  - [ ] Player de vídeo (YouTube/Vimeo)
  - [ ] Navegação entre aulas
  - [ ] Marcar aula como concluída
  - [ ] Progresso salvo automaticamente

### Bônus

- [ ] Integrar PIX via Stripe ou Mercado Pago

## Critérios de Conclusão

- [ ] Pagamento funcionando (modo sandbox)
- [ ] Usuário acessa cursos comprados
- [ ] Progresso sendo salvo e exibido
- [ ] Player de vídeo funcionando
