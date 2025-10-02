from fastapi import APIRouter, Depends, status

try:
    from ..models.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryListResponse
    from ..controllers.category_controller import CategoryController
    from ..utils import get_current_active_user
    from ..models import UserResponse
    from ..api.logger import get_logger
except ImportError:
    from models.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryListResponse
    from controllers.category_controller import CategoryController
    from utils import get_current_active_user
    from models import UserResponse
    from api.logger import get_logger

logger = get_logger("hopper.api.category_routes")

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: UserResponse = Depends(get_current_active_user),
    category_controller: CategoryController = Depends(CategoryController)
):
    """Cria uma nova categoria"""
    logger.info(f"Usuário {current_user.email} criando categoria: {category_data.name}")
    return await category_controller.create_category(category_data)


@router.get("/", response_model=CategoryListResponse)
async def get_all_categories(
    current_user: UserResponse = Depends(get_current_active_user),
    category_controller: CategoryController = Depends(CategoryController)
):
    """Lista todas as categorias"""
    logger.info(f"Usuário {current_user.email} listando categorias")
    return await category_controller.get_all_categories()


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category_by_id(
    category_id: str,
    current_user: UserResponse = Depends(get_current_active_user),
    category_controller: CategoryController = Depends(CategoryController)
):
    """Busca uma categoria por ID"""
    logger.info(f"Usuário {current_user.email} buscando categoria: {category_id}")
    return await category_controller.get_category_by_id(category_id)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    current_user: UserResponse = Depends(get_current_active_user),
    category_controller: CategoryController = Depends(CategoryController)
):
    """Atualiza uma categoria"""
    logger.info(f"Usuário {current_user.email} atualizando categoria: {category_id}")
    return await category_controller.update_category(category_id, category_data)


@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user: UserResponse = Depends(get_current_active_user),
    category_controller: CategoryController = Depends(CategoryController)
):
    """Remove uma categoria"""
    logger.info(f"Usuário {current_user.email} removendo categoria: {category_id}")
    return await category_controller.delete_category(category_id)
