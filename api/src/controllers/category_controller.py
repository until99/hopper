from fastapi import HTTPException, status, Depends
from databases import Database

try:
    from ..models.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryListResponse
    from ..repositories.category_repository import CategoryRepository
    from ..api.database import get_database
    from ..api.logger import get_logger
except ImportError:
    from models.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryListResponse
    from repositories.category_repository import CategoryRepository
    from api.database import get_database
    from api.logger import get_logger

logger = get_logger("hopper.api.category_controller")


class CategoryController:
    def __init__(self, database: Database = Depends(get_database)):
        self.repository = CategoryRepository(database)

    async def create_category(self, category_data: CategoryCreate) -> CategoryResponse:
        """Cria uma nova categoria"""
        logger.info(f"Criando nova categoria: {category_data.name}")
        
        # Verifica se já existe uma categoria com o mesmo nome
        if await self.repository.category_name_exists(category_data.name):
            logger.warning(f"Tentativa de criar categoria com nome duplicado: {category_data.name}")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A category with this name already exists"
            )
        
        try:
            category_id = await self.repository.create_category(category_data)
            category = await self.repository.get_category_by_id(category_id)
            
            if category is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to retrieve created category"
                )
            
            logger.info(f"Categoria criada com sucesso: {category_id}")
            return category
            
        except Exception as e:
            logger.error(f"Erro ao criar categoria: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create category"
            )

    async def get_category_by_id(self, category_id: str) -> CategoryResponse:
        """Busca uma categoria por ID"""
        logger.info(f"Buscando categoria por ID: {category_id}")
        
        category = await self.repository.get_category_by_id(category_id)
        
        if category is None:
            logger.warning(f"Categoria não encontrada: {category_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        return category

    async def get_all_categories(self) -> CategoryListResponse:
        """Lista todas as categorias"""
        logger.info("Listando todas as categorias")
        
        try:
            categories = await self.repository.get_all_categories()
            
            return CategoryListResponse(
                categories=categories,
                total=len(categories)
            )
            
        except Exception as e:
            logger.error(f"Erro ao listar categorias: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve categories"
            )

    async def update_category(self, category_id: str, category_data: CategoryUpdate) -> CategoryResponse:
        """Atualiza uma categoria"""
        logger.info(f"Atualizando categoria: {category_id}")
        
        # Verifica se a categoria existe
        if not await self.repository.category_exists(category_id):
            logger.warning(f"Tentativa de atualizar categoria inexistente: {category_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        # Se o nome está sendo alterado, verifica se já existe outro com o mesmo nome
        if category_data.name is not None:
            if await self.repository.category_name_exists(category_data.name, exclude_id=category_id):
                logger.warning(f"Tentativa de atualizar categoria com nome duplicado: {category_data.name}")
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A category with this name already exists"
                )
        
        try:
            success = await self.repository.update_category(category_id, category_data)
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update category"
                )
            
            # Retorna a categoria atualizada
            category = await self.repository.get_category_by_id(category_id)
            if category is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to retrieve updated category"
                )
            
            logger.info(f"Categoria atualizada com sucesso: {category_id}")
            return category
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao atualizar categoria: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update category"
            )

    async def delete_category(self, category_id: str) -> dict:
        """Remove uma categoria"""
        logger.info(f"Removendo categoria: {category_id}")
        
        # Verifica se a categoria existe
        if not await self.repository.category_exists(category_id):
            logger.warning(f"Tentativa de remover categoria inexistente: {category_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        try:
            success = await self.repository.delete_category(category_id)
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete category"
                )
            
            logger.info(f"Categoria removida com sucesso: {category_id}")
            return {"message": "Category deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao remover categoria: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete category"
            )
