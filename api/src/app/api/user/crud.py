from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import logging

from api.user.models import User, UserSchema, UserUpdateSchema
from api.user.utils import hash_password
from sqlalchemy import select

logger = logging.getLogger(__name__)


def user(db_session: Session, payload: UserSchema):
    logger.info(f"Creating new user in database with email: {payload.email}")
    try:
        user = User(
            name=payload.name,
            email=payload.email,
            password=hash_password(payload.password),
            role=payload.role,
            status=payload.status,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        logger.info(f"User created in database with ID: {user.id}")
        return user
    except IntegrityError as e:
        logger.error(f"Failed to create user with email {payload.email}: {str(e)}")
        db_session.rollback()
        raise


def get(db_session: Session, id: int):
    logger.debug(f"Fetching user from database with ID: {id}")
    stmt = select(User).where(User.id == id)
    user = db_session.execute(stmt).scalar_one_or_none()
    if user:
        logger.debug(f"User found in database: ID {id}")
    else:
        logger.debug(f"No user found in database with ID: {id}")
    return user


def get_all(db_session: Session):
    logger.info("Fetching all users from database")
    try:
        stmt = select(User)
        users = db_session.execute(stmt).scalars().all()
        logger.info(f"Retrieved {len(users)} users from database")
        return users
    except Exception as e:
        logger.error(f"Error fetching all users from database: {str(e)}")
        db_session.rollback()
        raise


def search(db_session: Session, query: str):
    logger.info(f"Searching users in database with query: '{query}'")
    try:
        stmt = select(User).where(getattr(User, "name").ilike(f"%{query}%"))
        users = db_session.execute(stmt).scalars().all()
        logger.info(
            f"Search in database returned {len(users)} users for query: '{query}'"
        )
        return users
    except Exception as e:
        logger.error(
            f"Error searching users in database with query '{query}': {str(e)}"
        )
        db_session.rollback()
        raise


def get_all_where(db_session: Session, **kwargs):
    stmt = select(User).filter_by(**kwargs)
    return db_session.execute(stmt).scalars().all()


def put(db_session: Session, user: User, payload: UserUpdateSchema):
    logger.info(f"Updating user in database: ID {user.id}")
    try:
        update_data = payload.model_dump(exclude_unset=True)

        if "password" in update_data:
            update_data["password"] = hash_password(update_data["password"])
            logger.info(f"Password updated for user ID {user.id}")

        updated_fields = []
        for field, value in update_data.items():
            if field != "password":  # Don't log password values
                updated_fields.append(f"{field}={value}")
            else:
                updated_fields.append("password=***")
            setattr(user, field, value)

        logger.info(f"Updated user {user.id} fields: {', '.join(updated_fields)}")
        db_session.commit()
        logger.info(f"User {user.id} successfully updated in database")
        return user
    except IntegrityError as e:
        logger.error(f"Failed to update user {user.id}: {str(e)}")
        db_session.rollback()
        raise


def delete(db_session: Session, id: int):
    logger.info(f"Deleting user from database: ID {id}")
    try:
        stmt = select(User).where(User.id == id)
        user = db_session.execute(stmt).scalar_one_or_none()

        if user:
            logger.info(f"Found user to delete: ID {id}, email: {user.email}")
            db_session.delete(user)
            db_session.commit()
            logger.info(f"User {id} successfully deleted from database")
        else:
            logger.warning(f"Attempted to delete non-existent user: ID {id}")

        return user
    except Exception as e:
        logger.error(f"Error deleting user {id} from database: {str(e)}")
        db_session.rollback()
        raise
