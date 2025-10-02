from typing import List
import logging

from fastapi import APIRouter, Depends, HTTPException, Path, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from api.user import crud
from api.user.models import UserDB, UserSchema, UserUpdateSchema
from db import SessionLocal

logger = logging.getLogger(__name__)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserDB, status_code=201)
def create_user(
    *, db: Session = Depends(get_db), payload: UserSchema, request: Request
):
    request_id = getattr(request.state, "request_id", "unknown")

    logger.info(
        f"Creating user with email: {payload.email}", extra={"request_id": request_id}
    )

    try:
        user = crud.user(db_session=db, payload=payload)
        logger.info(
            f"User created successfully with ID: {user.id}",
            extra={"request_id": request_id},
        )
        return user
    except IntegrityError:
        logger.warning(
            f"User creation failed - email already exists: {payload.email}",
            extra={"request_id": request_id},
        )
        raise HTTPException(
            status_code=409, detail="User with this email already exists"
        )


@router.get("/", response_model=List[UserDB])
def read_all_users(request: Request, db: Session = Depends(get_db)):
    request_id = getattr(request.state, "request_id", "unknown")

    logger.info("Retrieving all users", extra={"request_id": request_id})

    try:
        users = crud.get_all(db_session=db)
        logger.info(
            f"Retrieved {len(users)} users successfully",
            extra={"request_id": request_id},
        )
        return users
    except Exception as e:
        logger.error(
            f"Error retrieving users: {str(e)}", extra={"request_id": request_id}
        )
        raise HTTPException(status_code=500, detail="Error retrieving users")


@router.get("/search/", response_model=List[UserDB])
def search_users(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = None,
):
    request_id = getattr(request.state, "request_id", "unknown")

    if q is None:
        logger.warning(
            "Search attempted without query parameter", extra={"request_id": request_id}
        )
        return []

    logger.info(f"Searching users with query: '{q}'", extra={"request_id": request_id})

    try:
        users = crud.search(db_session=db, query=q)
        logger.info(
            f"Search completed: found {len(users)} users matching '{q}'",
            extra={"request_id": request_id},
        )
        return users
    except Exception as e:
        logger.error(
            f"Error searching users with query '{q}': {str(e)}",
            extra={"request_id": request_id},
        )
        raise HTTPException(status_code=500, detail="Error searching users")


@router.get("/{id}/", response_model=UserDB)
def read_user(
    request: Request,
    db: Session = Depends(get_db),
    id: int = Path(..., gt=0),
):
    request_id = getattr(request.state, "request_id", "unknown")

    logger.info(f"Retrieving user with ID: {id}", extra={"request_id": request_id})

    user = crud.get(db_session=db, id=id)
    if not user:
        logger.warning(
            f"User not found with ID: {id}", extra={"request_id": request_id}
        )
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(
        f"User retrieved successfully: ID {id}, email: {user.email}",
        extra={"request_id": request_id},
    )
    return user


@router.put("/{id}/", response_model=UserDB)
def update_user(
    request: Request,
    payload: UserUpdateSchema,
    db: Session = Depends(get_db),
    id: int = Path(..., gt=0),
):
    request_id = getattr(request.state, "request_id", "unknown")

    logger.info(f"Updating user with ID: {id}", extra={"request_id": request_id})

    user = crud.get(db_session=db, id=id)
    if not user:
        logger.warning(
            f"Update failed - user not found with ID: {id}",
            extra={"request_id": request_id},
        )
        raise HTTPException(status_code=404, detail="User not found")

    # Log what fields are being updated
    update_fields = [
        field
        for field, value in payload.model_dump(exclude_unset=True).items()
        if value is not None
    ]
    logger.info(
        f"Updating user {id} fields: {update_fields}", extra={"request_id": request_id}
    )

    try:
        updated_user = crud.put(
            db_session=db,
            user=user,
            payload=payload,
        )
        logger.info(f"User {id} updated successfully", extra={"request_id": request_id})
        return updated_user
    except IntegrityError as e:
        logger.warning(
            f"Update failed for user {id} - email conflict: {str(e)}",
            extra={"request_id": request_id},
        )
        raise HTTPException(
            status_code=409, detail="Email already exists for another user"
        )


@router.delete("/{id}/", response_model=UserDB)
def delete_user(
    request: Request,
    db: Session = Depends(get_db),
    id: int = Path(..., gt=0),
):
    request_id = getattr(request.state, "request_id", "unknown")

    logger.info(f"Deleting user with ID: {id}", extra={"request_id": request_id})

    user = crud.get(db_session=db, id=id)
    if not user:
        logger.warning(
            f"Delete failed - user not found with ID: {id}",
            extra={"request_id": request_id},
        )
        raise HTTPException(status_code=404, detail="User not found")

    # Log user info before deletion
    logger.info(
        f"Deleting user: ID {id}, email: {user.email}", extra={"request_id": request_id}
    )

    try:
        deleted_user = crud.delete(db_session=db, id=id)
        logger.info(f"User {id} deleted successfully", extra={"request_id": request_id})
        return deleted_user
    except Exception as e:
        logger.error(
            f"Error deleting user {id}: {str(e)}", extra={"request_id": request_id}
        )
        raise HTTPException(status_code=500, detail="Error deleting user")
