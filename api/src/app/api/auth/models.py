from pydantic import BaseModel, Field


# Pydantic Models


class AuthUserSchema(BaseModel):
    email: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=255)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    name: str
    role: str


class TokenData(BaseModel):
    email: str | None = None


class UserInfo(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str