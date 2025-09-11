from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Auth Models
class UserLogin(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: Optional[str] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None


class AuthResponse(BaseModel):
    user: UserResponse
    session: Token
