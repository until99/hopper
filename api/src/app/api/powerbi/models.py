from pydantic import BaseModel, Field

# Pydantic Model


class GroupSchema(BaseModel):
    id: str = Field(..., description="The unique identifier for the group")
    name: str = Field(..., description="The name of the group")


class GroupUpdateSchema(BaseModel):
    name: str | None = Field(None, description="The name of the group")


class ReportSchema(BaseModel):
    id: str = Field(..., description="The unique identifier for the report")
    name: str = Field(..., description="The name of the report")
    dataset_id: str = Field(..., description="The unique identifier for the dataset")
    group_id: str = Field(..., description="The unique identifier for the group")


class ReportUpdateSchema(BaseModel):
    name: str | None = Field(None, description="The name of the report")
    dataset_id: str | None = Field(None, description="The unique identifier for the dataset")
    group_id: str | None = Field(None, description="The unique identifier for the group")
