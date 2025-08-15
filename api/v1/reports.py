from fastapi import APIRouter

from ..schemas import GroupsResponse

from ..services.powerbi import get_all_groups

router = APIRouter()


@router.get("/report/groups", response_model=GroupsResponse)
def report_groups() -> GroupsResponse:
    """Retorna a lista de grupos do Power BI."""
    return GroupsResponse(**get_all_groups())
