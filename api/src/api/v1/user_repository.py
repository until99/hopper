from typing import Optional, Dict, Any
from databases import Database
from passlib.context import CryptContext
from datetime import datetime
import uuid
from ..logger import get_logger

logger = get_logger("hopper.api.user_repository")

class UserRepository:
    def __init__(self, database: Database):
        self.db = database
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def _hash_password(self, password: str) -> str:
        """Hash da senha usando bcrypt"""
        return self.pwd_context.hash(password)
    
    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica se a senha está correta"""
        return self.pwd_context.verify(plain_password, hashed_password)
    
    async def create_user(self, email: str, password: str, full_name: Optional[str] = None) -> Dict[str, Any]:
        """Cria um novo usuário no banco de dados"""
        try:
            # Verifica se o usuário já existe
            existing_user = await self.get_user_by_email(email)
            if existing_user:
                raise ValueError("Email já está em uso")
            
            # Hash da senha
            hashed_password = self._hash_password(password)
            user_id = str(uuid.uuid4())
            
            # Query compatible with both PostgreSQL and SQLite
            query = """
                INSERT INTO users (id, email, password_hash, full_name)
                VALUES (:id, :email, :password_hash, :full_name)
            """
            
            values = {
                "id": user_id,
                "email": email,
                "password_hash": hashed_password,
                "full_name": full_name
            }
            
            await self.db.execute(query, values)
            
            # Busca o usuário recém-criado para retornar
            created_user = await self.get_user_by_id(user_id)
            if created_user:
                logger.info(f"Usuário criado com sucesso: {email}")
                return created_user
            else:
                raise RuntimeError("Falha ao criar usuário")
                
        except Exception as e:
            logger.error(f"Erro ao criar usuário {email}: {str(e)}")
            raise
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Busca um usuário pelo email"""
        try:
            query = """
                SELECT id, email, password_hash, full_name, created_at, updated_at, is_active
                FROM users 
                WHERE email = :email AND is_active = 1
            """
            
            result = await self.db.fetch_one(query, {"email": email})
            return dict(result) if result else None
            
        except Exception as e:
            logger.error(f"Erro ao buscar usuário por email {email}: {str(e)}")
            return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Busca um usuário pelo ID"""
        try:
            query = """
                SELECT id, email, password_hash, full_name, created_at, updated_at, is_active
                FROM users 
                WHERE id = :id AND is_active = 1
            """
            
            result = await self.db.fetch_one(query, {"id": user_id})
            return dict(result) if result else None
            
        except Exception as e:
            logger.error(f"Erro ao buscar usuário por ID {user_id}: {str(e)}")
            return None
    
    async def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Autentica um usuário com email e senha"""
        try:
            user = await self.get_user_by_email(email)
            if not user:
                return None
            
            if not self._verify_password(password, user["password_hash"]):
                return None
            
            # Remove o hash da senha do retorno
            user_data = user.copy()
            del user_data["password_hash"]
            
            logger.info(f"Usuário autenticado com sucesso: {email}")
            return user_data
            
        except Exception as e:
            logger.error(f"Erro ao autenticar usuário {email}: {str(e)}")
            return None
    
    async def update_user(self, user_id: str, **kwargs) -> Optional[Dict[str, Any]]:
        """Atualiza dados do usuário"""
        try:
            # Remove campos que não devem ser atualizados diretamente
            allowed_fields = ["full_name", "email"]
            update_data = {k: v for k, v in kwargs.items() if k in allowed_fields and v is not None}
            
            if not update_data:
                return await self.get_user_by_id(user_id)
            
            # Constrói a query de atualização dinamicamente
            set_clause = ", ".join([f"{field} = :{field}" for field in update_data.keys()])
            query = f"""
                UPDATE users 
                SET {set_clause}, updated_at = CURRENT_TIMESTAMP
                WHERE id = :user_id AND is_active = 1
            """
            
            values = {**update_data, "user_id": user_id}
            await self.db.execute(query, values)
            
            # Busca o usuário atualizado
            updated_user = await self.get_user_by_id(user_id)
            if updated_user:
                logger.info(f"Usuário atualizado com sucesso: {user_id}")
                return updated_user
            else:
                return None
                
        except Exception as e:
            logger.error(f"Erro ao atualizar usuário {user_id}: {str(e)}")
            return None
    
    async def deactivate_user(self, user_id: str) -> bool:
        """Desativa um usuário (soft delete)"""
        try:
            query = """
                UPDATE users 
                SET is_active = 0, updated_at = CURRENT_TIMESTAMP
                WHERE id = :user_id
            """
            
            await self.db.execute(query, {"user_id": user_id})
            logger.info(f"Usuário desativado com sucesso: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Erro ao desativar usuário {user_id}: {str(e)}")
            return False
