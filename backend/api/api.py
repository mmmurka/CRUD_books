from typing import List

from fastapi import APIRouter, HTTPException

import backend.db as db
from backend.api.schemas import Book, BookCreate

router = APIRouter()


@router.get("/books", response_model=List[Book])
def get_books():
    with db.get_db_connection() as conn:
        books = conn.execute("SELECT * FROM books").fetchall()
        return [dict(book) for book in books]


@router.get("/books/{id}", response_model=Book)
def get_book(id: int):
    with db.get_db_connection() as conn:
        book = conn.execute("SELECT * FROM books WHERE id = ?", (id,)).fetchone()
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        return dict(book)


@router.post("/books", response_model=Book)
def create_book(book: BookCreate):
    with db.get_db_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO books (title, author, published_date, isbn, pages)"
            " VALUES (?, ?, ?, ?, ?)",
            (book.title, book.author, book.published_date, book.isbn, book.pages),
        )
        conn.commit()
        book_id = cursor.lastrowid
    return {**book.dict(), "id": book_id}


@router.put("/books/{id}", response_model=Book)
def update_book(id: int, book: BookCreate):
    with db.get_db_connection() as conn:
        cursor = conn.execute(
            "UPDATE books SET title = ?,"
            " author = ?, published_date = ?,"
            " isbn = ?, pages = ? WHERE id = ?",
            (book.title, book.author, book.published_date, book.isbn, book.pages, id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Book not found")
        conn.commit()
    return {**book.dict(), "id": id}


@router.delete("/books/{id}", response_model=dict)
def delete_book(id: int):
    with db.get_db_connection() as conn:
        cursor = conn.execute("DELETE FROM books WHERE id = ?", (id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Book not found")
        conn.commit()
    return {"message": "Book deleted successfully"}
