from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import Annotated
import models
from app.database import engine, SessionLocal

app = FastAPI()
models.Base.metadata.create_all(bind=engine)


class PostBase(BaseModel):
    title: str
    content: str
    user_id: int


class UserBase(BaseModel):
    username: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated(Session, Depends(get_db))
