from fastapi import FastAPI

import backend.db as db
from backend.api.api import router as api_router

app = FastAPI()


@app.on_event("startup")
def startup():
    db.create_books_table()


app.include_router(api_router, prefix="/api")
