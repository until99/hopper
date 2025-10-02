from pydantic import BaseModel, Field
from sqlalchemy.sql import func
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
)

from db import Base


# SQLAlchemy Model


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "vitalis"}

    id = Column(
        Integer,
        primary_key=True,
    )
    name = Column(
        String(50),
        nullable=False,
    )
    email = Column(
        String(100),
        nullable=False,
        unique=True,
    )
    password = Column(
        String(255),
        nullable=False,
    )
    role = Column(
        String(50),
        nullable=False,
    )
    status = Column(
        String(50),
        nullable=False,
    )
    created_at = Column(
        DateTime,
        default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __init__(self, name, email, password, role, status):
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.status = status


# Pydantic Model


class UserSchema(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=255)
    role: str = Field(..., min_length=3, max_length=50)
    status: str = Field(..., min_length=3, max_length=50)


class UserUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=3, max_length=50)
    email: str | None = Field(None, min_length=3, max_length=100)
    password: str | None = Field(None, min_length=6, max_length=255)
    role: str | None = Field(None, min_length=3, max_length=50)
    status: str | None = Field(None, min_length=3, max_length=50)


class UserDB(UserSchema):
    id: int

    class Config:
        from_attributes = True
