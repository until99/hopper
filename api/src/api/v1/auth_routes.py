from fastapi import APIRouter, Depends, status
from .models import UserLogin, UserCreate, AuthResponse, UserResponse
from .auth import AuthService
from .dependencies import get_auth_service, get_current_user
from ..logger import get_logger

logger = get_logger("hopper.api.auth_routes")

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Registra um novo usuário"""
    logger.info(f"Tentativa de registro para o email: {user_data.email}")
    return await auth_service.register(user_data)


@router.post("/login", response_model=AuthResponse)
async def login(
    user_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Autentica um usuário"""
    logger.info(f"Tentativa de login para o email: {user_data.email}")
    return await auth_service.login(user_data.email, user_data.password)


@router.post("/logout")
async def logout(
    auth_service: AuthService = Depends(get_auth_service),
    current_user: UserResponse = Depends(get_current_user)
):
    """Realiza logout do usuário"""
    logger.info(f"Logout do usuário: {current_user.email}")
    return await auth_service.logout("")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Obtém informações do usuário atual"""
    return current_user


@router.get("/verify")
async def verify_token(current_user: UserResponse = Depends(get_current_user)):
    """Verifica se o token é válido"""
    return {"valid": True, "user_id": current_user.id}
