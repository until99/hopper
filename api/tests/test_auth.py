import pytest
from api.v1.auth import AuthService
from api.v1.models import UserCreate
from unittest.mock import Mock, patch
import os


@pytest.fixture
def mock_env_vars():
    """Mock das variáveis de ambiente necessárias"""
    with patch.dict(os.environ, {
        'SUPABASE_URL': 'https://test.supabase.co',
        'SUPABASE_SERVICE_ROLE_KEY': 'test-service-key',
        'SUPABASE_JWT_SECRET': 'test-jwt-secret'
    }):
        yield


@pytest.fixture
def auth_service(mock_env_vars):
    """Fixture do serviço de autenticação"""
    with patch('api.v1.auth.create_client') as mock_create_client:
        mock_client = Mock()
        mock_create_client.return_value = mock_client
        
        service = AuthService()
        service.supabase = mock_client
        return service


@pytest.mark.asyncio
async def test_register_success(auth_service):
    """Testa registro de usuário com sucesso"""
    # Mock da resposta do Supabase
    mock_user = Mock()
    mock_user.id = "test-user-id"
    mock_user.email = "test@example.com"
    mock_user.created_at = "2023-01-01T00:00:00Z"
    
    auth_service.supabase.auth.admin.create_user.return_value = Mock(user=mock_user)
    
    # Dados do usuário
    user_data = UserCreate(
        email="test@example.com",
        password="TestPassword123!",
        full_name="Test User"
    )
    
    # Executa o registro
    result = await auth_service.register(user_data)
    
    # Verifica o resultado
    assert result.user.email == "test@example.com"
    assert result.user.full_name == "Test User"
    assert result.session.token_type == "bearer"
    assert result.session.access_token is not None


@pytest.mark.asyncio
async def test_login_success(auth_service):
    """Testa login com sucesso"""
    # Mock da resposta do Supabase
    mock_user = Mock()
    mock_user.id = "test-user-id"
    mock_user.email = "test@example.com"
    mock_user.created_at = "2023-01-01T00:00:00Z"
    mock_user.user_metadata = {"full_name": "Test User"}
    
    mock_session = Mock()
    mock_session.refresh_token = "test-refresh-token"
    
    auth_service.supabase.auth.sign_in_with_password.return_value = Mock(
        user=mock_user,
        session=mock_session
    )
    
    # Executa o login
    result = await auth_service.login("test@example.com", "TestPassword123!")
    
    # Verifica o resultado
    assert result.user.email == "test@example.com"
    assert result.user.full_name == "Test User"
    assert result.session.token_type == "bearer"
    assert result.session.refresh_token == "test-refresh-token"


@pytest.mark.asyncio
async def test_login_invalid_credentials(auth_service):
    """Testa login com credenciais inválidas"""
    # Mock da resposta do Supabase (usuário nulo)
    auth_service.supabase.auth.sign_in_with_password.return_value = Mock(user=None)
    
    # Executa o login e espera uma exceção
    with pytest.raises(Exception):
        await auth_service.login("invalid@example.com", "wrongpassword")


def test_create_access_token(auth_service):
    """Testa criação de token de acesso"""
    data = {"sub": "test@example.com", "user_id": "test-user-id"}
    token = auth_service._create_access_token(data)
    
    assert token is not None
    assert isinstance(token, str)
