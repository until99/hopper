from fastapi import HTTPException, status, Depends
from databases import Database

try:
    from ..models.dashboard import DashboardCategoryAssign
    from ..repositories.dashboard_repository import DashboardRepository
    from ..repositories.category_repository import CategoryRepository
    from ..api.database import get_database
    from ..api.logger import get_logger
except ImportError:
    from models.dashboard import DashboardCategoryAssign
    from repositories.dashboard_repository import DashboardRepository
    from repositories.category_repository import CategoryRepository
    from api.database import get_database
    from api.logger import get_logger

logger = get_logger("hopper.api.dashboard_controller")


class DashboardController:
    def __init__(self, database: Database = Depends(get_database)):
        self.dashboard_repository = DashboardRepository(database)
        self.category_repository = CategoryRepository(database)

    async def get_all_dashboards_with_categories(self) -> list:
        """Lista todos os dashboards com suas categorias"""
        logger.info("Listando dashboards com categorias")
        
        try:
            dashboards = await self.dashboard_repository.get_all_dashboards_with_categories()
            return dashboards
            
        except Exception as e:
            logger.error(f"Erro ao listar dashboards: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve dashboards"
            )

    async def assign_category_to_dashboard(self, assignment: DashboardCategoryAssign) -> dict:
        """Atribui uma categoria a um dashboard"""
        logger.info(f"Atribuindo categoria {assignment.category_id} ao dashboard {assignment.dashboard_id}")
        
        # Verifica se a categoria existe
        if not await self.category_repository.category_exists(assignment.category_id):
            logger.warning(f"Categoria não encontrada: {assignment.category_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        try:
            success = await self.dashboard_repository.assign_category_to_dashboard(assignment)
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to assign category to dashboard"
                )
            
            logger.info(f"Categoria atribuída com sucesso: {assignment.dashboard_id}")
            return {"message": "Category assigned successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao atribuir categoria: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to assign category to dashboard"
            )

    async def get_dashboard_category(self, dashboard_id: str) -> dict:
        """Busca a categoria atribuída a um dashboard"""
        logger.info(f"Buscando categoria do dashboard: {dashboard_id}")
        
        try:
            category = await self.dashboard_repository.get_dashboard_category(dashboard_id)
            
            if category:
                return {
                    "dashboard_id": dashboard_id,
                    "category": category
                }
            else:
                return {
                    "dashboard_id": dashboard_id,
                    "category": None
                }
                
        except Exception as e:
            logger.error(f"Erro ao buscar categoria do dashboard: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve dashboard category"
            )

    async def remove_category_from_dashboard(self, dashboard_id: str) -> dict:
        """Remove a categoria de um dashboard"""
        logger.info(f"Removendo categoria do dashboard: {dashboard_id}")
        
        try:
            success = await self.dashboard_repository.remove_category_from_dashboard(dashboard_id)
            
            if not success:
                # Não é necessariamente um erro se não havia categoria atribuída
                logger.info(f"Nenhuma categoria encontrada para remover do dashboard {dashboard_id}")
            
            return {"message": "Category removed successfully"}
            
        except Exception as e:
            logger.error(f"Erro ao remover categoria: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to remove category from dashboard"
            )
