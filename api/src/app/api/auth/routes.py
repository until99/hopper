from sqlalchemy.orm import Session
import logging
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from api.auth import crud
from api.auth.models import AuthUserSchema, LoginResponse, UserInfo
from api.auth.utils import create_access_token, verify_token, ACCESS_TOKEN_EXPIRE_MINUTES
from api.user.models import User
from db import SessionLocal

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login", response_model=LoginResponse, status_code=200)
def login(
    *, db: Session = Depends(get_db), payload: AuthUserSchema, request: Request
):
    """Authenticate user and return access token."""
    logger.info(f"Login attempt for email: {payload.email}")

    try:
        user = crud.authenticate_user(db, payload)
        if not user:
            logger.warning(f"Authentication failed for email: {payload.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.email)}, expires_delta=access_token_expires
        )

        # Cria objeto de resposta manualmente para evitar problemas de tipo
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        }
        
        logger.info(f"User authenticated successfully: {user.email}")
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user_data["id"],
            email=user_data["email"],
            name=user_data["name"],
            role=user_data["role"],
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during authentication for email {payload.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal server error"
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token."""
    token = credentials.credentials
    email = verify_token(token)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


@router.get("/me", response_model=dict)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "status": current_user.status,
    }
