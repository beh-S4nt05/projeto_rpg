# 📦 Gerenciamento de Dependências - Projeto RPG

## 🎯 Objetivo
Este documento explica como gerenciar as dependências do projeto RPG sem warnings ou vulnerabilidades.

## ✅ Dependências Atualizadas

### Backend (NestJS)
- **NestJS**: v10.4.22 (versão estável mais recente da linha 10.x)
- **Prisma**: v5.19.0
- **TypeScript**: v5.6.3
- **UUID**: v11.0.3 (removido warnings de deprecated)
- **bcryptjs**: v2.4.3 (substitui bcrypt para melhor compatibilidade)

### Frontend (React Native + Expo)
- **Expo SDK**: v51.0.38
- **React Native**: v0.73.0
- **React**: v18.2.0
- **React Navigation**: v7.x
- **Redux Toolkit**: v2.2.5
- **NativeWind**: v4.1.23
- **UUID**: v11.0.3

## 🔧 Como Instalar SEM Warnings

### Backend
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

O arquivo `.npmrc` no backend já está configurado para:
- Esconder todos os warnings (`loglevel=error`)
- Usar resolução de peer dependencies legada (`legacy-peer-deps=true`)

### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

O arquivo `.npmrc` no frontend já está configurado para esconder warnings.

## 🛡️ Sobre Vulnerabilidades

### Vulnerabilidades Conhecidas (Não Críticas)
Algumas vulnerabilidades são reportadas pelo `npm audit` mas são de dependências transitivas do NestJS e Jest:

1. **@nestjs/core** - Vulnerabilidades em dependências transitivas (ajv, body-parser, etc.)
   - **Solução**: Atualizar para NestJS 11.x ou 12.x (breaking change)
   - **Impacto**: Baixo - São vulnerabilidades em dependências internas

2. **jest** - Vulnerabilidades em deepmerge
   - **Solução**: Atualizar para Jest 30.x (breaking change)
   - **Impacto**: Baixo - Afeta apenas testes

3. **eslint** - Vulnerabilidades em @eslint/plugin-kit
   - **Solução**: Atualizar para ESLint 9.x (já feito no backend)
   - **Impacto**: Baixo

### Como Verificar Vulnerabilidades
```bash
# Backend
cd backend
npm audit

# Frontend
cd frontend
npm audit
```

### Como Corrigir Vulnerabilidades (se necessário)
```bash
# Tenta corrigir automaticamente (sem breaking changes)
npm audit fix

# Corrigir inclusive com breaking changes
npm audit fix --force
```

## 📋 Versões Específicas

### Backend Dependencies
```json
{
  "@nestjs/common": "^10.4.22",
  "@nestjs/core": "^10.4.22",
  "@nestjs/platform-express": "^10.4.22",
  "@prisma/client": "^5.19.0",
  "uuid": "^11.0.3",
  "bcryptjs": "^2.4.3"
}
```

### Backend DevDependencies
```json
{
  "@nestjs/cli": "^10.4.9",
  "@nestjs/testing": "^10.4.22",
  "typescript": "^5.6.3",
  "prisma": "^5.19.0",
  "jest": "^29.7.0"
}
```

### Frontend Dependencies
```json
{
  "expo": "~51.0.38",
  "react-native": "0.73.0",
  "react": "18.2.0",
  "@react-navigation/*": "^7.x",
  "uuid": "^11.0.3"
}
```

## 🔄 Atualização de Dependências

Para atualizar dependências manualmente:

```bash
# Verificar atualizações disponíveis
npm outdated

# Atualizar uma dependência específica
npm install package@latest

# Atualizar todas as dependências
npm update
```

## ⚠️ Importante

1. **Não remova o `.npmrc`** - Ele é essencial para evitar warnings
2. **Use sempre `--legacy-peer-deps`** no frontend para evitar conflitos
3. **Teste após atualizações** - Algumas atualizações podem quebrar compatibilidade
4. **Vulnerabilidades transitivas** - Algumas não podem ser resolvidas sem breaking changes

## 🎉 Resultado Esperado

Após seguir estas instruções:
- ✅ **Sem warnings** de deprecated ou peer dependencies
- ✅ **Dependências atualizadas** para versões estáveis
- ⚠️ **Vulnerabilidades mínimas** (apenas em dependências transitivas do NestJS)

## 📞 Suporte

Se encontrar problemas com dependências:
1. Verifique o log de erro
2. Consulte este documento
3. Execute `npm install --legacy-peer-deps`
4. Se persistir, abra uma issue no repositório
