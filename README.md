# RPG Game - V2

> **Projeto reconstruído com NestJS (Backend) + React Native (Frontend) + DDD + SOLID + Clean Architecture + Tailwind CSS**

Um RPG de turnos com estilo de tabuleiro, template de livro, com IA generativa para auto-controle.

## 🚀 Novidades da V2

- **Backend**: NestJS com TypeScript, DDD, SOLID, Clean Architecture
- **Frontend**: React Native com TypeScript e Tailwind CSS
- **Banco de Dados**: PostgreSQL com Prisma ORM (Schema Normalizado)
- **Autenticação**: JWT com Guards e Strategies
- **Arquitetura**: Separação clara entre Domain, Application, Infrastructure e Presentation layers

## 📁 Estrutura do Projeto

```
projeto_rpg/
├── backend/                    # Backend API (NestJS)
│   ├── src/
│   │   ├── core/               # Core Module (Prisma)
│   │   │   └── prisma/
│   │   │       ├── prisma.module.ts
│   │   │       └── prisma.service.ts
│   │   │
│   │   ├── modules/            # Feature Modules
│   │   │   ├── auth/           # Authentication
│   │   │   │   ├── controllers/
│   │   │   │   ├── dtos/
│   │   │   │   ├── guards/
│   │   │   │   ├── services/
│   │   │   │   └── strategies/
│   │   │   │
│   │   │   ├── users/          # User Management
│   │   │   │   ├── controllers/
│   │   │   │   ├── dtos/
│   │   │   │   └── services/
│   │   │   │
│   │   │   └── characters/     # Character Management
│   │   │       ├── controllers/
│   │   │       ├── dtos/
│   │   │       └── services/
│   │   │
│   │   └── app.module.ts       # Root Module
│   │
│   ├── prisma/               # Database
│   │   ├── schema.prisma       # Normalized Schema
│   │   └── seed.ts            # Seed Data
│   │
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Frontend Mobile (React Native)
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── screens/          # App Screens
│   │   ├── services/         # API Services
│   │   ├── store/            # Redux Store
│   │   ├── navigation/       # Navigation
│   │   ├── types/            # TypeScript Types
│   │   ├── styles/           # Tailwind Theme
│   │   └── App.tsx
│   │
│   ├── Dockerfile
│   ├── app.json
│   └── package.json
│
├── docker-compose.yml         # PostgreSQL + Backend
├── .gitignore
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework**: NestJS 10
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma (com schema normalizado)
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
├─────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│              (Use Cases, Application Services)             │
├─────────────────────────────────────────────────────────┤
│                      Domain Layer                           │
│              (Entities, Value Objects, Domain Services)    │
├─────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                     │
│              (Repositories, External Services, DB)         │
└─────────────────────────────────────────────────────────┘
```

### Principais Padrões Aplicados

| **Padrão/Princípio** | **Aplicação** | **Benefício** |
|----------------------|---------------|---------------|
| **Repository** | `PrismaService` | Abstração do acesso a dados |
| **Service** | `AuthService`, `UsersService` | Lógica de negócios centralizada |
| **Strategy** | `JwtStrategy` | Estratégia de autenticação |
| **Guard** | `JwtAuthGuard` | Proteção de rotas |
| **DTO** | `LoginDto`, `RegisterDto` | Transferência de dados tipada |
| **Dependency Injection** | NestJS DI | Injeção de dependências automática |
| **Single Responsibility** | Cada classe tem uma responsabilidade | Código mantível |
| **Open/Closed** | Interfaces extensíveis | Flexibilidade |
| **Liskov Substitution** | Subtipos substitúveis | Consistência |
| **Interface Segregation** | Interfaces específicas | Clareza |
| **Dependency Inversion** | Dependência de abstrações | Desacoplamento |

## 📊 Normalização de Banco de Dados

O schema do Prisma segue as **Formas Normais** para evitar redundância e garantir integridade:

### **1FN (Primeira Forma Normal)**
- ✅ Todos os atributos são atômicos
- ✅ Nenhum grupo repetitivo

### **2FN (Segunda Forma Normal)**
- ✅ Todas as tabelas estão na 1FN
- ✅ Todos os atributos não-chave dependem da chave primária completa
- ✅ Exemplo: `Race`, `CharacterClass` são tabelas separadas

### **3FN (Terceira Forma Normal)**
- ✅ Todas as tabelas estão na 2FN
- ✅ Nenhum atributo não-chave depende de outro atributo não-chave
- ✅ Exemplo: `InventoryItem` (tabela de junção) resolve relacionamento N:N

### **Tabelas de Junção (N:N)**
- `InventoryItem` (Inventory ↔ Item)
- `AvatarSkill` (Avatar ↔ Skill)
- `ClassSkill` (CharacterClass ↔ Skill)
- `QuestReward` (Quest ↔ Reward)
- `MonsterDrop` (Monster ↔ Item)
- `RecipeIngredient` (CraftingRecipe ↔ Item)

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

| **Método** | **Endpoint** | **Descrição** | **Auth** |
|------------|-------------|---------------|----------|
| POST | `/auth/register` | Criar novo usuário | ❌ |
| POST | `/auth/login` | Login de usuário | ❌ |
| POST | `/auth/refresh` | Refresh do token JWT | ✅ |

### Usuários

| **Método** | **Endpoint** | **Descrição** | **Auth** |
|------------|-------------|---------------|----------|
| GET | `/users/me` | Obter perfil do usuário logado | ✅ |
| GET | `/users/:id` | Obter usuário por ID | ✅ |
| GET | `/users` | Listar todos os usuários | ✅ |
| PUT | `/users/:id` | Atualizar usuário | ✅ |
| DELETE | `/users/:id` | Deletar usuário | ✅ |

### Personagens (Avatar)

| **Método** | **Endpoint** | **Descrição** | **Auth** |
|------------|-------------|---------------|----------|
| GET | `/characters/me` | Obter avatar do usuário logado | ✅ |
| GET | `/characters/:id` | Obter avatar por ID | ✅ |
| PUT | `/characters/:id` | Atualizar avatar | ✅ |
| PUT | `/characters/:id/level-up` | Subir de nível | ✅ |
| PUT | `/characters/:id/experience` | Ganhar experiência | ✅ |
| PUT | `/characters/:id/attributes` | Atualizar atributos | ✅ |
| GET | `/characters/races` | Listar todas as raças | ✅ |
| GET | `/characters/classes` | Listar todas as classes | ✅ |

## 🎮 Modelo de Dados (Domain)

### **User** (Usuário)
- `id`: UUID (PK)
- `username`: String (Único)
- `name`: String
- `email`: String (Único)
- `password`: String (Hash)
- `phone`: String? (Opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### **Avatar** (Personagem)
- `id`: UUID (PK)
- `name`: String
- `userId`: String (FK → User, Único)
- `raceId`: Int (FK → Race)
- `classId`: Int? (FK → CharacterClass)
- `level`: Int (Padrão: 1)
- `experience`: Int (Padrão: 0)
- `experienceToNextLevel`: Int (Padrão: 100)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### **Attributes** (Atributos)
- `id`: UUID (PK)
- `avatarId`: String (FK → Avatar, Único)
- `strength`: Int (Padrão: 10)
- `agility`: Int (Padrão: 10)
- `defence`: Int (Padrão: 10)
- `resistance`: Int (Padrão: 10)
- `intelligence`: Int (Padrão: 10)
- `vitality`: Int (Padrão: 10)
- `energyPoints`: Int (Padrão: 100)
- `attributePoints`: Int (Padrão: 5)
- `skillPoints`: Int (Padrão: 5)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### **Race** (Raça)
- `id`: Int (PK, Auto-incremento)
- `name`: String (Único)
- `description`: String
- `strengthModifier`: Int (Padrão: 0)
- `agilityModifier`: Int (Padrão: 0)
- `defenceModifier`: Int (Padrão: 0)
- `resistanceModifier`: Int (Padrão: 0)
- `intelligenceModifier`: Int (Padrão: 0)
- `vitalityModifier`: Int (Padrão: 0)

### **CharacterClass** (Classe)
- `id`: Int (PK, Auto-incremento)
- `name`: String (Único)
- `description`: String
- `baseStrength`: Int (Padrão: 10)
- `baseAgility`: Int (Padrão: 10)
- `baseDefence`: Int (Padrão: 10)
- `baseResistance`: Int (Padrão: 10)
- `baseIntelligence`: Int (Padrão: 10)
- `baseVitality`: Int (Padrão: 10)
- `strengthGrowth`: Float (Padrão: 0.5)
- `agilityGrowth`: Float (Padrão: 0.5)
- `defenceGrowth`: Float (Padrão: 0.5)
- `resistanceGrowth`: Float (Padrão: 0.5)
- `intelligenceGrowth`: Float (Padrão: 0.5)
- `vitalityGrowth`: Float (Padrão: 0.5)

### **Inventory** (Inventário)
- `id`: UUID (PK)
- `avatarId`: String (FK → Avatar, Único)
- `maxWeight`: Int (Padrão: 100)
- `currentWeight`: Int (Padrão: 0)
- `maxSlots`: Int (Padrão: 20)
- `usedSlots`: Int (Padrão: 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### **Item** (Item)
- `id`: UUID (PK)
- `name`: String
- `description`: String?
- `type`: ItemType (Enum)
- `quality`: ItemQuality (Enum)
- `weight`: Int (Padrão: 1)
- `value`: Int (Padrão: 0)
- `strengthBonus`: Int (Padrão: 0)
- `agilityBonus`: Int (Padrão: 0)
- `defenceBonus`: Int (Padrão: 0)
- `resistanceBonus`: Int (Padrão: 0)
- `intelligenceBonus`: Int (Padrão: 0)
- `vitalityBonus`: Int (Padrão: 0)
- `healthBonus`: Int (Padrão: 0)
- `energyBonus`: Int (Padrão: 0)
- `requiredLevel`: Int (Padrão: 1)
- `requiredClassId`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🎨 Interface do Usuário

### Telas Implementadas
- ✅ **LoginScreen** - Tela de login com validação
- ✅ **RegisterScreen** - Cadastro de usuário
- ✅ **HomeScreen** - Dashboard com status
- ✅ **ProfileScreen** - Perfil do usuário com avatar e atributos
- ✅ **AttributesScreen** - Gerenciamento de atributos com pontos
- ✅ **InventoryScreen** - Visualização de itens

### Componentes Reutilizáveis
- Button
- Input
- Card
- Modal

### Navegação
- **AuthNavigator**: Login, Register
- **MainNavigator**: Home, Profile, Attributes, Inventory (Tab Navigation)
- **AppNavigator**: Condicional (Auth ou Main)

## 🔒 Segurança

- ✅ **JWT Authentication** com expiração
- ✅ **Validação** em todos os DTOs (class-validator)
- ✅ **CORS** configurado para o frontend
- ✅ **Hash de senha** com bcrypt
- ✅ **Interceptores** para refresh de token
- ✅ **Helmet** para security headers
- ✅ **Compression** para otimização

## 📊 Banco de Dados

- **Schema refatorado** com relacionamentos corretos
- **Prisma Migrate** para versionamento
- **Normalização** (1FN, 2FN, 3FN)
- **Relacionamentos** 1:1, 1:N, N:N corretamente definidos

## 🎯 Próximos Passos (V3)

- [ ] **Sistema de Inventário completo** (CRUD de itens)
- [ ] **Sistema de Missões (Quests)** com objetivos e recompensas
- [ ] **Sistema de Habilidades** com árvore de habilidades
- [ ] **Sistema de Combate por turnos**
- [ ] **Sistema de Classes** com especializações
- [ ] **Sistema de Raças** com bônus
- [ ] **Sistema de Crafting (Forja)**
- [ ] **Sistema de Amigos**
- [ ] **Chat em tempo real** (WebSocket)
- [ ] **Integração com IA Generativa**
- [ ] **Rate Limiting** para proteção
- [ ] **Caching com Redis** para performance
- [ ] **CQRS** para separação de commands e queries

## 📝 BREAKING CHANGES

⚠️ **Esta é uma reconstrução completa:**
- Estrutura de pastas completamente refatorada
- Backend migrado de Express para NestJS
- Frontend migrado de EJS para React Native
- Nova arquitetura baseada em DDD e Clean Architecture
- Schema do banco de dados normalizado

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License

---

**Versão**: 2.0.0

**Autor**: Breno S. Santos

**Data**: 2026-10-26
