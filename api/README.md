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

#### Todos os testes:
```bash
# Usando pytest diretamente
uv run pytest tests/ -v

# Usando make (Windows: .\make.bat, Unix: make)
.\make.bat test       # Windows
make test             # Unix/Linux/macOS
```

#### Apenas testes unitários:
```bash
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v
# ou
.\make.bat test-unit  # Windows  
make test-unit        # Unix/Linux/macOS
```

#### Com relatório de cobertura:
```bash
uv run pytest tests/ -v --cov=src --cov-report=term-missing
# ou  
.\make.bat test-cov   # Windows
make test-cov         # Unix/Linux/macOS
```

#### Apenas testes de integração:
```bash
uv run pytest tests/test_integration.py -v -m integration
# ou
.\make.bat test-integration  # Windows
make test-integration        # Unix/Linux/macOS
```

### Cobertura de Código

Atualmente o projeto possui **87% de cobertura** de código nos testes unitários.

Para visualizar o relatório detalhado:
```bash
.\make.bat test-cov   # Windows
make test-cov         # Unix/Linux/macOS
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
TENANT_ID=your_tenant_id
CLIENT_ID=your_client_id  
CLIENT_SECRET=your_client_secret
```

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
4. **Execute os testes** (`make test` ou `uv run pytest`)
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
