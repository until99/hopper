from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import logging

from api.auth.models import AuthUserSchema
from api.user.models import User
from api.auth.utils import verify_password
from sqlalchemy import select

logger = logging.getLogger(__name__)


def authenticate_user(db: Session, payload: AuthUserSchema) -> User | None:
    """Authenticate a user by email and password."""
    try:
        stmt = select(User).where(User.email == payload.email)
        user = db.execute(stmt).scalar_one_or_none()

    except IntegrityError as e:
        logger.error(f"Database error during authentication: {e}")
        return None

    if user and verify_password(payload.password, str(user.password)):
        return user

    return None


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get a user by email."""
    try:
        stmt = select(User).where(User.email == email)
        return db.execute(stmt).scalar_one_or_none()
    except Exception as e:
        logger.error(f"Error fetching user by email {email}: {e}")
        return None
