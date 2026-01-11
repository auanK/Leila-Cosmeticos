# Frontend Leila Cosméticos

Frontend desenvolvido em React com TypeScript para a plataforma de e-commerce **Leila Cosméticos**. O projeto utiliza Vite para desenvolvimento ágil e segue uma arquitetura moderna baseada em componentes funcionais e hooks.

**Repositório:** [github.com/auanK/Leila-Cosmeticos](https://github.com/auanK/Leila-Cosmeticos)

## Tecnologias

- **React** (v19) & **Vite**
- **TypeScript** (Tipagem estática e segurança)
- **React Router DOM** (Roteamento SPA)
- **Context API** (Gerenciamento de estado global)
- **ESLint** (Qualidade de código)

## Pré-requisitos

- Node.js (v18+ recomendado)
- Backend da API rodando localmente (padrão: <http://localhost:3000>)

## Instalação e Execução

- **Clone o repositório:**

  ```bash
  git clone https://github.com/auanK/Leila-Cosmeticos
  cd frontend
  ```

- **Instale as dependências:**

  ```bash
  npm install
  ```

- Configuração do Banco de Dados:

- **Execute a aplicação:**
  ```bash
  npm run dev
  ```

## Estrutura do Projeto

A organização foi pensada para facilitar a manutenção e escalabilidade:

- **src/components/**
  - Componentes visuais isolados e reutilizáveis (ex: Header, Sidebar, Icons).
  - _Objetivo:_ Manter a UI modular e evitar repetição de código.
- **src/pages/**
  - Páginas principais que correspondem às rotas (ex: Home, ProductListing, Cart).
  - _Objetivo:_ Separar claramente as visões acessíveis por URL.
- **src/hooks/**
  - Lógica de negócios personalizada (ex: useCart, useAddresses).
  - _Objetivo:_ Abstrair regras de negócio complexas para manter os componentes visuais limpos.
- **src/contexts/**
  - Provedores de estado global (ex: AuthContext).
  - _Objetivo:_ Gerenciar dados compartilhados (sessão do usuário, carrinho) acessíveis em toda a árvore.
- **src/services/**
  - Configuração de API e requisições HTTP.
  - _Objetivo:_ Centralizar a comunicação com o Backend.

## Funcionalidades

- **Loja Virtual:** Catálogo completo, busca inteligente e filtros.
- **Carrinho e Checkout:** Fluxo de compra fluido e cálculo em tempo real.
- **Painel do Cliente:** Histórico de pedidos, endereços e wishlist.
- **Painel Administrativo:** Gestão completa de produtos e categorias.
