from fastapi import APIRouter, Depends, status

from ..models import UserLogin, UserCreate, AuthResponse, UserResponse
from ..controllers import AuthController
from ..utils import get_current_user
from ..api.logger import get_logger

logger = get_logger("hopper.api.auth_routes")

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    auth_controller: AuthController = Depends(AuthController)
):
    """Registra um novo usuário"""
    return await auth_controller.register(user_data)


@router.post("/login", response_model=AuthResponse)
async def login(
    user_data: UserLogin,
    auth_controller: AuthController = Depends(AuthController)
):
    """Autentica um usuário"""
    return await auth_controller.login(user_data)


@router.post("/logout")
async def logout(
    current_user: UserResponse = Depends(get_current_user),
    auth_controller: AuthController = Depends(AuthController)
):
    """Realiza logout do usuário"""
    logger.info(f"Logout do usuário: {current_user.email}")
    return await auth_controller.logout("")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Obtém informações do usuário atual"""
    return current_user


@router.get("/verify")
async def verify_token(
    current_user: UserResponse = Depends(get_current_user),
    auth_controller: AuthController = Depends(AuthController)
):
    """Verifica se o token é válido"""
    return await auth_controller.verify_token(current_user)
