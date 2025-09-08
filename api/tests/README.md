# Testes - Hopper API

Este diretório contém todos os testes unitários e de integração para a API do Hopper.

## Estrutura dos Testes

```
tests/
├── __init__.py              # Inicialização do pacote de testes
├── conftest.py              # Configurações e fixtures globais
├── test_api.py              # Testes dos endpoints da API FastAPI
├── test_powerbi.py          # Testes da classe PowerBI
├── test_models.py           # Testes dos modelos Pydantic
├── test_integration.py      # Testes de integração
└── README.md               # Este arquivo
```

## Tipos de Testes

### Testes Unitários
- **test_powerbi.py**: Testa a classe `Powerbi` e seus métodos
- **test_api.py**: Testa os endpoints da API FastAPI
- **test_models.py**: Testa os modelos Pydantic

### Testes de Integração
- **test_integration.py**: Testa fluxos completos da aplicação

## Configuração

### Instalação das Dependências de Teste

```bash
# Instalar dependências de teste
uv add --group test pytest pytest-asyncio pytest-mock httpx pytest-cov

# Ou usar o grupo opcional já configurado
uv sync --group test
```

### Dependências de Teste
- **pytest**: Framework de testes
- **pytest-asyncio**: Suporte para testes assíncronos
- **pytest-mock**: Mocking para testes
- **httpx**: Cliente HTTP para testes da API
- **pytest-cov**: Cobertura de código

## Executando os Testes

### Todos os Testes
```bash
# Executar todos os testes
uv run pytest

# Executar com verbosidade
uv run pytest -v

# Executar com cobertura
uv run pytest --cov=src --cov-report=html
```

### Testes Específicos
```bash
# Executar apenas testes unitários
uv run pytest -m unit

# Executar apenas testes de integração
uv run pytest -m integration

# Executar um arquivo específico
uv run pytest tests/test_powerbi.py

# Executar um teste específico
uv run pytest tests/test_powerbi.py::TestPowerbi::test_init_success
```

### Testes por Categoria
```bash
# Executar testes rápidos (excluir os lentos)
uv run pytest -m "not slow"

# Executar apenas testes marcados como slow
uv run pytest -m slow
```

## Relatórios de Cobertura

### Gerar Relatório HTML
```bash
uv run pytest --cov=src --cov-report=html
# Abrir htmlcov/index.html no navegador
```

### Gerar Relatório XML (para CI/CD)
```bash
uv run pytest --cov=src --cov-report=xml
```

### Gerar Relatório no Terminal
```bash
uv run pytest --cov=src --cov-report=term-missing
```

## Fixtures e Configurações

### conftest.py
Contém fixtures globais e configurações compartilhadas:
- `test_env_vars`: Variáveis de ambiente para testes
- `mock_env_variables`: Mock automático das variáveis de ambiente
- `mock_powerbi_auth`: Mock da autenticação do PowerBI
- `powerbi_client`: Cliente PowerBI mocado

### Usando Fixtures
```python
def test_example(powerbi_client):
    # powerbi_client já está configurado e mocado
    result = powerbi_client.some_method()
    assert result is not None
```

## Mocking

### Exemplo de Mock Básico
```python
@patch('src.api.v1.powerbi.requests.get')
def test_get_groups(mock_get, powerbi_instance):
    mock_response = Mock()
    mock_response.json.return_value = {"value": []}
    mock_get.return_value = mock_response
    
    result = await powerbi_instance.get_all_powerbi_groups()
    assert result == {"value": []}
```

### Mock de Exceções
```python
@patch('src.api.v1.powerbi.requests.get')
def test_get_groups_error(mock_get, powerbi_instance):
    mock_get.side_effect = requests.HTTPError("404 Not Found")
    
    with pytest.raises(requests.HTTPError):
        await powerbi_instance.get_all_powerbi_groups()
```

## Marcadores (Markers)

### Marcadores Disponíveis
- `@pytest.mark.unit`: Testes unitários
- `@pytest.mark.integration`: Testes de integração
- `@pytest.mark.slow`: Testes que demoram mais para executar
- `@pytest.mark.asyncio`: Testes assíncronos

### Usando Marcadores
```python
@pytest.mark.unit
def test_unit_example():
    pass

@pytest.mark.integration
@pytest.mark.asyncio
async def test_integration_example():
    pass

@pytest.mark.slow
def test_slow_example():
    pass
```

## Boas Práticas

### Organização dos Testes
1. **Um arquivo de teste por módulo**: `test_powerbi.py` para `powerbi.py`
2. **Classes de teste**: Agrupe testes relacionados em classes
3. **Nomes descritivos**: Use nomes que descrevem o que está sendo testado
4. **Arrange-Act-Assert**: Organize os testes em seções claras

### Exemplo de Estrutura
```python
class TestPowerbi:
    """Testes para a classe Powerbi"""
    
    def test_method_success(self, powerbi_instance):
        """Testa o sucesso do método"""
        # Arrange
        expected = {"result": "success"}
        
        # Act
        result = powerbi_instance.method()
        
        # Assert
        assert result == expected
    
    def test_method_error(self, powerbi_instance):
        """Testa o tratamento de erro do método"""
        # Arrange & Act & Assert
        with pytest.raises(ValueError):
            powerbi_instance.method(invalid_param=True)
```

### Mocks e Fixtures
1. **Use fixtures para configuração comum**
2. **Mock dependências externas** (APIs, banco de dados)
3. **Não mock o código que você está testando**
4. **Use mocks específicos** para cada teste quando necessário

### Cobertura de Código
- **Alvo**: Manter cobertura acima de 80%
- **Foco**: Testar caminhos críticos e de erro
- **Qualidade > Quantidade**: Testes úteis são melhor que alta cobertura

## Executando em CI/CD

### GitHub Actions (exemplo)
```yaml
- name: Run tests
  run: |
    uv run pytest --cov=src --cov-report=xml
    
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage.xml
```

### Comandos para CI
```bash
# Executar testes com saída para CI
uv run pytest --cov=src --cov-report=xml --junitxml=junit.xml

# Falhar se cobertura for menor que 80%
uv run pytest --cov=src --cov-fail-under=80
```

## Troubleshooting

### Problemas Comuns

#### Imports não encontrados
```bash
# Certifique-se de que o PYTHONPATH está correto
export PYTHONPATH="${PYTHONPATH}:${PWD}/src"

# Ou execute a partir do diretório raiz do projeto
cd /path/to/hopper/api && uv run pytest
```

#### Testes assíncronos não funcionam
```python
# Certifique-se de usar @pytest.mark.asyncio
@pytest.mark.asyncio
async def test_async_function():
    result = await some_async_function()
    assert result is not None
```

#### Mocks não funcionam
```python
# Use o caminho completo do módulo no patch
@patch('src.api.v1.powerbi.requests.get')  # ✅ Correto
@patch('requests.get')  # ❌ Pode não funcionar
```

## Contribuição

Ao adicionar novos testes:
1. Siga a estrutura existente
2. Use fixtures quando apropriado
3. Adicione marcadores relevantes
4. Mantenha boa cobertura de código
5. Documente testes complexos
