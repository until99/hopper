from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import logging

from api.user.models import User, UserSchema, UserUpdateSchema
from api.user.utils import hash_password
from sqlalchemy import select

logger = logging.getLogger(__name__)