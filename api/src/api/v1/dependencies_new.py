from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from databases import Database
from .auth import AuthService
from .models import UserResponse
from ..database import get_database
from ..logger import get_logger

logger = get_logger("hopper.api.dependencies")

security = HTTPBearer()


async def get_auth_service(database: Database = Depends(get_database)) -> AuthService:
    """Dependência para obter o serviço de autenticação"""
    return AuthService(database)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> UserResponse:
    """Dependência para obter o usuário atual autenticado"""
    try:
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de acesso requerido"
            )
        
        token = credentials.credentials
        user = await auth_service.get_current_user(token)
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter usuário atual: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_active_user(
    current_user: UserResponse = Depends(get_current_user)
) -> UserResponse:
    """Dependência para obter o usuário atual ativo"""
    # Aqui podemos adicionar verificações adicionais se necessário
    # Por exemplo, verificar se o usuário está ativo, não banido, etc.
    return current_user
