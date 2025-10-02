from sqlalchemy.orm import Session
from .models import Log, LogSchema


def create_log(db: Session, log: LogSchema):
    """Create a new log entry in the database"""
    db_log = Log(
        level=log.level,
        message=log.message,
        module=log.module,
        function=log.function,
        line_number=log.line_number,
        user_id=log.user_id,
        request_id=log.request_id,
        extra_data=log.extra_data
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_logs(db: Session, skip: int = 0, limit: int = 100, level: str | None = None):
    """Get logs from database with optional filtering by level"""
    query = db.query(Log)
    if level:
        query = query.filter(Log.level == level)  # type: ignore
    return query.offset(skip).limit(limit).all()


def get_log_by_id(db: Session, log_id: int):
    """Get a specific log by ID"""
    return db.query(Log).filter(Log.id == log_id).first()


def delete_old_logs(db: Session, days: int = 30):
    """Delete logs older than specified days"""
    from datetime import datetime, timedelta
    cutoff_date = datetime.now() - timedelta(days=days)
    deleted_count = db.query(Log).filter(Log.created_at < cutoff_date).delete()
    db.commit()
    return deleted_count