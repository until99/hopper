import os
from typing import Optional, Dict
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from databases import Database
from .models import UserCreate, UserResponse, Token, AuthResponse
from .user_repository import UserRepository
from ..logger import get_logger

logger = get_logger("hopper.api.auth")


class AuthService:
    def __init__(self, database: Database):
        self.jwt_secret = os.getenv("JWT_SECRET", "your-secret-key-change-this-in-production")
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 60 * 24  # 24 horas
        self.user_repository = UserRepository(database)
        
        logger.info("AuthService inicializado com sucesso")

    async def register(self, user_data: UserCreate) -> AuthResponse:
        """Registra um novo usuário"""
        try:
            # Cria o usuário no banco de dados
            user_dict = await self.user_repository.create_user(
                email=user_data.email,
                password=user_data.password,
                full_name=user_data.full_name
            )
            
            user = UserResponse(
                id=user_dict["id"],
                email=user_dict["email"],
                full_name=user_dict["full_name"],
                created_at=user_dict["created_at"],
                updated_at=user_dict.get("updated_at")
            )
            
            # Gera tokens
            access_token = self._create_access_token(
                data={"sub": user_dict["email"], "user_id": user_dict["id"]}
            )
            
            token = Token(
                access_token=access_token,
                token_type="bearer",
                expires_in=self.access_token_expire_minutes * 60
            )
            
            logger.info(f"Usuário registrado com sucesso: {user_data.email}")
            return AuthResponse(user=user, session=token)
            
        except ValueError as e:
            # Email já existe
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Erro ao registrar usuário: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

    async def login(self, email: str, password: str) -> AuthResponse:
        """Autentica um usuário"""
        try:
            # Autentica com o banco de dados
            user_dict = await self.user_repository.authenticate_user(email, password)
            
            if not user_dict:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciais inválidas"
                )
            
            user = UserResponse(
                id=user_dict["id"],
                email=user_dict["email"],
                full_name=user_dict["full_name"],
                created_at=user_dict["created_at"],
                updated_at=user_dict.get("updated_at")
            )
            
            # Gera tokens
            access_token = self._create_access_token(
                data={"sub": user_dict["email"], "user_id": user_dict["id"]}
            )
            
            token = Token(
                access_token=access_token,
                token_type="bearer",
                expires_in=self.access_token_expire_minutes * 60
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
            email: Optional[str] = payload.get("sub")
            user_id: Optional[str] = payload.get("user_id")
            
            if email is None or user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token inválido"
                )
            
            # Busca o usuário no banco de dados
            user_dict = await self.user_repository.get_user_by_id(user_id)
            
            if not user_dict:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuário não encontrado"
                )
            
            user = UserResponse(
                id=user_dict["id"],
                email=user_dict["email"],
                full_name=user_dict["full_name"],
                created_at=user_dict["created_at"],
                updated_at=user_dict.get("updated_at")
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
            # No modelo stateless com JWT, o logout é feito no cliente
            # Aqui podemos adicionar lógica adicional se necessário (blacklist de tokens, etc.)
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
