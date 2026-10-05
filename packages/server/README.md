# Server

Express.js backend for the TaskFlow TODO application.

## Prerequisites

- **Node.js** >= 18 (the monorepo as a whole needs `^20.19.0` or `>= 22.12.0` because of the client's Vite 8)
- **npm** >= 7 (for workspaces support)
- **MongoDB** — local, Docker, or Atlas (see [MongoDB connection](#mongodb-connection)). Required: the server won't start without it.

## Setup

```bash
# 1. From the root of the monorepo, install all workspace dependencies
npm install

```

`packages/server/.env` is committed with defaults for a local MongoDB, so no further setup is needed. See [Environment Variables](#environment-variables) to change them.

## Running

```bash
# From the root of the monorepo

npm run dev:server   # Development, auto-restarts on changes (nodemon)
npm start            # Production-style (plain node)
npm run dev          # Backend + frontend together
```

The API is available at http://localhost:5000/api. Check it with:

```bash
curl http://localhost:5000/api/health
```

## Environment Variables

| Variable      | Default (`.env`)                      | Description            |
|---------------|---------------------------------------|------------------------|
| `MONGODB_URI` | `mongodb://localhost:27017/todo-app`  | MongoDB connection URI |
| `PORT`        | `5000`                                | Server port            |
| `NODE_ENV`    | `development`                         | Environment            |

Values are loaded from two files in `packages/server/`:

- `.env`: committed defaults for local development. Don't put secrets here.
- `.env.local`: git-ignored, personal overrides and secrets. Values here win over `.env`.

Real environment variables (e.g. `PORT=5001 npm start`) win over both.

## MongoDB Connection

The connection is set up in [src/config/db.js](src/config/db.js) using `MONGODB_URI`. The database name is taken from the URI path (`/todo-app`); the `todos` collection is created automatically on first insert.

### Option A — Local MongoDB

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

```env
MONGODB_URI=mongodb://localhost:27017/todo-app
```

> **macOS 12 (Monterey) / older Intel Macs:** MongoDB 8.0+ binaries need macOS 13+ (they fail with `dyld: Symbol not found ... pmr`), and the `mongosh` dependency fails to build from source. Install 7.0 without its dependencies instead:
>
> ```bash
> brew install --ignore-dependencies mongodb/brew/mongodb-community@7.0
> brew services start mongodb/brew/mongodb-community@7.0
> ```
>
> Browse the data with MongoDB Compass or the "MongoDB for VS Code" extension instead of `mongosh`.

### Option B — Docker

```bash
docker run -d --name todo-mongo -p 27017:27017 mongo:7
```

```env
MONGODB_URI=mongodb://localhost:27017/todo-app
```

### Option C — MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com.
2. Under **Database Access**, create a database user.
3. Under **Network Access**, allow your IP address (or `0.0.0.0/0` for testing only).
4. Click **Connect → Drivers** and copy the connection string. Add the database name before the `?` and put it in `packages/server/.env.local` (git-ignored), **not** in the committed `.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todo-app?retryWrites=true&w=majority
```

URL-encode special characters in the password (e.g. `@` → `%40`, `#` → `%23`).

### Startup behavior

MongoDB is required. The server connects first and only starts listening once the connection succeeds:

```
MongoDB connected: localhost
Server running on http://localhost:5000
```

If `MONGODB_URI` is missing, or MongoDB can't be reached within 10 seconds, it logs `Could not connect to MongoDB: ...` and exits with code 1.

## API Endpoints

| Method   | Endpoint             | Description              | Request Body              |
|----------|----------------------|--------------------------|---------------------------|
| `GET`    | `/api/todos`         | Get all TODO items       | —                         |
| `POST`   | `/api/todos`         | Create a new TODO        | `{ title, description? }` |
| `PUT`    | `/api/todos/:id`     | Update title/description | `{ title, description? }` |
| `PATCH`  | `/api/todos/:id/done`| Toggle done status       | —                         |
| `DELETE` | `/api/todos/:id`     | Delete a TODO            | —                         |
| `GET`    | `/api/health`        | Health check             | —                         |

Validation: `title` is required (max 200 chars), `description` is optional (max 1000 chars).

## Error Codes

Every error response has a stable `code` for clients to translate, plus an English `message` as a fallback:

```json
{
  "success": false,
  "code": "VALIDATION_FAILED",
  "message": "Title is required",
  "errors": [{ "field": "title", "code": "TITLE_REQUIRED", "message": "Title is required" }]
}
```

`errors` is only present for validation failures; `params` holds values used in the message (e.g. `{ "max": 200 }`).

| Code                   | Status | Where                             | Params    |
|------------------------|--------|-----------------------------------|-----------|
| `VALIDATION_FAILED`    | 400    | Top level of any validation error | —         |
| `TITLE_REQUIRED`       | 400    | `errors[]`                        | —         |
| `TITLE_TOO_LONG`       | 400    | `errors[]`                        | `max`     |
| `DESCRIPTION_TOO_LONG` | 400    | `errors[]`                        | `max`     |
| `INVALID_ID`           | 400    | Top level or `errors[]`           | —         |
| `INVALID_JSON`         | 400    | Top level                         | —         |
| `TODO_NOT_FOUND`       | 404    | Top level                         | —         |
| `ROUTE_NOT_FOUND`      | 404    | Top level                         | —         |
| `INTERNAL_ERROR`       | 500    | Top level                         | —         |

Codes are defined in [src/constants/errorCodes.js](src/constants/errorCodes.js). When adding one, also add its translation under `serverErrors` in the client's `src/i18n/locales/*/translation.json`. Treat codes as part of the API contract: don't rename them, only add new ones.

## Structure

```
src/
├── config/
│   └── db.js              # MongoDB connection
├── constants/
│   ├── errorCodes.js      # API error codes (translated by the client)
│   └── todoLimits.js      # Title/description length limits
├── controllers/
│   └── todoController.js  # Request handlers for TODO CRUD
├── middleware/
│   ├── errorHandler.js    # Global error handling
│   └── handleValidation.js # Validation result middleware
├── models/
│   └── Todo.js            # Mongoose schema & model
├── routes/
│   └── todoRoutes.js      # Express route definitions
├── services/
│   └── todoStore.js       # Data access layer over the Mongoose model
├── validators/
│   └── todoValidator.js   # express-validator chains
└── index.js               # Server entry point
```

## Assumptions

- Single-user app: there is no authentication and all clients share one TODO list.
- The frontend reaches the API through the Vite dev proxy, so CORS is enabled for all origins for convenience only.

## Limitations

- **MongoDB must be up before the server starts.** If the initial connection fails, the server exits instead of retrying; restart it once MongoDB is available (nodemon in `npm run dev:server` will pick up file changes but not a database coming back).
- **No pagination, filtering, rate limiting or authentication.**
- **CORS is open to all origins**; restrict it before deploying publicly.
- **No automated tests.** `mongodb-memory-server` is listed in devDependencies but not yet used.
