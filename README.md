# RPG Game - V2

> **Projeto migrado para NestJS (Backend) + React Native (Frontend) com DDD, SOLID e Clean Architecture**

Um RPG de turnos com estilo de tabuleiro, template de livro, com IA generativa para auto-controle.

## 🚀 Novidades da V2

- **Backend**: NestJS com TypeScript, DDD, SOLID, Clean Architecture
- **Frontend**: React Native com TypeScript e Tailwind CSS
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT com Guards e Strategies
- **Arquitetura**: Separação clara entre Domain, Application, Infrastructure e Presentation layers

## 📁 Estrutura do Projeto

```
projeto_rpg/
├── backend/                    # Backend API (NestJS)
│   ├── src/
│   │   ├── core/               # Domain Layer (DDD)
│   │   │   ├── entities/       # Entidades de domínio
│   │   │   ├── repositories/   # Interfaces de repositório
│   │   │   ├── services/      # Serviços de domínio
│   │   │   └── types/         # Tipos do domínio
│   │   │
│   │   ├── infrastructure/     # Infrastructure Layer
│   │   │   ├── persistence/    # Persistência (Prisma)
│   │   │   │   └── prisma/
│   │   │   │       ├── repositories/  # Implementações
│   │   │   │       └── prisma.service.ts
│   │   │   ├── auth/          # Autenticação (JWT)
│   │   │   └── config/        # Configurações
│   │   │
│   │   ├── presentation/      # Presentation Layer
│   │   │   ├── controllers/   # Controllers REST
│   │   │   ├── dtos/          # Data Transfer Objects
│   │   │   └── guards/        # Guards de autenticação
│   │   │
│   │   └── app.module.ts     # Módulo raiz
│   │
│   ├── prisma/
│   │   └── schema.prisma     # Schema do banco de dados
│   │
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Frontend Mobile (React Native)
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── screens/           # Telas do app
│   │   ├── services/          # Serviços API
│   │   ├── store/             # Redux Toolkit
│   │   ├── navigation/        # Navegação
│   │   ├── types/             # Tipos TypeScript
│   │   ├── styles/            # Estilos (Tailwind CSS)
│   │   └── App.tsx
│   │
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml         # Configuração Docker
├── .gitignore
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework**: NestJS 10
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT, Passport
- **Validação**: class-validator, class-transformer
- **Documentação**: Swagger/OpenAPI

### Frontend
- **Framework**: React Native (Expo)
- **Linguagem**: TypeScript
- **Estilos**: Tailwind CSS (nativewind)
- **Navegação**: React Navigation
- **Gerenciamento de Estado**: Redux Toolkit + Redux Persist
- **Requisições HTTP**: Axios
- **Armazenamento**: AsyncStorage

### DevOps
- **Containerização**: Docker
- **Orquestração**: Docker Compose

## 🏗️ Arquitetura

### Backend (Clean Architecture + DDD + SOLID)

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│              (Controllers, DTOs, Presenters)              │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│              (Use Cases, Application Services)             │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│              (Entities, Value Objects, Domain Services)    │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                     │
│              (Repositories, External Services, DB)         │
└─────────────────────────────────────────────────────────┘
```

### Principais Padrões Aplicados

| Padrão | Aplicação | Benefício |
|--------|-----------|-----------|
| **Repository** | `IUserRepository`, `UserRepository` | Abstração do acesso a dados |
| **Service** | `UserDomainService` | Lógica de negócios centralizada |
| **Factory** | `PrismaService` | Criação do cliente Prisma |
| **Strategy** | `JwtStrategy` | Estratégia de autenticação |
| **Guard** | `JwtAuthGuard` | Proteção de rotas |
| **DTO** | `CreateUserDto`, `UserResponseDto` | Transferência de dados tipada |
| **Dependency Injection** | NestJS DI | Injeção de dependências automática |

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose
- Expo CLI (para frontend)

### Backend

1. **Instalar dependências:**
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Configurar o banco de dados:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Iniciar o servidor:**
```bash
npm run start:dev
```

O servidor estará disponível em: `http://localhost:3000`

Documentação Swagger: `http://localhost:3000/api`

### Frontend

1. **Instalar dependências:**
```bash
cd frontend
npm install
```

2. **Iniciar o Expo Dev Server:**
```bash
npx expo start
```

3. **Rodar no dispositivo:**
- Android: `npx expo start --android`
- iOS: `npx expo start --ios`
- Web: `npx expo start --web`

### Docker (Desenvolvimento Completo)

1. **Iniciar todos os serviços:**
```bash
docker-compose up -d
```

2. **Acessar:**
- Backend: `http://localhost:3000`
- Frontend Dev Server: `http://localhost:19006`

3. **Parar serviços:**
```bash
docker-compose down
```

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login de usuário |
| POST | `/auth/refresh` | Refresh do token JWT |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|---------------|
| POST | `/users` | Criar novo usuário | ❌ |
| GET | `/users/:id` | Obter usuário por ID | ✅ |
| GET | `/users/me` | Obter perfil do usuário logado | ✅ |
| PUT | `/users/:id` | Atualizar usuário | ✅ |
| DELETE | `/users/:id` | Deletar usuário | ✅ |

### Personagens (Avatar)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|---------------|
| GET | `/avatars/user/:userId` | Obter avatar do usuário | ✅ |
| PUT | `/avatars/:id` | Atualizar avatar | ✅ |

### Atributos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|---------------|
| GET | `/atributos/:avatarId` | Obter atributos do avatar | ✅ |
| PUT | `/atributos/:id` | Atualizar atributos | ✅ |

## 🎮 Funcionalidades Implementadas

### V2 (Atual)
- ✅ Autenticação (Cadastro, Login, Logout)
- ✅ Gerenciamento de Usuários
- ✅ Criação automática de Avatar ao cadastrar
- ✅ Criação automática de Atributos ao cadastrar
- ✅ Sistema de Atributos (Força, Agilidade, etc.)
- ✅ Pontos de Atributo para distribuir
- ✅ Interface com Tailwind CSS
- ✅ Navegação com React Navigation
- ✅ Gerenciamento de Estado com Redux Toolkit
- ✅ Persistência de dados com AsyncStorage

### Planejado para V3
- [ ] Sistema de Inventário completo
- [ ] Sistema de Missões (Quests)
- [ ] Sistema de Habilidades
- [ ] Sistema de Combate por turnos
- [ ] Sistema de Classes
- [ ] Sistema de Raças com bônus
- [ ] Sistema de Itens
- [ ] Sistema de Crafting (Forja)
- [ ] Sistema de Amigos
- [ ] Chat em tempo real
- [ ] Integração com IA Generativa

## 📊 Modelo de Dados

### Usuário (User)
- `id`: UUID
- `username`: String (único)
- `name`: String
- `email`: String (único)
- `password`: String (hash)
- `phone`: String (opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Avatar
- `id`: UUID
- `name`: String
- `race`: RaceType (enum)
- `level`: Integer (padrão: 1)
- `tier`: Integer (padrão: 1)
- `experience`: Integer (padrão: 0)
- `userId`: String (relacionado ao User)

### Atributos
- `id`: UUID
- `strength`: Integer (padrão: 10)
- `agility`: Integer (padrão: 10)
- `defence`: Integer (padrão: 10)
- `resistance`: Integer (padrão: 10)
- `intelligence`: Integer (padrão: 10)
- `vitality`: Integer (padrão: 10)
- `energyPoints`: Integer (padrão: 100)
- `attributePoints`: Integer (padrão: 5)
- `skillPoints`: Integer (padrão: 5)
- `avatarId`: String (relacionado ao Avatar)

### Inventário (Inventory)
- `id`: UUID
- `pesoMax`: Integer (padrão: 100)
- `pesoActual`: Integer (padrão: 0)
- `avatarId`: String (relacionado ao Avatar)

## 🤖 Integração com IA

O projeto foi projetado para integrar com IA generativa para:
- Geração de missões dinâmicas
- Criação de NPCs inteligentes
- Geração de itens únicos
- Narrativa adaptativa
- Balanceamento automático

## 🎨 Interface do Usuário

### Telas Implementadas
- Login
- Cadastro
- Home (Dashboard)
- Perfil
- Atributos
- Inventário
- Criação de Personagem (modal)

### Componentes Reutilizáveis
- Button
- Input
- AttributeCard
- CharacterCard
- InventoryItem

## 🔒 Segurança

- **Autenticação**: JWT com expiração
- **Validação**: class-validator em todos os DTOs
- **CORS**: Configurado para o frontend
- **Rate Limiting**: Recomendado para produção
- **HTTPS**: Recomendado para produção

## 📦 Deploy

### Backend
- **Docker**: Usar o Dockerfile fornecido
- **Railway**: `railway up`
- **Heroku**: Configurar com Node.js buildpack
- **AWS/Azure/GCP**: Usar serviços de container

### Frontend
- **Expo EAS**: `eas build`
- **Firebase App Distribution**: Para testes beta
- **App Store/Google Play**: Para produção

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Versão**: 2.0.0

**Autor**: Breno S. Santos

**Data**: 2026-10-21
