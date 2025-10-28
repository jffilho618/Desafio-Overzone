# Gerenciador de Estoque Básico

Sistema simples para gerenciar estoque de produtos, desenvolvido como parte do Desafio Técnico da Overzone.

## 🚀 Tecnologias Utilizadas

- **Next.js 16** - Framework React com roteamento automático
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário para estilização

## 📋 Funcionalidades Implementadas

### Requisitos Obrigatórios
- ✅ **Criar produto** - Adicionar produtos com nome, descrição, quantidade e preço
- ✅ **Listar produtos** - Visualizar todos os produtos cadastrados em uma tabela
- ✅ **Deletar produto** - Remover produtos com confirmação de exclusão

### Diferenciais Implementados
- ✅ **Campo de descrição** - Descrição detalhada para cada produto
- ✅ **Editar produto** - Atualizar informações de produtos existentes
- ✅ **Controle de quantidade** - Botões +/- para aumentar/diminuir estoque diretamente na tabela
- ✅ **Validação de erros** - Tratamento de produtos duplicados, campos vazios e valores inválidos
- ✅ **Interface estilizada** - Design limpo e responsivo com Tailwind CSS
- ✅ **Confirmação de exclusão** - Modal de confirmação antes de remover produto completamente
- ✅ **Valor total do estoque** - Cálculo automático do valor total
- ✅ **Código em português** - Todo código, comentários e funções em pt-BR para melhor legibilidade
- ✅ **Commits claros** - Versionamento com mensagens descritivas

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── FormularioProduto.tsx    # Formulário para criar/editar produtos
│   ├── ListaProdutos.tsx        # Tabela de listagem de produtos
│   └── DialogoConfirmacao.tsx   # Modal de confirmação de remoção
├── pages/
│   ├── index.tsx                # Página principal da aplicação
│   └── api/                     # Rotas de API (para futuras implementações)
└── types/
    └── product.ts               # Interface TypeScript para Produto
```

## 💻 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd desafio-overzone
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador

### Outros Comandos

```bash
npm run build    # Gera build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
```

## 🎯 Como Usar a Aplicação

1. **Adicionar Produto**: Preencha o formulário com nome, descrição, quantidade e preço, e clique em "Adicionar"
2. **Visualizar Descrição**: Passe o mouse sobre a descrição truncada para ver o texto completo
3. **Aumentar Quantidade**: Clique no botão **+** (verde) para adicionar unidades ao estoque
4. **Diminuir Quantidade**: Clique no botão **-** (cinza) para remover unidades do estoque
   - Se a quantidade for 1, abrirá uma confirmação para remover o produto completamente
5. **Editar Produto**: Clique no botão "Editar" para alterar nome, descrição, quantidade ou preço
6. **Remover Produto**: Clique no botão "Remover" para deletar completamente o produto (com confirmação)
7. **Visualizar Estoque**: A tabela mostra todos os produtos e o valor total do estoque

## 📝 Decisões Técnicas

### Por que Next.js?
- **Roteamento automático**: Sistema de rotas baseado em arquivos
- **API Routes**: Possibilidade de criar backend na mesma aplicação
- **Performance**: Otimizações automáticas de imagens e recursos
- **Experiência de desenvolvimento**: Hot reload e TypeScript nativo

### Estrutura de Dados
- **Armazenamento em memória**: Uso de `useState` para ETAPA 1 (front-end)
- **ID único**: Gerado com `Date.now().toString()` para simplicidade
- **Validações**: Verificação de produtos duplicados e valores inválidos
- **Interface Produto**: `id`, `nome`, `descricao`, `quantidade`, `preco`
- **Código em Português**: Nomes de variáveis, funções e comentários em pt-BR

### Estilização
- **Tailwind CSS**: Classes utilitárias para desenvolvimento rápido
- **Design responsivo**: Funciona em desktop e mobile
- **Feedback visual**: Estados de hover, erros em vermelho, confirmações

## 🔄 Etapas do Desenvolvimento

- [x] **ETAPA 1**: Front-end completo com operações em memória (estado React)
- [ ] **ETAPA 2**: Construção do banco de dados (SQLite/PostgreSQL)
- [ ] **ETAPA 3**: Construção do back-end (API Routes)
- [ ] **ETAPA 4**: Testes automatizados

## 📧 Contato

Desenvolvido para o Desafio Técnico da Overzone.
