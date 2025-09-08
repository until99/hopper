@echo off
REM Emulador de Makefile para Windows - Hopper API

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="install" goto install
if "%1"=="test" goto test
if "%1"=="test-unit" goto test-unit
if "%1"=="test-integration" goto test-integration
if "%1"=="test-cov" goto test-cov
if "%1"=="test-cov-all" goto test-cov-all
if "%1"=="clean" goto clean
if "%1"=="dev" goto dev
if "%1"=="run" goto run

echo Comando desconhecido: %1
goto help

:help
echo Comandos disponíveis:
echo.
echo   help           Mostra esta mensagem de ajuda
echo   install        Instala as dependências do projeto
echo   test           Executa todos os testes
echo   test-unit      Executa apenas os testes unitários
echo   test-integration Executa apenas os testes de integração
echo   test-cov       Executa testes com relatório de cobertura
echo   test-cov-all   Executa todos os testes com cobertura
echo   clean          Remove arquivos temporários e cache
echo   dev            Inicia o servidor de desenvolvimento
echo   run            Inicia o servidor
echo.
goto end

:install
echo Instalando dependências...
uv sync --group test
goto end

:test
echo Executando todos os testes...
uv run pytest tests/ -v
goto end

:test-unit
echo Executando testes unitários...
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v
goto end

:test-integration
echo Executando testes de integração...
uv run pytest tests/test_integration.py -v -m integration
goto end

:test-cov
echo Executando testes com cobertura...
uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v --cov=src --cov-report=term-missing
goto end

:test-cov-all
echo Executando todos os testes com cobertura...
uv run pytest tests/ -v --cov=src --cov-report=term-missing
goto end

:clean
echo Limpando arquivos temporários...
if exist .pytest_cache rmdir /s /q .pytest_cache
if exist .coverage del .coverage
if exist coverage.xml del coverage.xml
for /d /r . %%d in (__pycache__) do @if exist "%%d" rmdir /s /q "%%d"
echo Limpeza concluída.
goto end

:dev
echo Iniciando servidor de desenvolvimento...
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
goto end

:run
echo Iniciando servidor...
uv run python src/main.py
goto end

:end
