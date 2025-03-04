# Rick and Morty App

Aplicação full stack que exibe informações sobre os personagens da série Rick and Morty, com sistema de autenticação de usuários.

## Tecnologias Utilizadas

### Backend

- Node.js
- Express.js
- MySQL
- Sequelize (ORM)
- JWT para autenticação
- bcryptjs para criptografia de senhas

### Frontend

- Vue.js 3 (Composition API)
- Vuetify 3 (Framework de UI)
- Vue Router (Roteamento)
- Axios (Requisições HTTP)

### Infraestrutura

- Docker
- Docker Compose

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login
- Alteração de senha
- Proteção de rotas

### Visualização de Personagens

- Listagem de personagens da série Rick and Morty
- Exibição de detalhes como nome, status, espécie e localização
- Paginação para navegar entre os resultados

## Como Executar o Projeto

### Pré-requisitos

- Docker e Docker Compose instalados

### Passos para execução

1. Clone o repositório

```
cd rick-and-morty-app
```

2. Execute o Docker Compose

```
docker-compose up -d

2.1 Caso seu sistema operacional for outro, ou até sua versão de Docker for a partir da v.2 utilize
```

export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker compose up

```

3. Execute a migração do banco de dados
```

docker exec -it backend node src/database/migration.js

```

4. Acesse a aplicação em seu navegador
```

http://localhost:8000

```

## Estrutura do Projeto

```

├── backend/ # API Node.js
│ ├── src/ # Código fonte
│ │ ├── controllers/ # Controladores
│ │ ├── middleware/ # Middlewares
│ │ ├── models/ # Modelos
│ │ ├── database/ # Configuração do banco de dados
│ │ ├── app.js # Configuração Express
│ │ └── server.js # Servidor
│ └── Dockerfile # Configuração Docker
├── frontend/ # Frontend Vue.js
│ ├── src/ # Código fonte
│ │ ├── assets/ # Recursos estáticos
│ │ ├── components/ # Componentes Vue
│ │ ├── services/ # Serviços para API
│ │ ├── views/ # Páginas da aplicação
│ │ ├── App.vue # Componente principal
│ │ └── main.js # Entrada da aplicação
│ ├── public/ # Arquivos públicos
│ └── Dockerfile # Configuração Docker
└── docker-compose.yml # Configuração Docker Compose

```

## Observações

- A aplicação usa autenticação JWT para proteção de rotas
- As senhas são armazenadas criptografadas no banco de dados
- A API de Rick and Morty é acessada pelo backend, que formata os dados e envia para o frontend
- As localizações com valor "unknown" são exibidas como "Desconhecido"
- A aplicação inclui tratamento de erros e feedback visual para o usuário
```
