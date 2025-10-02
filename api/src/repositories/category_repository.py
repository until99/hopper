from typing import List, Optional
from databases import Database

try:
    from ..models.category import CategoryCreate, CategoryUpdate, CategoryResponse
    from ..api.logger import get_logger
except ImportError:
    from models.category import CategoryCreate, CategoryUpdate, CategoryResponse
    from api.logger import get_logger

logger = get_logger("hopper.api.category_repository")


class CategoryRepository:
    def __init__(self, database: Database):
        self.database = database

    async def create_category(self, category_data: CategoryCreate) -> str:
        """Cria uma nova categoria"""
        logger.info(f"Criando categoria: {category_data.name}")
        
        query = """
        INSERT INTO categories (name, color, description)
        VALUES (:name, :color, :description)
        RETURNING id
        """
        
        values = {
            "name": category_data.name,
            "color": category_data.color,
            "description": category_data.description
        }
        
        result = await self.database.fetch_one(query=query, values=values)
        if result is None:
            raise RuntimeError("Failed to create category")
        
        category_id = result["id"]
        
        logger.info(f"Categoria criada com ID: {category_id}")
        return category_id

    async def get_category_by_id(self, category_id: str) -> Optional[CategoryResponse]:
        """Busca uma categoria por ID"""
        logger.info(f"Buscando categoria por ID: {category_id}")
        
        query = """
        SELECT c.*, 
               COUNT(d.id) as dashboard_count
        FROM categories c
        LEFT JOIN dashboard_categories dc ON c.id = dc.category_id
        LEFT JOIN dashboards d ON dc.dashboard_id = d.id
        WHERE c.id = :category_id
        GROUP BY c.id, c.name, c.color, c.description, c.created_at, c.updated_at
        """
        
        result = await self.database.fetch_one(query=query, values={"category_id": category_id})
        
        if result:
            return CategoryResponse(**dict(result))
        return None

    async def get_all_categories(self) -> List[CategoryResponse]:
        """Lista todas as categorias"""
        logger.info("Listando todas as categorias")
        
        query = """
        SELECT c.*, 
               COUNT(d.id) as dashboard_count
        FROM categories c
        LEFT JOIN dashboard_categories dc ON c.id = dc.category_id
        LEFT JOIN dashboards d ON dc.dashboard_id = d.id
        GROUP BY c.id, c.name, c.color, c.description, c.created_at, c.updated_at
        ORDER BY c.name
        """
        
        results = await self.database.fetch_all(query=query)
        return [CategoryResponse(**dict(result)) for result in results]

    async def update_category(self, category_id: str, category_data: CategoryUpdate) -> bool:
        """Atualiza uma categoria"""
        logger.info(f"Atualizando categoria: {category_id}")
        
        # Constrói a query dinamicamente baseado nos campos fornecidos
        update_fields = []
        values = {"category_id": category_id}
        
        if category_data.name is not None:
            update_fields.append("name = :name")
            values["name"] = category_data.name
            
        if category_data.color is not None:
            update_fields.append("color = :color")
            values["color"] = category_data.color
            
        if category_data.description is not None:
            update_fields.append("description = :description")
            values["description"] = category_data.description
        
        if not update_fields:
            logger.warning("Nenhum campo para atualizar")
            return False
        
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        
        query = f"""
        UPDATE categories 
        SET {', '.join(update_fields)}
        WHERE id = :category_id
        """
        
        result = await self.database.execute(query=query, values=values)
        return result > 0

    async def delete_category(self, category_id: str) -> bool:
        """Remove uma categoria"""
        logger.info(f"Removendo categoria: {category_id}")
        
        # Primeiro, remove todas as associações com dashboards
        await self.database.execute(
            "DELETE FROM dashboard_categories WHERE category_id = :category_id",
            values={"category_id": category_id}
        )
        
        # Em seguida, remove a categoria
        query = "DELETE FROM categories WHERE id = :category_id"
        result = await self.database.execute(query=query, values={"category_id": category_id})
        
        success = result > 0
        if success:
            logger.info(f"Categoria {category_id} removida com sucesso")
        else:
            logger.warning(f"Categoria {category_id} não encontrada para remoção")
        
        return success

    async def category_exists(self, category_id: str) -> bool:
        """Verifica se uma categoria existe"""
        query = "SELECT COUNT(*) as count FROM categories WHERE id = :category_id"
        result = await self.database.fetch_one(query=query, values={"category_id": category_id})
        return result is not None and result["count"] > 0

    async def category_name_exists(self, name: str, exclude_id: Optional[str] = None) -> bool:
        """Verifica se já existe uma categoria com o nome especificado"""
        query = "SELECT COUNT(*) as count FROM categories WHERE LOWER(name) = LOWER(:name)"
        values = {"name": name}
        
        if exclude_id:
            query += " AND id != :exclude_id"
            values["exclude_id"] = exclude_id
        
        result = await self.database.fetch_one(query=query, values=values)
        return result is not None and result["count"] > 0
