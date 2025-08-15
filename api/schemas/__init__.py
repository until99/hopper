from pydantic import BaseModel, Field
from typing import List


class Group(BaseModel):
    id: str = Field(..., description="UUID do workspace/grupo no Power BI")
    isReadOnly: bool = Field(..., description="Indica se o workspace é somente leitura")
    isOnDedicatedCapacity: bool = Field(
        ..., description="Indica se está em capacidade dedicada"
    )
    type: str = Field(..., description="Tipo do grupo (ex: Workspace)")
    name: str = Field(..., description="Nome do workspace")


class GroupsResponse(BaseModel):
    groups: List[Group]


__all__ = [
    "Group",
    "GroupsResponse",
]
