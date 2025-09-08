# Script PowerShell para executar os testes da API Hopper

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "      Executando Testes - Hopper API" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Executando testes unitários..." -ForegroundColor Yellow

# Executa os testes unitários
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v --cov=src --cov-report=html --cov-report=term-missing

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "           Testes Concluídos" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Relatório de cobertura gerado em: htmlcov/index.html" -ForegroundColor Blue
Write-Host ""

# Para executar todos os testes (incluindo os de integração), descomente a linha abaixo:
# uv run pytest tests/ -v --cov=src --cov-report=html --cov-report=term-missing

Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
