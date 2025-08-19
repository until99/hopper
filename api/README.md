# Hopper API

A FastAPI application with PostgreSQL database integration for user management.

## Features

- User CRUD operations (Create, Read, Update, Delete)
- PostgreSQL database integration using SQLAlchemy ORM
- Synchronous database operations
- Input validation using Pydantic models
- Environment-based configuration

## Setup

### Prerequisites

- Python 3.13+
- PostgreSQL database
- UV package manager

### Installation

1. Install dependencies:

```bash
uv sync
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Configure your database connection in `.env`:

```
DATABASE_URL=postgresql://username:password@localhost:5432/hopper
```

### Database Setup

The application will automatically create the users table when it starts. Make sure your PostgreSQL database exists and is accessible.

### Running the Application

```bash
uv run fastapi dev main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Users

- `GET /` - Root endpoint
- `GET /users/` - Get all users
- `GET /user/{user_id}` - Get a specific user
- `POST /user/` - Create a new user
- `PUT /user/{user_id}` - Update a user (all fields)
- `PATCH /user/{user_id}` - Partially update a user
- `DELETE /user/{user_id}` - Delete a user
- `GET /health` - Health check endpoint

### User Model

```json
{
  "username": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string"
}
```

## API Documentation

Once the application is running, you can access:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (required)

## Dependencies

- FastAPI: Web framework
- SQLAlchemy: ORM for database operations
- Pydantic: Data validation
- psycopg2-binary: PostgreSQL adapter
- python-dotenv: Environment variable loading
