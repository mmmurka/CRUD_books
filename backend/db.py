import sqlite3
from sqlite3 import Connection

DATABASE_NAME = "books.db"


def get_db_connection() -> Connection:
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_books_table():
    with get_db_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                published_date TEXT NOT NULL,
                isbn TEXT NOT NULL,
                pages INTEGER NOT NULL
            )
            """
        )
        conn.commit()

        # Вставка начальных данных
        initial_book = {
            "title": "Три товариші",
            "author": "Еріх Марія Ремарк",
            "published_date": "04.05.1936",
            "isbn": "9783462046311",
            "pages": 567,
        }

        conn.execute(
            """
            INSERT INTO books (title, author, published_date, isbn, pages)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                initial_book["title"],
                initial_book["author"],
                initial_book["published_date"],
                initial_book["isbn"],
                initial_book["pages"],
            ),
        )
        conn.commit()
