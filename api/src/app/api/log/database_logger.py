import logging
import uuid
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db import DATABASE_URL
from api.log.models import Log
import json


class DatabaseLogHandler(logging.Handler):
    """Custom logging handler that saves logs to database"""

    def __init__(self):
        super().__init__()
        if DATABASE_URL is None:
            raise ValueError("DATABASE_URL is not configured")
        self.engine = create_engine(DATABASE_URL)
        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )

    @contextmanager
    def get_db_session(self):
        """Context manager for database session"""
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    def emit(self, record):
        """Save log record to database"""
        try:
            with self.get_db_session() as session:
                # Extract extra information
                extra_data = {}
                user_id = getattr(record, "user_id", None)
                request_id = getattr(record, "request_id", None)

                # Collect extra data
                for key, value in record.__dict__.items():
                    if key not in [
                        "name",
                        "msg",
                        "args",
                        "levelname",
                        "levelno",
                        "pathname",
                        "filename",
                        "module",
                        "exc_info",
                        "exc_text",
                        "stack_info",
                        "lineno",
                        "funcName",
                        "created",
                        "msecs",
                        "relativeCreated",
                        "thread",
                        "threadName",
                        "processName",
                        "process",
                        "getMessage",
                        "user_id",
                        "request_id",
                    ]:
                        extra_data[key] = str(value)

                # Create log entry
                log_entry = Log(
                    level=record.levelname,
                    message=self.format(record),
                    module=record.module,
                    function=record.funcName,
                    line_number=record.lineno,
                    user_id=user_id,
                    request_id=request_id,
                    extra_data=json.dumps(extra_data) if extra_data else None,
                )

                session.add(log_entry)

        except Exception as e:
            raise e


def setup_database_logging():
    """Setup database logging handler"""
    logger = logging.getLogger()

    db_handler = DatabaseLogHandler()
    db_handler.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    db_handler.setFormatter(formatter)

    logger.addHandler(db_handler)

    return db_handler


def get_request_logger(request_id: str | None = None, user_id: int | None = None):
    """Get a logger with request context"""
    if request_id is None:
        request_id = str(uuid.uuid4())

    logger = logging.getLogger(__name__)

    class ContextAdapter(logging.LoggerAdapter):
        def process(self, msg, kwargs):
            extra = kwargs.get("extra", {})
            if self.extra:
                extra.update(
                    {
                        "request_id": self.extra.get("request_id"),
                        "user_id": self.extra.get("user_id"),
                    }
                )
            kwargs["extra"] = extra
            return msg, kwargs

    return ContextAdapter(logger, {"request_id": request_id, "user_id": user_id})
