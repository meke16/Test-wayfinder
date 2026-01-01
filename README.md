# Wayfinder

Wayfinder is a small full-stack "school management" starter project:

- **Backend:** a Laravel 12 JSON API that exposes authentication endpoints and a REST resource for managing students.
- **Frontend:** a React + TanStack Router app (Vite) that provides role-based dashboard routes and a student CRUD UI.
- **Glue:** **Laravel Wayfinder** generates type-safe, frontend-consumable route definitions from the Laravel routes so the React app can call `/api/...` endpoints without hard-coding URLs.

## What it currently does

### Backend (Laravel)
- Provides a simple API welcome endpoint (`/api`).
- Exposes **CRUD** endpoints for students via `Route::apiResource('students', ...)`:
  - `GET /api/students`
  - `POST /api/students`
  - `GET /api/students/{student}`
  - `PUT/PATCH /api/students/{student}`
  - `DELETE /api/students/{student}`
- Includes auth endpoints under `routes/auth.php` (register/login/logout, password reset, email verification).
- Uses common developer tooling packages (Sanctum, Telescope, Swagger/OpenAPI tooling).

### Frontend (React)
- Uses TanStack Router file-based routes.
- Has a login page and dashboard routes (admin/teacher/student/guest).
- The **student dashboard** renders a simple student management screen that lists, creates, edits, and deletes students by calling the backend through Wayfinder-generated routes.

## Repo layout

- `backend/` — Laravel application (API + auth + DB migrations).
- `web/` — React/TanStack application (UI + API client wrappers + route definitions).

## Notes

- The student feature is the main implemented domain example right now (name + grade).
- The presence of admin/teacher/student/guest dashboard routes suggests the project is aiming toward role-based school management, but only the student CRUD is currently wired end-to-end.
