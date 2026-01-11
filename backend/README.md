# Backend Leila Cosméticos

Backend desenvolvido em Node.js para a plataforma de e-commerce **Leila Cosméticos**. A API gerencia usuários, produtos, categorias, carrinho de compras, pedidos, endereços, avaliações e lista de desejos.

## Tecnologias

- **Node.js** & **Express**
- **PostgreSQL** (Banco de dados relacional)
- **node-postgres (pg)** (Driver de conexão)
- **JWT (JsonWebToken)** (Autenticação)
- **BcryptJS** (Hashing de senhas)
- **Cors** & **Dotenv**

## Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL instalado e rodando

## Instalação e Configuração

- **Clone o repositório:**

  ```bash
  git clone https://github.com/auanK/Leila-Cosmeticos
  cd backend
  ```

- **Instale as dependências:**

  ```bash
  npm install
  ```

- Configure as Variáveis de Ambiente:  
   Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

  ```bash
  PORT=3000
  DB_USER=postgres
  DB_HOST=localhost
  DB_NAME=leila_cosmeticos
  DB_PASSWORD=sua_senha
  DB_PORT=5432
  JWT_SECRET=segredo_jwt
  ```

- Configuração do Banco de Dados:  
   Certifique-se de criar o banco de dados leila_cosmeticos contido no arquivo init.sql.

- **Execute a aplicação:**
  ```bash
  npm start
  ```

## Documentação da API

A URL base da API é: <http://localhost:3000/api>

### Autenticação

| **Método** | **Rota**       | **Descrição**                              |
| ---------- | -------------- | ------------------------------------------ |
| POST       | /auth/register | Cria uma nova conta de usuário.            |
| POST       | /auth/login    | Autentica o usuário e retorna o Token JWT. |

**Exemplo Body (Login):**

```bash
{
"email": "<usuario@email.com>",
"password": "123"
}
```

### Produtos e Categorias

| **Método** | **Rota**              | **Autenticação** | **Descrição**                                             |
| ---------- | --------------------- | ---------------- | --------------------------------------------------------- |
| GET        | /categories           | Pública          | Lista todas as categorias.                                |
| POST       | /categories           | **Admin**        | Cria uma nova categoria.                                  |
| GET        | /products             | Pública          | Lista produtos (Aceita Query params: search, categoryId). |
| GET        | /products/:id         | Pública          | Detalhes de um produto específico.                        |
| GET        | /products/:id/related | Pública          | Lista produtos relacionados.                              |
| POST       | /products             | **Admin**        | Cria um novo produto.                                     |
| GET        | /products/:id/reviews | Pública          | Lista avaliações de um produto.                           |
| POST       | /products/:id/reviews | **User**         | Adiciona uma avaliação (Requer compra prévia).            |

### Carrinho de Compras

Todas as rotas abaixo requerem Header Authorization: Bearer &lt;token&gt;.

| **Método** | **Rota**           | **Descrição**                                 |
| ---------- | ------------------ | --------------------------------------------- |
| GET        | /cart              | Retorna o carrinho atual do usuário e totais. |
| POST       | /cart/add          | Adiciona item ao carrinho.                    |
| PUT        | /cart/item/:itemId | Atualiza quantidade de um item.               |
| DELETE     | /cart/item/:itemId | Remove um item do carrinho.                   |

**Exemplo Body (Adicionar ao Carrinho):**

```bash
{
"productId": 10,
"quantity": 2
}
```

### Pedidos e Checkout

Todas as rotas abaixo requerem autenticação.

| **Método** | **Rota**  | **Descrição**                                   |
| ---------- | --------- | ----------------------------------------------- |
| POST       | /checkout | Finaliza a compra do carrinho ou de item único. |
| GET        | /orders   | Histórico de pedidos do usuário.                |

**Exemplo Body (Checkout):**

```bash
{
"addressId": 5,
"productId": null,
"quantity": 0
// Se productId for null, processa o carrinho todo.
}
```

### Endereços

Todas as rotas abaixo requerem autenticação.

| **Método** | **Rota**       | **Descrição**               |
| ---------- | -------------- | --------------------------- |
| GET        | /addresses     | Lista endereços do usuário. |
| POST       | /addresses     | Cadastra novo endereço.     |
| PUT        | /addresses/:id | Atualiza um endereço.       |
| DELETE     | /addresses/:id | Remove um endereço.         |

### Wishlist

Todas as rotas abaixo requerem autenticação.

| **Método** | **Rota**             | **Descrição**                |
| ---------- | -------------------- | ---------------------------- |
| GET        | /wishlist            | Lista produtos na wishlist.  |
| POST       | /wishlist            | Adiciona produto à wishlist. |
| DELETE     | /wishlist/:productId | Remove produto da wishlist.  |

### Perfil do Usuário

Todas as rotas abaixo requerem autenticação.

| **Método** | **Rota**    | **Descrição**                         |
| ---------- | ----------- | ------------------------------------- |
| GET        | /users/me   | Dados do usuário logado.              |
| PUT        | /users/me   | Atualiza dados do perfil.             |
| GET        | /reviews/me | Lista avaliações feitas pelo usuário. |
