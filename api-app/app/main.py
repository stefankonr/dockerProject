from fastapi import FastAPI, Depends, status, HTTPException
from pydantic import BaseModel
from typing import Annotated
from sqlalchemy.orm import Session, joinedload
import models
from database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Ustawienie CORS aby umożliwić połączenia do api z poza własnej domeny.
origins = ["http://localhost:8888"]  # informacja o połączeniu przychodzi z przeglądarki. 
                                     #dla przeglądarki adres frontenda to localhost:8888 i taki jest właściwy origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


db_dependency = Annotated[Session, Depends(get_db)]


@app.post("/users", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()


@app.get("/users/{user_id}", status_code=status.HTTP_200_OK)
async def get_user(user_id: int, db: db_dependency):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users", status_code=status.HTTP_200_OK)
async def get_all_users(db: db_dependency):
    users = db.query(models.User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users

@app.get("/users/by_username/{username}", status_code=status.HTTP_200_OK)
async def get_user_by_username(username: str, db: db_dependency):
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user_id": user.id, "username": user.username}


@app.post("/posts/", status_code=status.HTTP_201_CREATED)
async def create_post(post: PostBase, db: db_dependency):
    db_post = models.Post(**post.model_dump())
    db.add(db_post)
    db.commit()


@app.get("/posts/{post_id}", status_code=status.HTTP_200_OK)
async def read_post(post_id: int, db: db_dependency):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail='Post was not found')
    return post


@app.delete("/posts/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post(post_id: int, db: db_dependency):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail='Post was not found')
    db.delete(db_post)


@app.get("/users/posts/{username}", status_code=status.HTTP_200_OK)
async def get_user_posts_by_username(username: str, db: db_dependency):
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_posts = db.query(models.Post).filter(models.Post.user_id == user.id).all()
    return user_posts


@app.get("/posts-with-authors", status_code=status.HTTP_200_OK)
async def get_posts_with_authors(db: db_dependency):
    posts_with_authors = (
        db.query(models.Post).options(joinedload(models.Post.user)).all()
    )

    if not posts_with_authors:
        raise HTTPException(status_code=404, detail="No posts found")

    posts_with_author_info = []
    for post in posts_with_authors:
        post_data = {
            "post_id": post.id,
            "title" : post.title,
            "content": post.content,
            "author": post.user.username,
            }
        posts_with_author_info.append(post_data)

    return posts_with_author_info