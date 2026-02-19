# Sprint 7 - Área do Usuário

**Período:** Semana 7  
**Foco:** Dashboard e experiência do aluno

## Tarefas

- [ ] Criar página "Minha Conta" (`/minha-conta`):
  - [ ] Dados do perfil (nome, email, foto)
  - [ ] Edição de perfil
  - [ ] Alteração de senha
- [ ] Criar página "Meus Cursos" (`/meus-cursos`):
  - [ ] Listar cursos comprados
  - [ ] Mostrar progresso de cada curso
  - [ ] Botão para continuar de onde parou
- [ ] Implementar sistema de progresso:
  - [ ] Marcar aula como assistida
  - [ ] Salvar progresso no banco (tabela `Progresso`)
  - [ ] Calcular % de conclusão do curso
- [ ] Criar página de assistir aula (`/cursos/[id]/aula/[aulaId]`):
  - [ ] Player de vídeo
  - [ ] Navegação entre aulas
  - [ ] Botão "Próxima aula"
- [ ] Implementar rota `PUT /api/progresso/:aulaId` para salvar progresso

## Critérios de Conclusão

- [ ] Usuário acessa seus cursos comprados
- [ ] Progresso sendo salvo e exibido
- [ ] Navegação entre aulas funcionando
