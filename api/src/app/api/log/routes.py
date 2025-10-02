from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from db import SessionLocal
from .models import LogSchema, LogDB
from .crud import create_log, get_logs, get_log_by_id, delete_old_logs

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=LogDB)
def create_log_entry(log: LogSchema, db: Session = Depends(get_db)):
    """Create a new log entry"""
    return create_log(db=db, log=log)


@router.get("/", response_model=List[LogDB])
def read_logs(
    skip: int = 0,
    limit: int = Query(default=100, le=1000),
    level: str | None = None,
    db: Session = Depends(get_db)
):
    """Get logs with optional filtering"""
    logs = get_logs(db, skip=skip, limit=limit, level=level)
    return logs


@router.get("/{log_id}", response_model=LogDB)
def read_log(log_id: int, db: Session = Depends(get_db)):
    """Get a specific log by ID"""
    log = get_log_by_id(db, log_id=log_id)
    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return log


@router.delete("/cleanup")
def cleanup_old_logs(days: int = Query(default=30, ge=1), db: Session = Depends(get_db)):
    """Delete logs older than specified days"""
    deleted_count = delete_old_logs(db, days=days)
    return {"message": f"Deleted {deleted_count} old log entries"}