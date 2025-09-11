# Sistema de Autenticação Hopper

Este projeto inclui um sistema de autenticação integrado que funciona tanto com Supabase quanto com uma API própria.

## Configuração

### Backend (API)

1. **Instale as dependências:**
```bash
cd api
uv sync
```

2. **Configure as variáveis de ambiente:**
Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```bash
# PowerBI
TENANT_ID="seu-tenant-id"
CLIENT_ID="seu-client-id"
CLIENT_SECRET="seu-client-secret"

# Supabase
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
SUPABASE_JWT_SECRET="seu-jwt-secret"

# Logging
LOG_LEVEL="INFO"
LOG_FILE="logs/api.log"
```

3. **Execute a API:**
```bash
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (App)

1. **Instale as dependências:**
```bash
cd app
pnpm install
```

2. **Configure as variáveis de ambiente:**
Copie o arquivo `.env.example` para `.env.local` e preencha:

```bash
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key

# API
VITE_API_URL=http://localhost:8000
```

3. **Execute o frontend:**
```bash
pnpm dev
```

## Funcionalidades

### Modos de Autenticação

O sistema oferece duas opções de autenticação que podem ser alternadas na tela de login:

1. **Supabase Auth**: Utiliza diretamente a autenticação do Supabase
2. **API Auth**: Utiliza a API própria que se sincroniza com o Supabase

### Endpoints da API

A API fornece os seguintes endpoints de autenticação:

- `POST /api/v1/auth/register` - Registra um novo usuário
- `POST /api/v1/auth/login` - Autentica um usuário
- `POST /api/v1/auth/logout` - Faz logout do usuário
- `GET /api/v1/auth/me` - Obtém informações do usuário atual
- `GET /api/v1/auth/verify` - Verifica se o token é válido

### Proteção de Rotas

As rotas do PowerBI agora estão protegidas e requerem autenticação. Exemplo:

```python
@groups_router.get("")
async def get_groups(current_user: UserResponse = Depends(get_current_active_user)):
    # Código da rota...
```

### Frontend

O frontend foi atualizado com:

- Tela de login/registro unificada
- Alternância entre modos de autenticação
- Interceptor automático para adicionar tokens às requisições
- Gerenciamento de estado de autenticação

## Estrutura dos Arquivos

### Backend
```
api/src/api/v1/
├── auth.py              # Serviço de autenticação
├── auth_routes.py       # Rotas de autenticação
├── dependencies.py      # Dependências FastAPI
└── models.py           # Modelos Pydantic
```

### Frontend
```
app/src/
├── services/AuthApi.ts     # Serviço da API de autenticação
├── hooks/auth/useAuth.tsx  # Hook de autenticação
├── lib/authInterceptor.ts  # Interceptor de requisições
└── routes/login.tsx        # Tela de login/registro
```

## Fluxo de Autenticação

### Modo Supabase
1. Usuário faz login/registro através do cliente Supabase
2. Token é gerenciado automaticamente pelo Supabase
3. Estado é sincronizado com o React

### Modo API
1. Usuário faz login/registro através da API própria
2. API autentica com Supabase no backend
3. API gera um JWT próprio
4. Token é armazenado no localStorage
5. Interceptor adiciona token automaticamente nas requisições

## Testando

Execute os testes da API:

```bash
cd api
uv run pytest tests/ -v
```

## Segurança

- Tokens JWT com expiração configurável
- Senhas nunca são armazenadas (delegadas ao Supabase)
- CORS configurado adequadamente
- Middleware de segurança e logging
- Validação de dados com Pydantic

## Próximos Passos

- [ ] Implementar refresh tokens
- [ ] Adicionar roles e permissões
- [ ] Implementar rate limiting
- [ ] Adicionar testes de integração
- [ ] Configurar CI/CD
