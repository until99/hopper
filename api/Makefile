# Makefile para o projeto Hopper API

.PHONY: help install test test-unit test-integration test-cov clean

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instala as dependências do projeto
	uv sync --group test

test: ## Executa todos os testes
	uv run pytest tests/ -v

test-unit: ## Executa apenas os testes unitários
	uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v

test-integration: ## Executa apenas os testes de integração  
	uv run pytest tests/test_integration.py -v -m integration

test-cov: ## Executa testes com relatório de cobertura
	uv run pytest tests/test_api.py tests/test_powerbi.py tests/test_models.py -v --cov=src --cov-report=html --cov-report=term-missing

test-cov-all: ## Executa todos os testes com cobertura
	uv run pytest tests/ -v --cov=src --cov-report=html --cov-report=term-missing

clean: ## Remove arquivos temporários e cache
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf coverage.xml
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -name "*.pyc" -delete

lint: ## Executa verificação de código
	uv run ruff check src/
	uv run mypy src/

format: ## Formata o código
	uv run ruff format src/
	uv run ruff check --fix src/

dev: ## Inicia o servidor de desenvolvimento
	uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

run: ## Inicia o servidor
	uv run python src/main.py
