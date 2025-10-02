from pydantic import BaseModel, Field
from sqlalchemy.sql import func
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Text,
)
from datetime import datetime

from db import Base


# SQLAlchemy Model


class Log(Base):
    __tablename__ = "logs"
    __table_args__ = {"schema": "vitalis"}

    id = Column(
        Integer,
        primary_key=True,
    )
    level = Column(
        String(20),
        nullable=False,
    )
    message = Column(
        Text,
        nullable=False,
    )
    module = Column(
        String(100),
        nullable=True,
    )
    function = Column(
        String(100),
        nullable=True,
    )
    line_number = Column(
        Integer,
        nullable=True,
    )
    user_id = Column(
        Integer,
        nullable=True,
    )
    request_id = Column(
        String(100),
        nullable=True,
    )
    extra_data = Column(
        Text,
        nullable=True,
    )
    created_at = Column(
        DateTime,
        default=func.now(),
        nullable=False,
    )

    def __init__(self, level, message, module=None, function=None, line_number=None, 
                 user_id=None, request_id=None, extra_data=None):
        self.level = level
        self.message = message
        self.module = module
        self.function = function
        self.line_number = line_number
        self.user_id = user_id
        self.request_id = request_id
        self.extra_data = extra_data


# Pydantic Model


class LogSchema(BaseModel):
    level: str = Field(..., min_length=1, max_length=20)
    message: str = Field(..., min_length=1)
    module: str | None = Field(None, max_length=100)
    function: str | None = Field(None, max_length=100)
    line_number: int | None = None
    user_id: int | None = None
    request_id: str | None = Field(None, max_length=100)
    extra_data: str | None = None


class LogDB(LogSchema):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True