import asyncio
import sqlite3
import os
from pathlib import Path

async def init_sqlite_database():
    """Inicializa o banco de dados SQLite"""
    # Caminho para o banco de dados
    db_path = "hopper.db"
    
    # Remove o banco existente se existir
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Banco de dados existente removido: {db_path}")
    
    # Conecta ao SQLite e executa o script de inicialização
    conn = sqlite3.connect(db_path)
    
    # Lê o script SQL
    script_path = Path(__file__).parent / "init_sqlite.sql"
    with open(script_path, 'r', encoding='utf-8') as f:
        sql_script = f.read()
    
    # Executa o script
    conn.executescript(sql_script)
    conn.commit()
    conn.close()
    
    print(f"Banco de dados SQLite inicializado: {db_path}")

if __name__ == "__main__":
    asyncio.run(init_sqlite_database())
