from pydantic import BaseModel


class BookCreate(BaseModel):
    title: str
    author: str
    published_date: str
    isbn: str
    pages: int


class Book(BookCreate):
    id: int

    class Config:
        orm_mode = True
