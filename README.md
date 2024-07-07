# Book Management System

This is a simple Book Management System built with FastAPI for the backend and a plain HTML/CSS/JavaScript frontend. The backend uses SQLite as the database, and the frontend is served using a simple Python HTTP server. Docker and Docker Compose are used to containerize and manage the services.

## Getting Starte


1. Clone the repository:

```sh
  git clone <repository-url>
  cd project-root
```

2. Build and run the containers using Docker Compose:
```sh
  docker-compose up --build
```

3. Access the application:
   * Frontend: http://localhost:8001
   * Backend API: http://localhost:8000

## Backend
The backend is built with FastAPI and uses SQLite as the database. It provides CRUD endpoints for managing books.
Endpoints
  * GET /books: Get a list of all books.
  * GET /books/{id}: Get a book by ID.
  * POST /books: Create a new book.
  * PUT /books/{id}: Update an existing book by ID.
  * DELETE /books/{id}: Delete a book by ID.

## Frontend
The frontend is a simple HTML/CSS/JavaScript application served by a Python HTTP server. It provides a user interface to interact with the backend API for managing books.
