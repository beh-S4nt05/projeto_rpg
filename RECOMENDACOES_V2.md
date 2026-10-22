# 📋 RECOMENDAÇÕES ADICIONAIS DE MELHORIAS PARA V2

## 🎯 Melhorias de Arquitetura

### 1. **CQRS (Command Query Responsibility Segregation)**
**O que é:** Separação de operações de escrita (Commands) e leitura (Queries).

**Como implementar:**
```typescript
// backend/src/core/commands/
// backend/src/core/queries/
// backend/src/presentation/controllers/command.controller.ts
// backend/src/presentation/controllers/query.controller.ts
```

**Benefícios:**
- Otimização de performance (queries podem usar views, caching, etc.)
- Separação clara de responsabilidades
- Facilidade para implementar Event Sourcing

---

### 2. **Event Sourcing + Event Storming**
**O que é:** Armazenar eventos em vez de estados, permitindo reconstruir o estado a qualquer momento.

**Eventos do RPG:**
```typescript
// Domain Events
class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly timestamp: Date,
  ) {}
}

class LevelUpEvent {
  constructor(
    public readonly avatarId: string,
    public readonly newLevel: number,
    public readonly timestamp: Date,
  ) {}
}

class ItemAcquiredEvent {
  constructor(
    public readonly itemId: string,
    public readonly userId: string,
    public readonly timestamp: Date,
  ) {}
}
```

**Benefícios:**
- Audit trail completo
- Possibilidade de time-travel (ver estado em qualquer momento)
- Fácil de adicionar novas funcionalidades baseadas em eventos

---

### 3. **Hexagonal Architecture (Ports & Adapters)**
**O que é:** Arquitetura que isola o core do aplicativo dos detalhes de implementação.

**Estrutura:**
```
backend/src/
├── core/                      # Domain (Ports)
│   ├── ports/                 # Interfaces (Ports)
│   │   ├── user.repository.ts
│   │   ├── email.service.ts
│   │   └── notification.service.ts
│   └── domain/                # Domain Logic
│
└── infrastructure/            # Adapters
    ├── persistence/           # Database Adapters
    │   └── prisma/
    ├── messaging/             # Message Queue Adapters
    │   └── rabbitmq/
    └── external/              # External Service Adapters
        └── sendgrid/
```

**Benefícios:**
- Core do aplicativo completamente isolado
- Fácil de trocar implementações (ex: Prisma para TypeORM)
- Testabilidade extrema

---

## 🛡️ Melhorias de Segurança

### 1. **Rate Limiting**
**Implementação (NestJS):**
```typescript
// backend/src/infrastructure/security/rate-limit.module.ts
import { Module } from '@nestjs/common';
import { RateLimiterModule } from 'rate-limiter-flexible';

@Module({
  imports: [
    RateLimiterModule.register({
      points: 100, // 100 requests
      duration: 60, // per 60 seconds
    }),
  ],
  exports: [RateLimiterModule],
})
export class SecurityModule {}

// backend/src/infrastructure/security/rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimiterService } from 'rate-limiter-flexible';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimiter: RateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.ip;

    try {
      await this.rateLimiter.consume(key);
      return true;
    } catch {
      throw new Error('Too many requests');
    }
  }
}
```

**Aplicar em controllers:**
```typescript
@UseGuards(RateLimitGuard)
@Controller('auth')
export class AuthController {}
```

---

### 2. **Helmet para Segurança HTTP**
**Implementação:**
```typescript
// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Helmet for security headers
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  }));
  
  await app.listen(3000);
}
```

---

### 3. **CSRF Protection**
**Implementação:**
```typescript
// backend/src/infrastructure/security/csrf.module.ts
import { Module } from '@nestjs/common';
import { CsrfModule } from '@nestjs/csrf';

@Module({
  imports: [
    CsrfModule.forRoot({
      secret: process.env.CSRF_SECRET,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
    }),
  ],
  exports: [CsrfModule],
})
export class SecurityModule {}
```

---

### 4. **Input Sanitization**
**Implementação:**
```typescript
// backend/src/infrastructure/security/sanitization.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as sanitize from 'sanitize-html';

@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return sanitize(value, {
        allowedTags: [],
        allowedAttributes: {},
      });
    }
    return value;
  }
}

// Aplicar globalmente ou em controllers específicos
app.useGlobalPipes(new SanitizationPipe());
```

---

### 5. **Audit Logging**
**Implementação:**
```typescript
// backend/src/infrastructure/logging/audit-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma/prisma.service';

@Injectable()
export class AuditLoggerService {
  private readonly logger = new Logger(AuditLoggerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        metadata: JSON.stringify(metadata),
        timestamp: new Date(),
      },
    });

    this.logger.log(`[${action}] User: ${userId}, Entity: ${entityType}:${entityId}`);
  }
}
```

---

## ⚡ Melhorias de Performance

### 1. **Caching com Redis**
**Implementação:**
```typescript
// backend/src/infrastructure/cache/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 60 * 60, // 1 hour
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
```

**Uso em services:**
```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheManager: Cache,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findById(id);
    if (user) {
      await this.cacheManager.set(cacheKey, user, 300); // 5 minutes
    }
    
    return user;
  }
}
```

---

### 2. **Database Connection Pooling**
**Configuração no Prisma:**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
  pool {
    max_connections = 20
    min_connections = 5
    idle_timeout = 30
  }
}
```

---

### 3. **Pagination e Lazy Loading**
**Implementação:**
```typescript
// backend/src/presentation/dtos/request/pagination.dto.ts
export class PaginationDto {
  page: number = 1;
  limit: number = 20;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' = 'asc';
}

// backend/src/presentation/controllers/user.controller.ts
@Get()
async getAll(
  @Query() pagination: PaginationDto,
): Promise<PaginatedResult<UserResponseDto>> {
  const { page, limit, sortBy, sortOrder } = pagination;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    this.userService.getAll(skip, limit, sortBy, sortOrder),
    this.userService.count(),
  ]);

  return {
    data: users.map((u) => new UserResponseDto(u)),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

---

### 4. **Compression (Gzip)**
**Implementação:**
```typescript
// backend/src/main.ts
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable compression
  app.use(compression());
  
  await app.listen(3000);
}
```

---

## 🎨 Melhorias de Frontend

### 1. **React Query para Gerenciamento de Estado**
**Por que?** Alternativa mais moderna ao Redux para dados de API.

**Implementação:**
```typescript
// frontend/src/services/api/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../auth.service';

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Salvar token e user
    },
    onError: (error) => {
      // Tratar erro
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userService.getProfile,
    retry: 1,
  });
};
```

**Benefícios:**
- Menos boilerplate
- Cache automático
- Retry automático
- Background updates
- Pagination built-in

---

### 2. **Zustand (Alternativa ao Redux)**
**Por que?** Mais simples e performático que Redux.

**Implementação:**
```typescript
// frontend/src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types/domain';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}>()(
  persist(
    (set) => ({
      ...initialState,
      login: (user, token) => set({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
        error: null,
      }),
      logout: () => set(initialState),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
```

**Benefícios:**
- Menos código
- Sem providers
- Mais performático
- Middlewares úteis (persist, devtools)

---

### 3. **React Hook Form + Zod para Validação**
**Por que?** Validação robusta com tipagem forte.

**Implementação:**
```typescript
// frontend/src/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email('Email inválido'),
  password: z.string().min(6),
  co_password: z.string().min(6),
  phone: z.string().optional(),
}).refine((data) => data.password === data.co_password, {
  message: 'As senhas não coincidem',
  path: ['co_password'],
});

// frontend/src/screens/auth/LoginScreen.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/auth.schema';

export const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await authService.login(data);
  });

  return (
    // Form com Controller do react-hook-form
  );
};
```

---

### 4. **Animações com Reanimated**
**Implementação:**
```typescript
// frontend/src/components/common/AnimatedButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

export const AnimatedButton: React.FC<{
  title: string;
  onPress: () => void;
}> = ({ title, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 }),
    );
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        style={tailwind('bg-primary-DEFAULT rounded-lg p-4')}
      >
        <Text style={tailwind('text-text-dark font-bold text-center')}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

---

### 5. **Internationalization (i18n)**
**Implementação:**
```typescript
// frontend/src/i18n/index.ts
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { ptBR } from './locales/pt-BR';
import { enUS } from './locales/en-US';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': ptBR,
      'en-US': enUS,
    },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

// frontend/src/locales/pt-BR.ts
export const ptBR = {
  translation: {
    welcome: 'Bem-vindo',
    login: 'Entrar',
    register: 'Cadastrar',
    username: 'Username',
    password: 'Senha',
    // ...
  },
};

// Uso:
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

<Text>{t('welcome')}</Text>
```

---

### 6. **Theming Avançado com Tailwind**
**Implementação:**
```typescript
// frontend/src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#fefce8',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      DEFAULT: '#FFD700',
    },
    // ...
  },
  fonts: {
    body: 'Poppins-Regular',
    heading: 'Poppins-Bold',
    mono: 'Poppins-Mono',
  },
};

// tailwind.config.js
module.exports = {
  theme: {
    extend: theme,
  },
};
```

---

## 📊 Melhorias de Monitoramento e Analytics

### 1. **Logging Estruturado**
**Implementação (NestJS):**
```typescript
// backend/src/infrastructure/logging/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
      exceptionHandlers: [
        new DailyRotateFile({
          filename: 'logs/exceptions-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug?(message: string) {
    this.logger.debug(message);
  }

  verbose?(message: string) {
    this.logger.verbose(message);
  }
}
```

---

### 2. **Health Checks**
**Implementação:**
```typescript
// backend/src/infrastructure/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint' })
  async check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      () => this.disk.checkStorage('disk_storage', { path: '/', threshold: 500 * 1024 * 1024 }),
    ]);
  }
}
```

---

### 3. **Metrics com Prometheus**
**Implementação:**
```typescript
// backend/src/infrastructure/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'rpg_game_',
        },
      },
    }),
  ],
  exports: [PrometheusModule],
})
export class MetricsModule {}

// backend/src/main.ts
import { PrometheusService } from '@willsoto/nestjs-prometheus';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prometheus = app.get(PrometheusService);
  
  // Enable metrics collection
  prometheus.startCollectingMetrics();
  
  await app.listen(3000);
}
```

---

## 🤖 Melhorias de IA e Automação

### 1. **Integração com OpenAI**
**Implementação:**
```typescript
// backend/src/infrastructure/ai/openai.service.ts
import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateQuest(userId: string, level: number): Promise<string> {
    const prompt = `Crie uma missão para um RPG de nível ${level}. 
    A missão deve ser desafiadora mas justa para o nível. 
    Inclua: título, descrição, objetivo e recompensa. 
    Responda em JSON.`;

    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.data.choices[0].text;
  }

  async generateNPC(name: string, role: string): Promise<string> {
    const prompt = `Crie um NPC para um RPG chamado ${name} que é um ${role}. 
    Inclua: descrição física, personalidade, habilidades e fraquezas. 
    Responda em JSON.`;

    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500,
      temperature: 0.8,
    });

    return response.data.choices[0].text;
  }
}
```

---

### 2. **Sistema de Recomendação**
**Implementação:**
```typescript
// backend/src/core/services/recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository';
import { IAvatarRepository } from '../repositories/avatar.repository';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly avatarRepository: IAvatarRepository,
  ) {}

  async recommendQuests(userId: string): Promise<string[]> {
    const user = await this.userRepository.findById(userId);
    const avatar = await this.avatarRepository.findByUserId(userId);

    if (!avatar) {
      return [];
    }

    // Lógica de recomendação baseada no nível e atributos
    const recommendedQuests = [];

    if (avatar.level < 5) {
      recommendedQuests.push('quest_1', 'quest_2', 'quest_3');
    } else if (avatar.level < 10) {
      recommendedQuests.push('quest_4', 'quest_5', 'quest_6');
    } else {
      recommendedQuests.push('quest_7', 'quest_8', 'quest_9');
    }

    return recommendedQuests;
  }

  async recommendItems(userId: string): Promise<string[]> {
    const avatar = await this.avatarRepository.findByUserId(userId);

    if (!avatar) {
      return [];
    }

    // Recomendar itens baseados na classe e nível
    const recommendedItems = [];

    if (avatar.level >= 5) {
      recommendedItems.push('item_espada_epica', 'item_armadura_forjada');
    }

    return recommendedItems;
  }
}
```

---

## 🎮 Melhorias Específicas para RPG

### 1. **Sistema de Turnos**
**Implementação:**
```typescript
// backend/src/core/entities/combat.entity.ts
export class Combat {
  constructor(
    public readonly id: string,
    public participants: CombatParticipant[],
    public currentTurn: number = 0,
    public status: CombatStatus = CombatStatus.IN_PROGRESS,
    public createdAt: Date = new Date(),
    public turnHistory: CombatTurn[] = [],
  ) {}

  nextTurn(): void {
    this.currentTurn++;
    // Lógica para determinar quem é o próximo a jogar
  }

  async executeAction(participantId: string, action: CombatAction): Promise<CombatTurn> {
    const participant = this.participants.find(p => p.id === participantId);
    if (!participant) {
      throw new Error('Participant not found');
    }

    // Executar ação (ataque, defesa, magia, etc.)
    const turn = new CombatTurn(
      this.currentTurn,
      participantId,
      action,
      new Date(),
    );

    this.turnHistory.push(turn);
    this.nextTurn();

    return turn;
  }
}

export enum CombatStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export class CombatParticipant {
  constructor(
    public readonly id: string,
    public avatarId: string,
    public currentHealth: number,
    public maxHealth: number,
    public currentEnergy: number,
    public maxEnergy: number,
    public initiative: number,
  ) {}
}

export class CombatTurn {
  constructor(
    public readonly turnNumber: number,
    public readonly participantId: string,
    public readonly action: CombatAction,
    public readonly timestamp: Date,
  ) {}
}

export type CombatAction = AttackAction | DefendAction | CastAction | UseItemAction;
```

---

### 2. **Sistema de Classes**
**Implementação:**
```typescript
// backend/src/core/entities/class.entity.ts
export enum CharacterClass {
  WARRIOR = 'Guerreiro',
  MAGE = 'Mago',
  ROGUE = 'Ladino',
  CLERIC = 'Clérigo',
  RANGER = 'Arqueiro',
  PALADIN = 'Paladino',
  BARBARIAN = 'Bárbaro',
  MONK = 'Monge',
  DRUID = 'Druida',
  NECROMANCER = 'Necromante',
}

export class CharacterClassConfig {
  constructor(
    public readonly className: CharacterClass,
    public readonly description: string,
    public readonly baseAttributes: {
      strength: number;
      agility: number;
      defence: number;
      resistance: number;
      intelligence: number;
      vitality: number;
    },
    public readonly growthRates: {
      strength: number;
      agility: number;
      defence: number;
      resistance: number;
      intelligence: number;
      vitality: number;
    },
    public readonly abilities: string[],
    public readonly weaponProficiencies: string[],
    public readonly armorProficiencies: string[],
  ) {}

  getLevelUpBonuses(level: number): {
    strength: number;
    agility: number;
    defence: number;
    resistance: number;
    intelligence: number;
    vitality: number;
  } {
    return {
      strength: Math.floor(level * this.growthRates.strength),
      agility: Math.floor(level * this.growthRates.agility),
      defence: Math.floor(level * this.growthRates.defence),
      resistance: Math.floor(level * this.growthRates.resistance),
      intelligence: Math.floor(level * this.growthRates.intelligence),
      vitality: Math.floor(level * this.growthRates.vitality),
    };
  }
}

// Classes pré-definidas
export const CLASS_CONFIGS: Record<CharacterClass, CharacterClassConfig> = {
  [CharacterClass.WARRIOR]: new CharacterClassConfig(
    CharacterClass.WARRIOR,
    'Especialista em combate corpo a corpo',
    { strength: 15, agility: 10, defence: 15, resistance: 10, intelligence: 5, vitality: 15 },
    { strength: 0.8, agility: 0.4, defence: 0.8, resistance: 0.5, intelligence: 0.2, vitality: 0.8 },
    ['ataque-poderoso', 'defesa-total'],
    ['espadas', 'machados', 'martelos'],
    ['armadura-pesada', 'armadura-media', 'escudos'],
  ),
  [CharacterClass.MAGE]: new CharacterClassConfig(
    CharacterClass.MAGE,
    'Mestre das magias',
    { strength: 5, agility: 10, defence: 5, resistance: 10, intelligence: 15, vitality: 10 },
    { strength: 0.2, agility: 0.4, defence: 0.2, resistance: 0.5, intelligence: 0.8, vitality: 0.4 },
    ['bola-de-fogo', 'escudo-magico', 'teletransporte'],
    ['cajados', 'varinhas'],
    ['armadura-leve', 'roupas'],
  ),
  // ... outras classes
};
```

---

### 3. **Sistema de Habilidades com Árvore**
**Implementação:**
```typescript
// backend/src/core/entities/skill-tree.entity.ts
export class SkillTree {
  constructor(
    public readonly id: string,
    public className: CharacterClass,
    public nodes: SkillTreeNode[],
  ) {}

  getAvailableSkills(level: number, spentPoints: number): SkillTreeNode[] {
    return this.nodes.filter((node) => {
      return node.requiredLevel <= level && node.requiredPoints <= spentPoints;
    });
  }

  canUnlockSkill(skillId: string, level: number, spentPoints: number): boolean {
    const skill = this.nodes.find((n) => n.id === skillId);
    if (!skill) return false;

    return (
      level >= skill.requiredLevel &&
      spentPoints >= skill.requiredPoints &&
      skill.dependencies.every((dep) => this.hasSkill(dep, spentPoints))
    );
  }

  private hasSkill(skillId: string, spentPoints: number): boolean {
    // Verificar se a skill já foi desbloqueada
    return true; // Implementação real
  }
}

export class SkillTreeNode {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly type: SkillType,
    public readonly damage: number | null = null,
    public readonly duration: number | null = null,
    public readonly cooldown: number | null = null,
    public readonly energyCost: number | null = null,
    public readonly requiredLevel: number,
    public readonly requiredPoints: number,
    public readonly dependencies: string[],
    public readonly position: { x: number; y: number },
  ) {}
}

export enum SkillType {
  ACTIVE = 'active',
  PASSIVE = 'passive',
  TOGGLE = 'toggle',
}
```

---

### 4. **Sistema de Crafting (Forja)**
**Implementação:**
```typescript
// backend/src/core/entities/recipe.entity.ts
export class Recipe {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly resultItemId: string,
    public readonly resultQuantity: number,
    public readonly requiredLevel: number,
    public readonly requiredSkill: string,
    public readonly ingredients: RecipeIngredient[],
    public readonly craftingTime: number, // em segundos
    public readonly successRate: number, // 0-1
    public readonly category: CraftingCategory,
  ) {}

  canCraft(userLevel: number, userSkills: string[]): boolean {
    return (
      userLevel >= this.requiredLevel &&
      userSkills.includes(this.requiredSkill)
    );
  }
}

export class RecipeIngredient {
  constructor(
    public readonly itemId: string,
    public readonly quantity: number,
  ) {}
}

export enum CraftingCategory {
  BLACKSMITHING = 'Ferraria',
  TAILORING = 'Alfaiataria',
  ALCHEMY = 'Alquimia',
  ENGINEERING = 'Engenharia',
  COOKING = 'Culinária',
  ENCHANTING = 'Encantamento',
  JEWELCRAFTING = 'Joalheria',
}

// backend/src/core/services/crafting.service.ts
@Injectable()
export class CraftingService {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async craftItem(
    userId: string,
    recipeId: string,
    quantity: number = 1,
  ): Promise<CraftingResult> {
    const recipe = await this.recipeRepository.findById(recipeId);
    const userInventory = await this.inventoryRepository.findByUserId(userId);

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    if (!userInventory) {
      throw new Error('Inventory not found');
    }

    // Verificar se tem os ingredientes
    for (const ingredient of recipe.ingredients) {
      const itemInInventory = userInventory.items.find(
        (i) => i.itemId === ingredient.itemId,
      );
      if (!itemInInventory || itemInInventory.quantity < ingredient.quantity * quantity) {
        throw new Error(`Missing ingredient: ${ingredient.itemId}`);
      }
    }

    // Remover ingredientes
    for (const ingredient of recipe.ingredients) {
      await this.inventoryRepository.removeItem(
        userInventory.id,
        ingredient.itemId,
        ingredient.quantity * quantity,
      );
    }

    // Adicionar item craftado
    await this.inventoryRepository.addItem(
      userInventory.id,
      recipe.resultItemId,
      recipe.resultQuantity * quantity,
    );

    return {
      success: true,
      craftedItemId: recipe.resultItemId,
      quantity: recipe.resultQuantity * quantity,
      experienceGained: recipe.experienceGained || 0,
    };
  }
}

export interface CraftingResult {
  success: boolean;
  craftedItemId: string;
  quantity: number;
  experienceGained: number;
}
```

---

## 📊 Resumo de Prioridades

### Alta Prioridade (V2.1)
1. **CQRS** - Para separar commands e queries
2. **Rate Limiting** - Para proteção contra ataques
3. **Caching com Redis** - Para melhorar performance
4. **React Query** - Para simplificar gerenciamento de estado no frontend
5. **Zustand** - Alternativa mais simples ao Redux

### Média Prioridade (V2.2)
1. **Event Sourcing** - Para audit trail
2. **Hexagonal Architecture** - Para isolamento total do domain
3. **Logging Estruturado** - Para monitoramento
4. **Health Checks** - Para verificar status do sistema
5. **React Hook Form + Zod** - Para validação robusta

### Baixa Prioridade (V2.3+)
1. **Metrics com Prometheus** - Para monitoramento
2. **Internationalization** - Para suporte multi-idioma
3. **Animações com Reanimated** - Para UX melhor
4. **Integração com OpenAI** - Para geração de conteúdo
5. **Sistema de Turnos** - Para combate
6. **Sistema de Classes** - Para especialização
7. **Sistema de Habilidades** - Para progressão
8. **Sistema de Crafting** - Para forja

---

## 🎯 Conclusão

A V2 já implementa uma **base sólida** com:
- ✅ NestJS + TypeScript
- ✅ DDD + SOLID + Clean Architecture
- ✅ React Native + Tailwind CSS
- ✅ Autenticação JWT
- ✅ Prisma ORM
- ✅ Redux Toolkit

As melhorias sugeridas acima podem ser implementadas **gradualmente** conforme a necessidade do projeto. Recomendo começar pelas de **alta prioridade** (V2.1) e depois evoluir para as demais.

Se precisar de ajuda para implementar alguma dessas melhorias, é só me chamar! 🚀
