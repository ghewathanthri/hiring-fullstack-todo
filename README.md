# TODO App

A simple full-stack TODO application built as a technical assessment.

The application allows users to create, view, edit, complete, and delete TODO items. The frontend communicates with a RESTful backend API, and TODO data is persisted in MongoDB.

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5 / CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

## Features

* View all TODO items
* Create a new TODO
* Edit an existing TODO
* Mark a TODO as completed or incomplete
* Delete a TODO
* Optional TODO description
* Form validation
* Loading states
* Error handling
* Empty state handling
* Responsive and simple user interface

## Project Structure

```text
todo-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── README.md
└── package.json
```

## Prerequisites

Make sure the following are installed:

* Node.js 20+
* npm
* MongoDB

You can use either a local MongoDB instance or MongoDB Atlas.

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd todo-app
```

### 2. Install dependencies

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm install --prefix client
```

Install backend dependencies:

```bash
npm install --prefix server
```

## Environment Configuration

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo_app
CLIENT_URL=http://localhost:5173
```

Update `MONGODB_URI` if you are using MongoDB Atlas or another MongoDB instance.

## Running the Application

Start both frontend and backend in development mode:

```bash
npm run dev
```

The application will be available at:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:5000
```

## API Endpoints

Base URL:

```text
/api/todos
```

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | `/api/todos`          | Get all TODOs          |
| POST   | `/api/todos`          | Create a TODO          |
| PUT    | `/api/todos/:id`      | Update a TODO          |
| PATCH  | `/api/todos/:id/done` | Toggle TODO completion |
| DELETE | `/api/todos/:id`      | Delete a TODO          |

### Create TODO

```http
POST /api/todos
Content-Type: application/json
```

Request:

```json
{
  "title": "Complete assessment",
  "description": "Finish the TODO application"
}
```

### Update TODO

```http
PUT /api/todos/:id
Content-Type: application/json
```

Request:

```json
{
  "title": "Complete React assessment",
  "description": "Finish frontend and backend implementation"
}
```

### Toggle TODO

```http
PATCH /api/todos/:id/done
```

The endpoint toggles the TODO between completed and incomplete.

## Data Model

A TODO item has the following structure:

```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "done": false,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
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

## Development

The project is organized into separate frontend and backend applications.

The frontend is responsible for:

* UI rendering
* User interaction
* Form handling
* API communication
* Loading and error states

The backend is responsible for:

* REST API endpoints
* Request validation
* Database operations
* Error handling

MongoDB is responsible for persistent TODO storage.

## Future Improvements

Possible improvements if the application is extended:

* Automated tests
* Pagination
* Search and filtering
* TODO categories
* Due dates
* User authentication
* Docker support
* CI/CD pipeline

## License

This project was created for a technical assessment.