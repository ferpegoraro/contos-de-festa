# Sprint 6 - Pagamentos (Stripe + PIX)

**Período:** Semana 6  
**Foco:** Integração de pagamentos

## Tarefas

- [ ] Criar conta Stripe e obter chaves de API
- [ ] Instalar SDK do Stripe no backend
- [ ] Implementar rotas de pagamento:
  - [ ] `POST /api/checkout/criar-sessao` - Criar sessão de checkout Stripe
  - [ ] `POST /api/webhook/stripe` - Receber confirmação de pagamento
  - [ ] `GET /api/compras/minhas` - Listar compras do usuário
- [ ] Configurar webhook do Stripe para confirmar pagamentos
- [ ] Implementar lógica de liberação de acesso ao curso após pagamento
- [ ] No front-end:
  - [ ] Botão "Comprar" no curso redirecionando para checkout
  - [ ] Página de sucesso após pagamento
  - [ ] Página de erro/cancelamento
- [ ] **Bônus:** Integrar PIX via Stripe ou gateway brasileiro (Mercado Pago)
- [ ] Testar fluxo completo em modo sandbox

## Critérios de Conclusão

- [ ] Pagamento teste funcionando no Stripe
- [ ] Webhook confirmando e liberando acesso
- [ ] Usuário vê curso comprado na sua conta
