import os
from typing import Optional, Dict
from supabase import create_client, Client
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from .models import UserCreate, UserResponse, Token, AuthResponse
from ..logger import get_logger

logger = get_logger("hopper.api.auth")


class AuthService:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        
        if not all([supabase_url, supabase_service_key, self.jwt_secret]):
            raise ValueError("Missing Supabase configuration")
        
        self.supabase: Client = create_client(supabase_url, supabase_service_key)
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 60 * 24  # 24 horas
        
        logger.info("AuthService inicializado com sucesso")

    async def register(self, user_data: UserCreate) -> AuthResponse:
        """Registra um novo usuário"""
        try:
            # Registra o usuário no Supabase Auth
            auth_response = self.supabase.auth.admin.create_user({
                "email": user_data.email,
                "password": user_data.password,
                "user_metadata": {
                    "full_name": user_data.full_name
                }
            })
            
            if auth_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Erro ao criar usuário"
                )
            
            user = UserResponse(
                id=auth_response.user.id,
                email=auth_response.user.email,
                full_name=user_data.full_name,
                created_at=datetime.fromisoformat(auth_response.user.created_at.replace('Z', '+00:00'))
            )
            
            # Gera tokens personalizados
            access_token = self._create_access_token(
                data={"sub": auth_response.user.email, "user_id": auth_response.user.id}
            )
            
            token = Token(
                access_token=access_token,
                token_type="bearer",
                expires_in=self.access_token_expire_minutes * 60
            )
            
            logger.info(f"Usuário registrado com sucesso: {user_data.email}")
            return AuthResponse(user=user, session=token)
            
        except Exception as e:
            logger.error(f"Erro ao registrar usuário: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

    async def login(self, email: str, password: str) -> AuthResponse:
        """Autentica um usuário"""
        try:
            # Autentica com Supabase
            auth_response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if auth_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciais inválidas"
                )
            
            user = UserResponse(
                id=auth_response.user.id,
                email=auth_response.user.email,
                full_name=auth_response.user.user_metadata.get("full_name"),
                created_at=datetime.fromisoformat(auth_response.user.created_at.replace('Z', '+00:00'))
            )
            
            # Gera tokens personalizados
            access_token = self._create_access_token(
                data={"sub": auth_response.user.email, "user_id": auth_response.user.id}
            )
            
            token = Token(
                access_token=access_token,
                token_type="bearer",
                expires_in=self.access_token_expire_minutes * 60,
                refresh_token=auth_response.session.refresh_token if auth_response.session else None
            )
            
            logger.info(f"Login realizado com sucesso: {email}")
            return AuthResponse(user=user, session=token)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao fazer login: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas"
            )

    async def get_current_user(self, token: str) -> UserResponse:
        """Obtém o usuário atual baseado no token"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.algorithm])
            email: str = payload.get("sub")
            user_id: str = payload.get("user_id")
            
            if email is None or user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token inválido"
                )
            
            # Busca o usuário no Supabase
            user_response = self.supabase.auth.admin.get_user_by_id(user_id)
            
            if user_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuário não encontrado"
                )
            
            user = UserResponse(
                id=user_response.user.id,
                email=user_response.user.email,
                full_name=user_response.user.user_metadata.get("full_name"),
                created_at=datetime.fromisoformat(user_response.user.created_at.replace('Z', '+00:00'))
            )
            
            return user
            
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )
        except Exception as e:
            logger.error(f"Erro ao obter usuário atual: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )

    async def logout(self, token: str) -> Dict[str, str]:
        """Realiza logout do usuário"""
        try:
            # O logout no Supabase é realizado no cliente
            # Aqui podemos adicionar lógica adicional se necessário
            logger.info("Logout realizado com sucesso")
            return {"message": "Logout realizado com sucesso"}
            
        except Exception as e:
            logger.error(f"Erro ao fazer logout: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

    def _create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Cria um token de acesso JWT"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.jwt_secret, algorithm=self.algorithm)
        return encoded_jwt
