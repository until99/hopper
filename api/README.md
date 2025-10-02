# Hopper API

API para integração com o PowerBI, desenvolvida com FastAPI.

## 🚀 Funcionalidades

- **Grupos**: Listar e gerenciar grupos do PowerBI
- **Relatórios**: Criar, listar, visualizar e deletar relatórios
- **Datasets**: Atualizar datasets e gerenciar agendamentos de refresh
- **Autenticação**: Integração com Azure AD/Microsoft Entra ID

## 📋 Pré-requisitos

- Python 3.13+
- uv (gerenciador de pacotes)
- Credenciais do Azure AD (TENANT_ID, CLIENT_ID, CLIENT_SECRET)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd hopper/api
```

2. Instale as dependências:
```bash
uv sync
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### Variáveis de Ambiente Importantes

```bash
# Azure AD / PowerBI
TENANT_ID=seu-tenant-id
CLIENT_ID=seu-client-id
CLIENT_SECRET=seu-client-secret

# JWT
JWT_SECRET=seu-secret-super-seguro-com-mais-de-32-caracteres

# CORS - URL do frontend em produção
FRONTEND_URL=https://seu-app.vercel.app

# Database
DB_PATH=hopper.db
```

**⚠️ IMPORTANTE para Deploy em Produção:**
- Configure `FRONTEND_URL` com a URL da Vercel para permitir CORS
- Use um `JWT_SECRET` forte e único em produção
- Nunca commite o arquivo `.env` com credenciais reais

## 🏃‍♂️ Executando

### Desenvolvimento
```bash
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Produção
```bash
uv run python src/main.py
```

A API estará disponível em `http://localhost:8000`

## 📖 Documentação da API

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🧪 Testes

Este projeto possui uma suíte completa de testes unitários e de integração.

### Estrutura dos Testes
```
tests/
├── conftest.py          # Configurações globais e fixtures
├── test_api.py          # Testes dos endpoints da API
├── test_powerbi.py      # Testes da classe PowerBI
├── test_models.py       # Testes dos modelos Pydantic
├── test_integration.py  # Testes de integração
└── README.md           # Documentação detalhada dos testes
```

### Executando os Testes

#### Instalação das dependências de teste:
```bash
uv sync --group test
```

#### Comandos principais:
```bash
# Testes unitários (recomendado)
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v --cov=src --cov-report=term-missing

# Todos os testes  
uv run pytest tests/ -v

# Apenas testes de integração
uv run pytest tests/test_integration.py -v -m integration

# Com cobertura detalhada
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v --cov=src --cov-report=term-missing

# Para CI/CD
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py --cov=src --cov-report=xml
```

### Cobertura de Código

Atualmente o projeto possui **87% de cobertura** de código nos testes unitários.

Para visualizar o relatório detalhado:
```bash
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v --cov=src --cov-report=term-missing
# O relatório será exibido no terminal
```

### Tipos de Testes

1. **Testes Unitários** (`test_api.py`, `test_powerbi.py`, `test_models.py`):
   - Testam componentes individuais isoladamente
   - Usam mocks para dependências externas
   - Executam rapidamente

2. **Testes de Integração** (`test_integration.py`):
   - Testam fluxos completos da aplicação
   - Simulam cenários reais de uso
   - Verificam integração entre componentes

3. **Fixtures e Configurações** (`conftest.py`):
   - Configurações compartilhadas entre testes
   - Mocks automáticos de variáveis de ambiente
   - Clientes de teste pré-configurados

## 🏗️ Arquitetura

```
src/
├── main.py              # Ponto de entrada da aplicação
├── api/
│   └── v1/
│       └── powerbi.py   # Cliente PowerBI
└── models/
    └── powerbi.py       # Modelos Pydantic
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# PowerBI / Azure AD Configuration
TENANT_ID=your_tenant_id
CLIENT_ID=your_client_id  
CLIENT_SECRET=your_client_secret

# Database Configuration
DB_PATH=hopper.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-please

# CORS Configuration (comma-separated list for production)
# Example: ALLOWED_ORIGINS=https://your-frontend.com,https://another-domain.com
ALLOWED_ORIGINS=

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=logs/api.log
```

### Configuração de CORS

Por padrão, a API permite requisições de `localhost` para desenvolvimento. Em produção, você deve configurar a variável `ALLOWED_ORIGINS` com os domínios permitidos:

```env
# Single origin
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Multiple origins (comma-separated)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-app.render.com
```

**Importante**: Nunca use `allow_origins=["*"]` em produção com `allow_credentials=True`, pois isso é uma vulnerabilidade de segurança.

## 📦 Dependências

### Principais
- **FastAPI**: Framework web moderno e rápido
- **uvicorn**: Servidor ASGI
- **msal**: Autenticação Microsoft
- **requests**: Cliente HTTP
- **python-dotenv**: Gerenciamento de variáveis de ambiente

### Desenvolvimento e Testes
- **pytest**: Framework de testes
- **pytest-asyncio**: Suporte a testes assíncronos
- **pytest-mock**: Mocking para testes
- **httpx**: Cliente HTTP para testes
- **pytest-cov**: Relatórios de cobertura

## 🚀 CI/CD

O projeto inclui configuração para GitHub Actions (`.github/workflows/test.yml`) que:

- Executa testes automaticamente em push/PR
- Verifica cobertura de código
- Executa linting e formatação
- Suporta múltiplas versões do Python

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Execute os testes** (`uv run pytest tests/ -v`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

### Padrões de Código

- Siga o padrão PEP 8
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de código acima de 80%
- Use type hints
- Documente funções e classes

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 🐛 Reportando Bugs

Se encontrar algum bug, por favor:

1. Verifique se já não existe uma issue similar
2. Crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Informações do ambiente (OS, Python, versão da API)

## 📞 Suporte

Para dúvidas ou suporte:

- Abra uma issue no GitHub
- Consulte a documentação dos testes em `tests/README.md`
- Verifique os logs da aplicação
