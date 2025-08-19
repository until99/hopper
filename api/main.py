from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
from typing import Optional, List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import IntegrityError
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:password@localhost:5432/hopper"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
Base = declarative_base()


class UserTable(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


class GroupTable(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)


Base.metadata.create_all(
    bind=engine,
)


class User(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str

    class Config:
        from_attributes = True


class UserPatch(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class Group(BaseModel):
    name: str
    description: Optional[str] = None


class GroupResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class GroupPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass


def close_db(db):
    db.close()


@app.get("/")
def read_root():
    return {
        "Hello": "World",
    }


@app.get("/users/", response_model=List[UserResponse])
def read_users():
    db = get_db()
    try:
        users = db.query(UserTable).all()
        return users
    finally:
        close_db(db)


@app.get("/user/{user_id}", response_model=UserResponse)
def read_user(user_id: int):
    db = get_db()
    try:
        user = db.query(UserTable).filter(UserTable.id == user_id).first()
        if user:
            return user
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    finally:
        close_db(db)


@app.get("/user/search/")
def search_users(name: str):
    db = get_db()
    try:
        users = db.query(UserTable).filter(UserTable.name.ilike(f"%{name}%")).all()
        return users
    finally:
        close_db(db)


@app.post("/user/")
def create_user(user: User):
    db = get_db()
    try:
        db_user = UserTable(
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=user.password,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return {
            "user_id": db_user.id,
            "message": "User created successfully",
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists",
        )
    finally:
        close_db(db)


@app.put("/user/{user_id}")
def update_user(user_id: int, user: User):
    db = get_db()
    try:
        db_user = db.query(UserTable).filter(UserTable.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        for attr, value in user.model_dump().items():
            setattr(db_user, attr, value)

        db.commit()
        db.refresh(db_user)

        return {
            "message": "User updated successfully",
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists",
        )
    finally:
        close_db(db)


@app.patch("/user/{user_id}")
def patch_user(user_id: int, user: UserPatch):
    db = get_db()
    try:
        db_user = db.query(UserTable).filter(UserTable.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        updated_data = user.model_dump(exclude_unset=True)
        for attr, value in updated_data.items():
            setattr(db_user, attr, value)

        db.commit()
        db.refresh(db_user)

        return {
            "message": "User patched successfully",
            "user": db_user,
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists",
        )
    finally:
        close_db(db)


@app.delete("/user/{user_id}")
def delete_user(user_id: int):
    db = get_db()
    try:
        db_user = db.query(UserTable).filter(UserTable.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        db.delete(db_user)
        db.commit()
        return {
            "message": "User deleted successfully",
        }
    finally:
        close_db(db)


@app.post("/login")
def login(username: str, password: str):
    db = get_db()
    try:
        user = (
            db.query(UserTable)
            .filter(UserTable.username == username, UserTable.password == password)
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password",
            )
        return {
            "message": "Login successful",
            "user_id": user.id,
        }
    finally:
        close_db(db)


@app.post("/register")
def register(user: User):
    db = get_db()
    try:
        db_user = UserTable(
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=user.password,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return {
            "message": "User registered successfully",
            "user_id": db_user.id,
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists",
        )
    finally:
        close_db(db)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "API is running smoothly",
    }


@app.get("/groups/", response_model=List[GroupResponse])
def read_groups():
    db = get_db()
    try:
        groups = db.query(GroupTable).all()
        return groups
    finally:
        close_db(db)


@app.get("/group/{group_id}", response_model=GroupResponse)
def read_group(group_id: int):
    db = get_db()
    try:
        group = db.query(GroupTable).filter(GroupTable.id == group_id).first()
        if group:
            return group
        raise HTTPException(
            status_code=404,
            detail="Group not found",
        )
    finally:
        close_db(db)


@app.post("/group/")
def create_group(group: Group):
    db = get_db()
    try:
        db_group = GroupTable(
            name=group.name,
            description=group.description,
        )
        db.add(db_group)
        db.commit()
        db.refresh(db_group)

        return {
            "group_id": db_group.id,
            "message": "Group created successfully",
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Group name already exists",
        )
    finally:
        close_db(db)


@app.put("/group/{group_id}")
def update_group(group_id: int, group: Group):
    db = get_db()
    try:
        db_group = db.query(GroupTable).filter(GroupTable.id == group_id).first()
        if not db_group:
            raise HTTPException(
                status_code=404,
                detail="Group not found",
            )

        for attr, value in group.model_dump().items():
            setattr(db_group, attr, value)

        db.commit()
        db.refresh(db_group)

        return {
            "message": "Group updated successfully",
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Group name already exists",
        )
    finally:
        close_db(db)


@app.patch("/group/{group_id}")
def patch_group(group_id: int, group: GroupPatch):
    db = get_db()
    try:
        db_group = db.query(GroupTable).filter(GroupTable.id == group_id).first()
        if not db_group:
            raise HTTPException(
                status_code=404,
                detail="Group not found",
            )

        updated_data = group.model_dump(exclude_unset=True)
        for attr, value in updated_data.items():
            setattr(db_group, attr, value)

        db.commit()
        db.refresh(db_group)

        return {
            "message": "Group patched successfully",
            "group": db_group,
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Group name already exists",
        )
    finally:
        close_db(db)


@app.delete("/group/{group_id}")
def delete_group(group_id: int):
    db = get_db()
    try:
        db_group = db.query(GroupTable).filter(GroupTable.id == group_id).first()
        if not db_group:
            raise HTTPException(
                status_code=404,
                detail="Group not found",
            )

        db.delete(db_group)
        db.commit()
        return {
            "message": "Group deleted successfully",
        }
    finally:
        close_db(db)


@app.get("/groups/search/")
def search_groups(name: str):
    db = get_db()
    try:
        groups = db.query(GroupTable).filter(GroupTable.name.ilike(f"%{name}%")).all()
        return groups
    finally:
        close_db(db)
