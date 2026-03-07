# Sprint 5 - Site Público + WhatsApp

**Período:** Semana 5  
**Foco:** Landing page, catálogo público e sistema de orçamento via WhatsApp

## Tarefas

### Frontend - Landing Page

- [ ] Hero section com chamada principal e foto de destaque
- [ ] Seção de kits em destaque (marcados como `featured`)
- [ ] Seção de categorias para navegação rápida
- [ ] Seção "Como Funciona" explicando os 3 passos: Escolha → Monte seu Orçamento → WhatsApp
- [ ] Footer com informações de contato e redes sociais
- [ ] Botão de WhatsApp flutuante (presente em todas as páginas)

### Frontend - Catálogo de Kits

- [ ] Página `/kits` - Listagem de todos os kits
  - [ ] Cards com foto principal, nome e preço
  - [ ] Filtro por categoria
  - [ ] Busca por nome
  - [ ] Paginação
- [ ] Página `/kits/[slug]` - Detalhes do kit
  - [ ] Galeria de fotos (carrossel)
  - [ ] Descrição completa, preço e itens inclusos
  - [ ] Botão "Adicionar ao Orçamento"
  - [ ] Sugestão de kits relacionados (mesma categoria)

### Frontend - Sistema de Orçamento via WhatsApp

> O visitante navega pelo site, vai adicionando kits ao "carrinho de orçamento". Quando terminar, clica num botão e abre o WhatsApp com uma mensagem pré-montada listando tudo que escolheu.

- [ ] Componente `QuoteCart` (carrinho de orçamento)
  - [ ] Ícone flutuante mostrando quantos itens foram selecionados
  - [ ] Ao clicar, abre um drawer/modal com a lista dos itens
  - [ ] Botão de remover item
  - [ ] Botão "Enviar Orçamento via WhatsApp"
- [ ] Ao clicar em "Enviar", gerar link do WhatsApp com mensagem tipo:
  - "Olá! Tenho interesse nos seguintes kits: Mesa Branca - R$ 150, Arco Cinza - R$ 80... Gostaria de saber sobre disponibilidade!"
- [ ] Salvar seleção no estado do app (não perder ao navegar entre páginas)
- [ ] Variável de ambiente `NEXT_PUBLIC_WHATSAPP_NUMBER` com número da proprietária

### Componentes Reutilizáveis

- [ ] `KitCard` - Card de kit para listagem
- [ ] `WhatsAppFab` - Botão flutuante do WhatsApp
- [ ] `QuoteCart` - Carrinho de orçamento
- [ ] `ImageCarousel` - Galeria de fotos do kit
- [ ] `CategoryFilter` - Filtro de categorias

### Fluxo Completo do Visitante

```
Acessa o site → Navega pelos kits → Adiciona ao orçamento →
Abre o carrinho → Clica "Enviar via WhatsApp" →
WhatsApp abre com mensagem pronta → Conversa com a proprietária →
Combina valores e paga via PIX
```

## Critérios de Conclusão

- [ ] Landing page bonita e responsiva
- [ ] Catálogo com filtros e busca funcionando
- [ ] Sistema de orçamento via WhatsApp funcionando
- [ ] Botão flutuante do WhatsApp em todas as páginas
- [ ] Site funcional em mobile
