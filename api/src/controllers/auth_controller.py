from fastapi import Depends
from databases import Database

try:
    from ..models import UserLogin, UserCreate, AuthResponse, UserResponse
    from ..services import AuthService
    from ..api.database import get_database
    from ..api.logger import get_logger
except ImportError:
    from models import UserLogin, UserCreate, AuthResponse, UserResponse
    from services import AuthService
    from api.database import get_database
    from api.logger import get_logger

logger = get_logger("hopper.api.auth_controller")


class AuthController:
    """Controller responsável por gerenciar as operações de autenticação"""
    
    def __init__(self, database: Database = Depends(get_database)):
        self.auth_service = AuthService(database)

    async def register(self, user_data: UserCreate) -> AuthResponse:
        """Registra um novo usuário"""
        logger.info(f"Tentativa de registro para o email: {user_data.email}")
        return await self.auth_service.register(user_data)

    async def login(self, user_data: UserLogin) -> AuthResponse:
        """Autentica um usuário"""
        logger.info(f"Tentativa de login para o email: {user_data.email}")
        return await self.auth_service.login(user_data.email, user_data.password)

    async def get_current_user(self, token: str) -> UserResponse:
        """Obtém o usuário atual baseado no token"""
        return await self.auth_service.get_current_user(token)

    async def logout(self, token: str) -> dict:
        """Realiza logout do usuário"""
        return await self.auth_service.logout(token)

    async def verify_token(self, current_user: UserResponse) -> dict:
        """Verifica se o token é válido"""
        return {"valid": True, "user_id": current_user.id}
