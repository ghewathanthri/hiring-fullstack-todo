# TODO App

A simple full-stack TODO application built as a technical assessment.

The application allows users to create, view, edit, complete, and delete TODO items. The frontend communicates with a RESTful backend API, and TODO data is persisted in MongoDB.

## Features

- **View TODOs** — Display all tasks in a clean, modern UI
- **Create TODOs** — Add new tasks with title and optional description
- **Edit TODOs** — Inline editing of title and description
- **Mark as Done** — Toggle completion with visual feedback (strikethrough)
- **Delete TODOs** — Remove tasks with optimistic UI updates
- **Toast Notifications** — User-friendly success and error messages
- **Optimistic UI** — Instant feedback with automatic rollback on errors
- **Responsive** — Works on desktop and mobile
- **Animations** — Smooth transitions and micro-interactions

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 19, Vite 8        |
| Backend    | Node.js, Express 4      |
| Database   | MongoDB, Mongoose 8     |
| Validation | express-validator       |
| HTTP       | Axios                   |
| Monorepo   | npm workspaces          |

## Project Structure

```
hiring-fullstack-todo/
├── packages/
│   ├── client/              # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── services/    # API service layer
│   │   │   ├── App.jsx      # Root component
│   │   │   └── App.css      # Styles
│   │   └── package.json
│   └── server/              # Express.js backend
│       ├── src/
│       │   ├── config/      # Database configuration
│       │   ├── controllers/ # Route handlers
│       │   ├── middleware/  # Error & validation middleware
│       │   ├── models/      # Mongoose models
│       │   ├── routes/      # Express routes
│       │   ├── validators/  # Request validators
│       │   └── index.js     # Server entry point
│       └── package.json
├── package.json             # Root workspace config
└── README.md
```

## Prerequisites

Make sure the following are installed:
- **Node.js** `^20.19.0` or `>= 22.12.0` (required by Vite 8)
- **MongoDB** — local, Docker or Atlas (see [server README](packages/server/README.md#mongodb-connection)). Required: the server exits if it can't connect.
- **npm** >= 7 (for workspaces support)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd hiring-fullstack-todo
```

### 2. Install dependencies

```bash
npm install
```

This installs dependencies for both `packages/client` and `packages/server` via npm workspaces.

### 3. Configure environment

No setup needed for local development: `packages/server/.env` and `packages/client/.env` are committed with working defaults (MongoDB at `mongodb://localhost:27017/todo-app`, API on port 5000).

To change a value, create a `.env.local` next to the `.env` and override it there. `.env.local` is git-ignored and takes precedence, so use it for secrets such as an Atlas connection string.

### 4. Start MongoDB

Make sure MongoDB is running locally:

```bash
# If using brew
brew services start mongodb-community

# Or use mongod directly
mongod --dbpath /path/to/data
```

### 5. Run the application

```bash
# Start both frontend and backend concurrently
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

You can also run them individually:

```bash
npm run dev:server   # Backend only
npm run dev:client   # Frontend only
```

## API Reference

| Method   | Endpoint              | Description              | Request Body                        |
|----------|-----------------------|--------------------------|-------------------------------------|
| `GET`    | `/api/todos`          | Get all TODOs            | —                                   |
| `POST`   | `/api/todos`          | Create a new TODO        | `{ title, description? }`          |
| `PUT`    | `/api/todos/:id`      | Update title/description | `{ title, description? }`          |
| `PATCH`  | `/api/todos/:id/done` | Toggle done status       | —                                   |
| `DELETE` | `/api/todos/:id`      | Delete a TODO            | —                                   |
| `GET`    | `/api/health`         | Health check             | —                                   |

### Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "done": false,
    "createdAt": "2026-10-03T17:00:00.000Z",
    "updatedAt": "2026-10-03T17:00:00.000Z"
  }
}
```

### Error Response

Errors carry a stable `code` that the client translates; `message` is an English fallback for logs and tools like curl. Validation failures also list per-field errors:

```json
{
  "success": false,
  "code": "VALIDATION_FAILED",
  "message": "Title cannot exceed 200 characters",
  "errors": [
    { "field": "title", "code": "TITLE_TOO_LONG", "params": { "max": 200 }, "message": "Title cannot exceed 200 characters" }
  ]
}
```

See the [server README](packages/server/README.md#error-codes) for the full list of codes.

## Database Model

The database is a MongoDB collection named `todos` with the following structure:

```javascript
{
  _id: ObjectId,           // Auto-generated
  title: String,           // Required, max 200 chars
  description: String,     // Optional, max 1000 chars
  done: Boolean,           // Default: false
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-updated
}
```

## Application Flow

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
Express REST API
      │
      │ Mongoose
      ▼
MongoDB
```

## Error Handling

The application handles common error scenarios including:

* Invalid or empty TODO title
* TODO not found
* Database errors
* API request failures
* Network errors

User-friendly error messages are displayed where appropriate.

## License

This project was created for a technical assessment.