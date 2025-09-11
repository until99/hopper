from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    """Modelo para criação de categoria"""
    name: str = Field(..., min_length=1, max_length=100, description="Nome da categoria")
    color: str = Field(..., pattern="^(blue|green|emerald|violet|yellow|slate)$", description="Cor da categoria")
    description: Optional[str] = Field(None, max_length=500, description="Descrição da categoria")


class CategoryUpdate(BaseModel):
    """Modelo para atualização de categoria"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Nome da categoria")
    color: Optional[str] = Field(None, pattern="^(blue|green|emerald|violet|yellow|slate)$", description="Cor da categoria")
    description: Optional[str] = Field(None, max_length=500, description="Descrição da categoria")


class CategoryResponse(BaseModel):
    """Modelo de resposta para categoria"""
    id: str
    name: str
    color: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    dashboard_count: int = 0  # Número de dashboards usando esta categoria


class CategoryListResponse(BaseModel):
    """Modelo de resposta para lista de categorias"""
    categories: list[CategoryResponse]
    total: int
