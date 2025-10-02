from pydantic import BaseModel
from typing import Optional


class DashboardCategoryAssign(BaseModel):
    """Modelo para atribuir categoria a um dashboard"""
    dashboard_id: str
    category_id: str


class DashboardCreate(BaseModel):
    """Modelo para criação de dashboard"""
    dashboard_id: str
    title: str
    description: Optional[str] = None
    workspace_id: str
    workspace: str


class DashboardResponse(BaseModel):
    """Modelo de resposta para dashboard"""
    id: str
    dashboard_id: str
    title: str
    description: Optional[str] = None
    workspace_id: str
    workspace: str
    category: Optional[str] = None
    category_color: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
