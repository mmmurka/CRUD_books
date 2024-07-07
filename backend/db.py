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
