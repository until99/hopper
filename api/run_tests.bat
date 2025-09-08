@echo off
REM Script para executar os testes da API Hopper

echo ========================================
echo      Executando Testes - Hopper API
echo ========================================
echo.

echo Executando testes unitarios...
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v --cov=src --cov-report=html --cov-report=term-missing

echo.
echo ========================================
echo           Testes Concluidos
echo ========================================
echo.
echo Relatorio de cobertura gerado em: htmlcov/index.html
echo.

pause
