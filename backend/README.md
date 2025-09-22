# Backend (Node.js + Express + PostgreSQL + MongoDB)

## Setup
1) Copy `.env.example` to `.env` and set values.
2) Install deps: `npm install`
3) Start dev: `npm run dev`

## Seed an admin user
Run:
```
npm run seed
```
This creates:
- email: `admin@example.com`
- password: `Admin@123`
- role: `admin`

## Endpoints
- POST /auth/login
- POST /admin/users (admin only)
- POST /teacher/attendance (teacher only)
- POST /teacher/marks (teacher only)
- GET /parent/attendance/child/:parentId (parent only)
- GET /parent/marks/child/:parentId (parent only)
- GET /student/attendance/:studentId (student only)
- GET /student/marks/:studentId (student only)

JWT is required in `Authorization: Bearer <token>`.