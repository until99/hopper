from typing import List
import logging

from fastapi import APIRouter, Depends, HTTPException, Path, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from api.auth import crud

# from api.auth.models import
from db import SessionLocal

logger = logging.getLogger(__name__)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=AuthUserDB, status_code=201)
def create_user(
    *, db: Session = Depends(get_db), payload: AuthUserSchema, request: Request
):
    request_id = getattr(request.state, "request_id", "unknown")

    logger.info(
        f"Creating user with email: {payload.email}", extra={"request_id": request_id}
    )
