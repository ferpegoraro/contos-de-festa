# Sprint 6 - Deploy + Polimento

**Período:** Semana 6  
**Foco:** Colocar o site no ar e polir a experiência

## Tarefas

### Deploy - Frontend (Vercel)

- [ ] Criar projeto na Vercel conectado ao repositório
- [ ] Configurar variáveis de ambiente (URL da API, número do WhatsApp)
- [ ] Configurar domínio personalizado (se tiver)
- [ ] Testar build de produção

### Deploy - Backend (Railway ou Render)

- [ ] Criar projeto no serviço escolhido
- [ ] Configurar PostgreSQL em produção
- [ ] Configurar variáveis de ambiente (DATABASE_URL, JWT_SECRET, ADMIN_SECRET_KEY, Cloudinary)
- [ ] Rodar migrations no banco de produção
- [ ] Criar primeiro usuário admin usando a página de registro + chave secreta

### Configurações de Produção

- [ ] Configurar CORS para aceitar apenas o domínio do frontend
- [ ] Garantir HTTPS
- [ ] Configurar Cloudinary em produção

### Testes Finais

- [ ] Testar registro de admin com chave secreta
- [ ] Testar login admin
- [ ] Testar criar/editar/excluir kits com fotos
- [ ] Testar catálogo público (filtros, busca, paginação)
- [ ] Testar fluxo completo: escolher kits → carrinho → WhatsApp
- [ ] Testar em mobile (iOS e Android)

### Polimento

- [ ] Loading states em botões e páginas
- [ ] Mensagens de erro amigáveis (não mostrar erros técnicos)
- [ ] Responsividade em todas as telas
- [ ] SEO básico: meta tags, Open Graph, título e descrição por página
- [ ] Favicon e ícones
- [ ] Página 404 personalizada

### Documentação

- [ ] README atualizado com instruções de setup do projeto
- [ ] Guia simples para a proprietária (como fazer login, adicionar kits, subir fotos)

## Critérios de Conclusão

- [ ] Site acessível via URL pública
- [ ] API respondendo em produção
- [ ] Admin consegue gerenciar kits e fotos
- [ ] Catálogo público funcionando com WhatsApp
- [ ] Site bonito e funcional em desktop e mobile
- [ ] 🎉 **SITE NO AR!**
