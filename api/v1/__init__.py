from fastapi import APIRouter
from .reports import router as dashboards_router

router = APIRouter()
router.include_router(dashboards_router, prefix="/dashboards", tags=["dashboards"])
