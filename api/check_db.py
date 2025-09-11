import sqlite3
import os

# Conecta ao banco de dados
db_path = "hopper.db"
if not os.path.exists(db_path):
    print(f"Banco de dados {db_path} não encontrado!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=== SCHEMA DO BANCO ===")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tabelas encontradas:")
for table in tables:
    print(f"  - {table[0]}")

print("\n=== DADOS DAS CATEGORIAS ===")
try:
    cursor.execute("SELECT * FROM categories;")
    categories = cursor.fetchall()
    print(f"Total de categorias: {len(categories)}")
    for cat in categories:
        print(f"  ID: {cat[0]}, Nome: {cat[1]}, Cor: {cat[2]}")
except Exception as e:
    print(f"Erro ao buscar categorias: {e}")

print("\n=== DADOS DOS DASHBOARDS ===")
try:
    cursor.execute("SELECT * FROM dashboards;")
    dashboards = cursor.fetchall()
    print(f"Total de dashboards: {len(dashboards)}")
    for dash in dashboards:
        print(f"  ID: {dash[0]}, Dashboard_ID: {dash[1]}, Title: {dash[2]}")
except Exception as e:
    print(f"Erro ao buscar dashboards: {e}")

print("\n=== DADOS DAS ASSOCIAÇÕES DASHBOARD-CATEGORIA ===")
try:
    cursor.execute("SELECT * FROM dashboard_categories;")
    associations = cursor.fetchall()
    print(f"Total de associações: {len(associations)}")
    for assoc in associations:
        print(f"  ID: {assoc[0]}, Dashboard_ID: {assoc[1]}, Category_ID: {assoc[2]}")
except Exception as e:
    print(f"Erro ao buscar associações: {e}")

conn.close()
