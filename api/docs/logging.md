# Sistema de Logging - Hopper API

Este documento descreve o sistema de logging implementado na API do Hopper.

## Configuração

O sistema de logging é configurado automaticamente ao iniciar a aplicação. As configurações podem ser ajustadas através de variáveis de ambiente:

### Variáveis de Ambiente

```bash
# Nível de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
LOG_LEVEL=INFO

# Arquivo de log (opcional - se não especificado, criará logs/api_YYYYMMDD.log)
LOG_FILE=logs/api.log
```

## Estrutura de Logs

### Formato Padrão
```
2024-01-01 12:00:00 - hopper.api.main - INFO - [main.py:25] - Iniciando aplicação Hopper API
```

### Componentes do Log
- **Timestamp**: Data e hora do evento
- **Logger Name**: Nome do logger (módulo/componente)
- **Level**: Nível do log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- **Location**: Arquivo e linha de código
- **Message**: Mensagem do log

## Loggers Disponíveis

### Logger Principal
- **Nome**: `hopper.api.main`
- **Uso**: Eventos principais da aplicação (startup, shutdown, etc.)

### Logger PowerBI
- **Nome**: `hopper.api.powerbi`
- **Uso**: Operações específicas do cliente PowerBI

### Logger de Requisições
- **Nome**: `hopper.api.middleware`
- **Uso**: Logging de todas as requisições HTTP

### Logger de Segurança
- **Nome**: `hopper.api.security`
- **Uso**: Eventos relacionados à segurança (tentativas suspeitas, etc.)

## Níveis de Log

### DEBUG
- Informações detalhadas para debugging
- Tokens de acesso sendo renovados
- Parâmetros de requisições

### INFO
- Fluxo normal da aplicação
- Início/fim de operações
- Resultados de operações bem-sucedidas

### WARNING
- Situações que merecem atenção mas não são erros
- Respostas inesperadas da API
- Tentativas de acesso suspeitas

### ERROR
- Erros que impedem operações específicas
- Falhas na comunicação com APIs externas
- Erros de validação

### CRITICAL
- Erros que podem impedir o funcionamento da aplicação
- Falhas na inicialização
- Problemas de configuração críticos

## Middlewares de Logging

### LoggingMiddleware
Registra informações sobre cada requisição HTTP:
- Método e URL
- IP do cliente
- User-Agent
- Tempo de processamento
- Status code da resposta
- Tamanho da resposta

Exemplo de log:
```
2024-01-01 12:00:00 - hopper.api.middleware - INFO - [abc12345] GET /powerbi/groups - IP: 127.0.0.1 - User-Agent: Mozilla/5.0...
2024-01-01 12:00:01 - hopper.api.middleware - INFO - [abc12345] GET /powerbi/groups - Status: 200 - Time: 0.542s - Size: 1024 bytes
```

### SecurityLoggingMiddleware
Monitora e registra eventos de segurança:
- User-Agents suspeitos (ferramentas de hacking)
- Tentativas de acesso a endpoints administrativos
- Códigos de status 401, 403, 404

Exemplo de log:
```
2024-01-01 12:00:00 - hopper.api.security - WARNING - Suspicious User-Agent detected - IP: 192.168.1.100 - User-Agent: sqlmap/1.0
```

## Headers de Resposta

O middleware de logging adiciona headers úteis para debugging:
- **X-Request-ID**: ID único da requisição
- **X-Process-Time**: Tempo de processamento em segundos

## Rotação de Logs

### Configuração Automática
- **Tamanho máximo**: 10MB por arquivo
- **Backups**: 5 arquivos de backup
- **Encoding**: UTF-8

### Estrutura de Arquivos
```
logs/
├── api_20240101.log     # Log atual
├── api_20240101.log.1   # Backup 1
├── api_20240101.log.2   # Backup 2
└── ...
```

## Logs de Bibliotecas Externas

Para reduzir ruído, os logs de bibliotecas externas são configurados com níveis mais altos:
- **MSAL**: WARNING
- **urllib3**: WARNING
- **requests**: WARNING
- **httpx**: WARNING

## Personalização

### Criando um Logger Personalizado
```python
from api.logger import get_logger

logger = get_logger("meu.modulo")
logger.info("Minha mensagem")
```

### Configuração Personalizada
```python
from api.logger import setup_logging

setup_logging(
    log_level="DEBUG",
    log_file="meu_arquivo.log",
    enable_console=True,
    log_format="%(asctime)s - %(message)s"
)
```

## Monitoramento

### Análise de Performance
Use o header `X-Process-Time` para monitorar performance:
```bash
curl -I http://localhost:8000/powerbi/groups
# X-Process-Time: 0.542
```

### Análise de Segurança
Monitore o logger `hopper.api.security` para eventos suspeitos:
```bash
grep "Suspicious" logs/api.log
```

### Análise de Erros
Monitore logs de ERROR e CRITICAL:
```bash
grep -E "(ERROR|CRITICAL)" logs/api.log
```

## Troubleshooting

### Logs Não Aparecem
1. Verifique se `LOG_LEVEL` está configurado corretamente
2. Verifique permissões do diretório `logs/`
3. Verifique se `configure_api_logging()` está sendo chamado

### Performance
Se os logs estão impactando performance:
1. Aumente `LOG_LEVEL` para `WARNING` ou `ERROR`
2. Desabilite logs de console em produção
3. Use arquivo de log em disco SSD

### Espaço em Disco
- Configure rotação adequada
- Monitore crescimento dos arquivos
- Considere compressão dos backups

## Boas Práticas

1. **Use níveis apropriados**: INFO para fluxo normal, ERROR para problemas
2. **Inclua contexto**: IDs de requisição, parâmetros relevantes
3. **Não logue informações sensíveis**: senhas, tokens completos
4. **Use formatação consistente**: mantém legibilidade
5. **Monitore regularmente**: configure alertas para ERRORs
