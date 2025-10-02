import os
from databases import Database
from typing import Optional

class DatabaseManager:
    def __init__(self):
        self.database: Optional[Database] = None
        self._connection_string = self._get_connection_string()
    
    def _get_connection_string(self) -> str:
        """Constrói a string de conexão com o banco de dados SQLite"""
        db_path = os.getenv("DB_PATH", "hopper.db")
        return f"sqlite:///{db_path}"
    
    async def connect(self):
        """Conecta ao banco de dados"""
        if self.database is None:
            self.database = Database(self._connection_string)
            await self.database.connect()
    
    async def disconnect(self):
        """Desconecta do banco de dados"""
        if self.database is not None:
            await self.database.disconnect()
            self.database = None
    
    def get_database(self) -> Database:
        """Retorna a instância do banco de dados"""
        if self.database is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        return self.database

# Instância global do gerenciador de banco
db_manager = DatabaseManager()

async def get_database() -> Database:
    """Dependência para obter a instância do banco de dados"""
    return db_manager.get_database()
