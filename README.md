# Library Management System

A Node.js application with TypeScript, Express, and PostgreSQL (TypeORM) for managing a library's books and members.

## Quick Start

```bash
yarn install

# Start the PostgreSQL database
yarn db:start

# Start the application in development mode
yarn dev
```

After running these commands, the API will be available at http://localhost:3000.

## Features

- User management (list, view, create)
- Book management (list, view, create)
- Loan management (borrow, return with rating)
- Rating system for books
- Input validation for all requests
- Error handling
- Unique user names enforced

## Prerequisites

- Node.js
- PostgreSQL (or Docker for PostgreSQL container)

## Setup

1. Install dependencies:

```
yarn install
```

### Database Setup

```bash
# Start PostgreSQL container using yarn script
yarn db:start

# Or directly with docker-compose
docker-compose up -d

# Verify container is running
docker ps
```

### Application Setup

4. Copy `.env.example` to `.env` and update with your database credentials if needed
5. Run in development mode:

```
yarn dev
```

## API Endpoints

### Users

- `GET /users`: List all users with id and name
- `GET /users/:id`: Get user details including past and present borrowed books
- `POST /users`: Create new user (returns 409 Conflict if name already exists)

### Books

- `GET /books`: List all books with id and name
- `GET /books/:id`: Get book details including score
- `POST /books`: Create new book

### Loans

- `POST /users/:userId/borrow/:bookId`: Borrow a book (returns 409 Conflict if book is already borrowed by the user and has not been returned.)
- `POST /users/:userId/return/:bookId`: Return a book with optional score
- `GET /users/:userId/loans`: Get loans by user ID

## Database Schema

### Users

- id: Primary key
- name: User's name
- membershipDate: Date of joining

### Books

- id: Primary key
- name: Book name
- score: Average user score based on ratings

### Loans

- id: Primary key
- userId: Foreign key to User
- bookId: Foreign key to Book
- borrowDate: Date when book was borrowed
- returnDate: Date when book was returned (null if not returned)
- score: User score for the book (1-10)

## Validation

The API includes comprehensive validation to ensure data integrity:

### User Validation

- **Name**: Required, 2-100 characters

### Book Validation

- **Name**: Required, 1-200 characters

### Return Book Validation

- **Score**: Optional, integer between 1-10

### Path Parameter Validation

- All ID parameters are validated to ensure they are positive integers
