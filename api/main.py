from fastapi import FastAPI
from api.v1 import router as api_v1_router
import logging


logger = logging.getLogger("api")

app = FastAPI()
app.include_router(api_v1_router, prefix="/api/v1")
