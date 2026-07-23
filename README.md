# DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a backend REST API built for software teams to report bugs, request new features, and manage issue workflows. It includes secure JWT authentication, role-based authorization, and issue management using Node.js, Express, TypeScript, and PostgreSQL.

---

## Live URL

API: https://task-manager-psi-orpin.vercel.app/

---


## Features

- User registration and login
- JWT-based authentication
- Role-based authorization (Contributor & Maintainer)
- Secure password hashing using bcrypt
- Create bug reports and feature requests
- View all issues with filtering and sorting
- View a single issue
- Contributors can update only their own open issues
- Maintainers can update and delete any issue
- Refresh token support using HTTP-only cookies
- Global error handling
- Request logging middleware

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- pg (Native PostgreSQL Driver)
- bcryptjs
- jsonwebtoken
- dotenv
- cookie-parser
- cors

---

## Project Structure

```
src
│
├── auth
├── config
├── db
├── middleware
├── modules
│   ├── user
│   ├── profile
│   └── issue
├── types
├── app.ts
└── server.ts
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devpulse.git
```

### 2. Enter the project directory

```bash
cd devpulse
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

```env
PORT=5000

CONNECTIONSTRING=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret
```

### 5. Start the development server

```bash
npm run dev
```

The server will run on:

```
http://localhost:5000
```

---

# API Endpoints

## Authentication

### Register User

```
POST /api/auth/signup
```

### Login

```
POST /api/auth/login
```

### Refresh Access Token

```
POST /api/auth/refresh-token
```

---

## Issues

### Create Issue

```
POST /api/issues
```

Authentication Required

---

### Get All Issues

```
GET /api/issues
```

Supports:

```
?sort=newest
?sort=oldest

?type=bug
?type=feature_request

?status=open
?status=in_progress
?status=resolved
```

---

### Get Single Issue

```
GET /api/issues/:id
```

---

### Update Issue

```
PATCH /api/issues/:id
```

Authentication Required

Rules:

- Maintainer can update any issue.
- Contributor can update only their own issue.
- Contributor can update only when the issue status is **open**.

---

### Delete Issue

```
DELETE /api/issues/:id
```

Maintainer Only

---

# Database Schema

## Users Table

| Field | Type |
|-------|------|
| id | SERIAL |
| name | VARCHAR |
| email | VARCHAR (Unique) |
| password | TEXT |
| role | contributor / maintainer |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Issues Table

| Field | Type |
|-------|------|
| id | SERIAL |
| title | VARCHAR(150) |
| description | TEXT |
| type | bug / feature_request |
| status | open / in_progress / resolved |
| reporter_id | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Authentication Flow

1. User registers an account.
2. User logs in using email and password.
3. Server verifies the credentials.
4. JWT access token is generated.
5. Client sends the token in the `Authorization` header.
6. Protected routes verify the token before processing requests.

---

## Author

**MD Tahsin Habib**

Department of Computer Science & Engineering

International Islamic University Chittagong (IIUC)

