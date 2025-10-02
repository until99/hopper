from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
import logging
import uuid
import time
import os
from dotenv import load_dotenv

from api.ping import ping as ping

from api.user import routes as user
from api.log import routes as log_routes
from api.powerbi import routes as powerbi

from api.user.models import Base as UserBase
from api.log.models import Base as LogBase

from db import engine
from api.log.database_logger import setup_database_logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
setup_database_logging()


load_dotenv()
UserBase.metadata.create_all(bind=engine)
LogBase.metadata.create_all(bind=engine)

app = FastAPI()

cors_origins = os.getenv("CORS_ORIGINS", "").split(",")
cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    start_time = time.time()

    logger.info(
        f"Request started: {request.method} {request.url}",
        extra={"request_id": request_id},
    )

    response = await call_next(request)

    duration = time.time() - start_time

    logger.info(
        f"Request completed: {request.method} {request.url} - Status: {response.status_code} - Duration: {duration:.3f}s",
        extra={"request_id": request_id},
    )

    response.headers["X-Request-ID"] = request_id

    return response


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    request_id = getattr(request.state, "request_id", "unknown")
    error_msg = f"Database error on {request.method} {request.url}: {exc}"
    logger.error(error_msg, extra={"request_id": request_id})
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error occurred while processing your request",
            "error_type": "database_error",
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    error_msg = f"Unexpected error on {request.method} {request.url}: {exc}"
    logger.error(error_msg, extra={"request_id": request_id})
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "error_type": "internal_error",
        },
    )


app.include_router(ping.router)
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(powerbi.router, prefix="/powerbi", tags=["powerbi"])
app.include_router(log_routes.router, prefix="/logs", tags=["logs"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
