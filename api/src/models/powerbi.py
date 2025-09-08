from pydantic import BaseModel


class ReportUpdateRequest(BaseModel):
    name: str