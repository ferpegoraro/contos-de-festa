# Sprint 2 - Banco de Dados e Modelagem

**Período:** Semana 2  
**Foco:** Estrutura de dados e Prisma

## Tarefas

- [ ] Instalar e configurar PostgreSQL (local ou Docker)
- [ ] Instalar Prisma ORM no projeto
- [ ] Criar schema do Prisma com modelos:
  - [ ] `User` (id, nome, email, senha, role, createdAt)
  - [ ] `Kit` (id, nome, descricao, preco, imagens, disponivel)
  - [ ] `Curso` (id, titulo, descricao, preco, thumbnail)
  - [ ] `Modulo` (id, cursoId, titulo, ordem)
  - [ ] `Aula` (id, moduloId, titulo, videoUrl, ordem)
  - [ ] `Compra` (id, usuarioId, cursoId, status, createdAt)
- [ ] Rodar migrations iniciais (`prisma migrate dev`)
- [ ] Criar seed com dados de exemplo para testes
- [ ] Integrar Prisma Client no Fastify como plugin
- [ ] Testar conexão com banco via endpoint de health

## Critérios de Conclusão

- [ ] Banco rodando e acessível
- [ ] Migrations aplicadas sem erros
- [ ] Seed populando dados de teste
