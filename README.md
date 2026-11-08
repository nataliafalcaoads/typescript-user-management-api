
# User Management API

API REST para gerenciamento de usuários, desenvolvida
com Node.js, TypeScript, Express, Prisma e PostgreSQL.

O projeto implementa cadastro, autenticação JWT,
consulta, atualização, exclusão e alteração de senha,
com validação de dados e controle de acesso.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod
- Bcrypt
- JSON Web Token (JWT)
- Docker Compose

## Funcionalidades

- Cadastro de usuários
- Autenticação com e-mail e senha
- Geração de JWT
- Listagem de usuários com paginação
- Consulta individual
- Atualização de nome e e-mail
- Exclusão de conta
- Alteração de senha
- Proteção de rotas autenticadas
- Controle de acesso à própria conta
- Tratamento centralizado de erros
- Testes automatizados

## Pré-requisitos

- Node.js e npm
- Docker com Docker Compose
- PostgreSQL disponível

## Instalação

Clone o repositório e acesse a pasta do projeto.

Instale as dependências:

```bash
npm ci
```

Crie seu arquivo de ambiente:

```bash
cp .env.example .env
```

Configure DATABASE_URL e JWT_SECRET no .env.

## Banco de dados

Configure o PostgreSQL conforme as credenciais
definidas no arquivo .env.

Para iniciar o ambiente Docker configurado no projeto:

```bash
docker compose up -d
```

Aplique as migrations:

```bash
npx prisma migrate deploy
```

## Compilação

Para gerar o Prisma Client e compilar o TypeScript:

```bash
npm run build
```

## Executar a aplicação

Em desenvolvimento:

```bash
npm run dev
```

A API utiliza a porta 3000 na configuração atual.

Para executar a versão compilada:

```bash
npm start
```

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /health | Verificar funcionamento da API |
| POST | /users | Cadastrar usuário |
| POST | /auth/login | Realizar login |
| GET | /users | Listar usuários com paginação |
| GET | /users/:id | Consultar a própria conta |
| PUT | /users/:id | Atualizar a própria conta |
| DELETE | /users/:id | Excluir a própria conta |
| PATCH | /users/me/password | Alterar a própria senha |

As rotas protegidas exigem o cabeçalho:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

## Segurança

- Senhas armazenadas com hash Bcrypt
- Validação de dados utilizando Zod
- Autenticação por JWT
- Verificação de acesso à própria conta
- Tratamento de credenciais inválidas
- Proteção contra acesso sem autenticação
- Respostas públicas sem hash de senha
- Configurações sensíveis fora do Git

## Testes automatizados

O projeto utiliza o test runner nativo do Node.js.

Os testes verificam:

- Health check
- Bloqueio de acesso sem JWT
- Rejeição de token inválido
- Proteção das rotas de consulta
- Proteção das rotas de atualização
- Proteção das rotas de exclusão
- Proteção da alteração de senha
- Autorização com JWT válido

Para executar os testes, mantenha a API funcionando.

Os testes autenticados também exigem as variáveis
TEST_USER_EMAIL e TEST_USER_PASSWORD, referentes
a uma conta de teste existente.

Execute:

```bash
npm test
```

Na última execução local, 10 testes foram aprovados.

## Estrutura do projeto

```text
src/
├── lib/
├── middlewares/
├── modules/
│   ├── auth/
│   └── users/
├── scripts/
├── app.ts
└── server.ts

prisma/
├── migrations/
└── schema.prisma

tests/
├── authenticated.test.mjs
└── security.test.mjs
```

## Observações

O arquivo .env não deve ser publicado.

Utilize .env.example como referência para
configurar o ambiente local.

O Prisma Client é gerado automaticamente
durante o comando npm run build.
