from fastapi import APIRouter, Depends, status

try:
    from ..models.dashboard import DashboardCategoryAssign
    from ..controllers.dashboard_controller import DashboardController
    from ..utils import get_current_active_user
    from ..models import UserResponse
    from ..api.logger import get_logger
except ImportError:
    from models.dashboard import DashboardCategoryAssign
    from controllers.dashboard_controller import DashboardController
    from utils import get_current_active_user
    from models import UserResponse
    from api.logger import get_logger

logger = get_logger("hopper.api.dashboard_routes")

router = APIRouter(prefix="/dashboards", tags=["Dashboards"])


router = APIRouter(prefix="/dashboards", tags=["Dashboards"])


@router.get("/", response_model=list)
async def get_all_dashboards_with_categories(
    current_user: UserResponse = Depends(get_current_active_user),
    dashboard_controller: DashboardController = Depends(DashboardController)
):
    """Lista todos os dashboards com suas categorias"""
    logger.info(f"Usuário {current_user.email} listando dashboards com categorias")
    return await dashboard_controller.get_all_dashboards_with_categories()


@router.post("/assign-category")
async def assign_category_to_dashboard(
    assignment: DashboardCategoryAssign,
    current_user: UserResponse = Depends(get_current_active_user),
    dashboard_controller: DashboardController = Depends(DashboardController)
):
    """Atribui uma categoria a um dashboard"""
    logger.info(f"Usuário {current_user.email} atribuindo categoria {assignment.category_id} ao dashboard {assignment.dashboard_id}")
    return await dashboard_controller.assign_category_to_dashboard(assignment)


@router.get("/{dashboard_id}/category")
async def get_dashboard_category(
    dashboard_id: str,
    current_user: UserResponse = Depends(get_current_active_user),
    dashboard_controller: DashboardController = Depends(DashboardController)
):
    """Busca a categoria atribuída a um dashboard"""
    logger.info(f"Usuário {current_user.email} buscando categoria do dashboard: {dashboard_id}")
    return await dashboard_controller.get_dashboard_category(dashboard_id)


@router.delete("/{dashboard_id}/category")
async def remove_category_from_dashboard(
    dashboard_id: str,
    current_user: UserResponse = Depends(get_current_active_user),
    dashboard_controller: DashboardController = Depends(DashboardController)
):
    """Remove a categoria de um dashboard"""
    logger.info(f"Usuário {current_user.email} removendo categoria do dashboard: {dashboard_id}")
    return await dashboard_controller.remove_category_from_dashboard(dashboard_id)
