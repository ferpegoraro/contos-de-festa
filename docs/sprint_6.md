# Sprint 6 - Sistema de Aluguéis (Rentals)

**Período:** Semana 6  
**Foco:** Controle de aluguéis de kits

## Tarefas

### Backend - Rotas de Aluguéis

- [ ] `GET /rentals` - Listar aluguéis (admin)
- [ ] `GET /rentals/:id` - Detalhes do aluguel (admin)
- [ ] `POST /rentals` - Criar aluguel (admin)
- [ ] `PUT /rentals/:id` - Atualizar aluguel (admin)
- [ ] `PUT /rentals/:id/status` - Alterar status (PENDING → PAID → RETURNED)
- [ ] `DELETE /rentals/:id` - Cancelar aluguel (admin)

### Backend - Estrutura SOLID

```
api/src/
├── http/controllers/
│   └── rentals/
│       ├── create-rental.controller.ts
│       ├── list-rentals.controller.ts
│       ├── get-rental.controller.ts
│       ├── update-rental.controller.ts
│       └── update-rental-status.controller.ts
├── use-cases/
│   └── rentals/
│       ├── create-rental.ts
│       ├── list-rentals.ts
│       └── ...
├── repositories/
│   └── rentals-repository.ts
```

### Frontend - Gestão de Aluguéis

- [ ] Página `/admin/rentals` - Lista de aluguéis
  - [ ] Tabela com cliente, kit, data evento, status
  - [ ] Filtros por status e data
  - [ ] Busca por nome do cliente
- [ ] Página `/admin/rentals/new` - Criar aluguel
  - [ ] Selecionar kit (apenas disponíveis)
  - [ ] Dados do cliente (nome, telefone, email)
  - [ ] Data do evento e data de devolução
  - [ ] Valor total e observações
- [ ] Página `/admin/rentals/[id]` - Detalhes do aluguel
  - [ ] Botões para alterar status
  - [ ] Histórico de alterações

### Lógica de Negócio

- [ ] Ao criar aluguel: kit muda para RENTED
- [ ] Ao devolver: kit volta para AVAILABLE
- [ ] Validar conflito de datas (kit já alugado)
- [ ] Notificação de aluguéis próximos (opcional)

### Calendário (Opcional)

- [ ] Visualização de calendário com aluguéis
- [ ] Arrastar e soltar para reagendar

## Critérios de Conclusão

- [ ] CRUD de aluguéis funcionando
- [ ] Status do kit atualizado automaticamente
- [ ] Validação de conflito de datas
- [ ] Admin consegue gerenciar todos os aluguéis
