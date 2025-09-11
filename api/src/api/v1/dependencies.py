from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .auth import AuthService
from .models import UserResponse

security = HTTPBearer()


def get_auth_service() -> AuthService:
    """Dependência para obter o serviço de autenticação"""
    return AuthService()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> UserResponse:
    """Dependência para obter o usuário atual autenticado"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso requerido"
        )
    
    return await auth_service.get_current_user(credentials.credentials)


async def get_current_active_user(
    current_user: UserResponse = Depends(get_current_user)
) -> UserResponse:
    """Dependência para obter o usuário atual ativo"""
    # Aqui podemos adicionar verificações adicionais se necessário
    # Por exemplo, verificar se o usuário está ativo, não banido, etc.
    return current_user
