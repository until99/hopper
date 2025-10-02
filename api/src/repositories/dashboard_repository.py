from typing import Optional, List
from databases import Database

try:
    from ..models.dashboard import DashboardCategoryAssign
    from ..api.logger import get_logger
except ImportError:
    from models.dashboard import DashboardCategoryAssign
    from api.logger import get_logger

logger = get_logger("hopper.api.dashboard_repository")


class DashboardRepository:
    def __init__(self, database: Database):
        self.database = database

    async def get_all_dashboards_with_categories(self) -> List[dict]:
        """Lista todos os dashboards com suas categorias"""
        logger.info("Listando todos os dashboards com categorias")
        
        query = """
        SELECT 
            d.id,
            d.dashboard_id,
            d.title,
            d.description,
            d.workspace_id,
            d.workspace,
            d.created_at,
            d.updated_at,
            c.id as category_id,
            c.name as category_name,
            c.color as category_color
        FROM dashboards d
        LEFT JOIN dashboard_categories dc ON d.id = dc.dashboard_id
        LEFT JOIN categories c ON dc.category_id = c.id
        ORDER BY d.title
        """
        
        results = await self.database.fetch_all(query=query)
        
        # Agrupa os resultados por dashboard
        dashboards_dict = {}
        for result in results:
            dashboard_id = result["id"]
            if dashboard_id not in dashboards_dict:
                dashboards_dict[dashboard_id] = {
                    "id": result["id"],
                    "dashboard_id": result["dashboard_id"],
                    "title": result["title"],
                    "description": result["description"],
                    "workspace_id": result["workspace_id"],
                    "workspace": result["workspace"],
                    "created_at": result["created_at"],
                    "updated_at": result["updated_at"],
                    "categories": []
                }
            
            # Adiciona a categoria se existir
            if result["category_id"]:
                dashboards_dict[dashboard_id]["categories"].append({
                    "id": result["category_id"],
                    "name": result["category_name"],
                    "color": result["category_color"]
                })
        
        return list(dashboards_dict.values())

    async def assign_category_to_dashboard(self, assignment: DashboardCategoryAssign) -> bool:
        """Atribui uma categoria a um dashboard"""
        logger.info(f"Atribuindo categoria {assignment.category_id} ao dashboard {assignment.dashboard_id}")
        
        # Primeiro, verifica se o dashboard existe na tabela dashboards
        dashboard_exists_query = "SELECT COUNT(*) as count FROM dashboards WHERE dashboard_id = :dashboard_id"
        result = await self.database.fetch_one(
            query=dashboard_exists_query, 
            values={"dashboard_id": assignment.dashboard_id}
        )
        
        dashboard_exists = result is not None and result["count"] > 0
        
        if not dashboard_exists:
            # Se o dashboard não existe, precisamos criar um registro básico
            # Isto é necessário porque os dashboards vêm do PowerBI, não do nosso banco
            logger.info(f"Dashboard {assignment.dashboard_id} não existe, criando registro básico")
            
            insert_dashboard_query = """
            INSERT INTO dashboards (dashboard_id, title, description, workspace_id, workspace)
            VALUES (:dashboard_id, :title, :description, :workspace_id, :workspace)
            """
            
            await self.database.execute(
                query=insert_dashboard_query,
                values={
                    "dashboard_id": assignment.dashboard_id,
                    "title": f"Dashboard {assignment.dashboard_id}",
                    "description": "Dashboard criado automaticamente",
                    "workspace_id": "unknown",
                    "workspace": "Unknown Workspace"
                }
            )
        
        # Verifica se já existe uma associação
        existing_query = """
        SELECT COUNT(*) as count 
        FROM dashboard_categories dc
        JOIN dashboards d ON dc.dashboard_id = d.id
        WHERE d.dashboard_id = :dashboard_id
        """
        
        existing_result = await self.database.fetch_one(
            query=existing_query,
            values={"dashboard_id": assignment.dashboard_id}
        )
        
        if existing_result is not None and existing_result["count"] > 0:
            # Remove a associação existente
            delete_query = """
            DELETE FROM dashboard_categories 
            WHERE dashboard_id IN (
                SELECT id FROM dashboards WHERE dashboard_id = :dashboard_id
            )
            """
            await self.database.execute(
                query=delete_query,
                values={"dashboard_id": assignment.dashboard_id}
            )
        
        # Insere a nova associação
        insert_query = """
        INSERT INTO dashboard_categories (dashboard_id, category_id)
        SELECT d.id, :category_id
        FROM dashboards d
        WHERE d.dashboard_id = :dashboard_id
        """
        
        result = await self.database.execute(
            query=insert_query,
            values={
                "dashboard_id": assignment.dashboard_id,
                "category_id": assignment.category_id
            }
        )
        
        success = result > 0
        if success:
            logger.info(f"Categoria atribuída com sucesso ao dashboard {assignment.dashboard_id}")
        else:
            logger.warning(f"Falha ao atribuir categoria ao dashboard {assignment.dashboard_id}")
        
        return success

    async def get_dashboard_category(self, dashboard_id: str) -> Optional[dict]:
        """Busca a categoria atribuída a um dashboard"""
        query = """
        SELECT c.id, c.name, c.color, c.description
        FROM dashboard_categories dc
        JOIN dashboards d ON dc.dashboard_id = d.id
        JOIN categories c ON dc.category_id = c.id
        WHERE d.dashboard_id = :dashboard_id
        """
        
        result = await self.database.fetch_one(
            query=query,
            values={"dashboard_id": dashboard_id}
        )
        
        if result:
            return dict(result)
        return None

    async def remove_category_from_dashboard(self, dashboard_id: str) -> bool:
        """Remove a categoria de um dashboard"""
        logger.info(f"Removendo categoria do dashboard {dashboard_id}")
        
        query = """
        DELETE FROM dashboard_categories 
        WHERE dashboard_id IN (
            SELECT id FROM dashboards WHERE dashboard_id = :dashboard_id
        )
        """
        
        result = await self.database.execute(
            query=query,
            values={"dashboard_id": dashboard_id}
        )
        
        success = result > 0
        if success:
            logger.info(f"Categoria removida com sucesso do dashboard {dashboard_id}")
        else:
            logger.warning(f"Nenhuma categoria encontrada para remover do dashboard {dashboard_id}")
        
        return success
