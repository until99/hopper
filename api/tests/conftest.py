import os
import pytest
from unittest.mock import patch
from src.api.v1.powerbi import Powerbi


@pytest.fixture(scope="session")
def test_env_vars():
    """Fixture com variáveis de ambiente de teste"""
    return {
        "TENANT_ID": "test-tenant-id",
        "CLIENT_ID": "test-client-id",
        "CLIENT_SECRET": "test-client-secret"
    }


@pytest.fixture(autouse=True)
def mock_env_variables(test_env_vars):
    """Mock automático das variáveis de ambiente para todos os testes"""
    with patch.dict(os.environ, test_env_vars):
        yield


@pytest.fixture
def mock_powerbi_token():
    """Mock do token de acesso do PowerBI"""
    return {"access_token": "test-access-token"}


@pytest.fixture
def mock_powerbi_auth(mock_powerbi_token):
    """Mock da autenticação do PowerBI"""
    with patch('src.api.v1.powerbi.msal.ConfidentialClientApplication') as mock_msal:
        mock_app = mock_msal.return_value
        mock_app.acquire_token_for_client.return_value = mock_powerbi_token
        yield mock_msal


@pytest.fixture
def powerbi_client(test_env_vars, mock_powerbi_auth):
    """Fixture que cria um cliente PowerBI mocado"""
    return Powerbi(
        tenant_id=test_env_vars["TENANT_ID"],
        client_id=test_env_vars["CLIENT_ID"],
        client_secret=test_env_vars["CLIENT_SECRET"]
    )
