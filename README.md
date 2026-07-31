# SpaceHub — Room Booking

Full-stack room booking app: users register/login, browse rooms, check availability, create bookings, and manage (cancel) their reservations.

## Structure

```text
room-booking/
  backend/     Express + Prisma (SQLite) + JWT + Swagger
  frontend/    React + Vite + TypeScript + Tailwind + shadcn/ui
```

## Features

- **Auth:** register, login (JWT), protected routes
- **Rooms:** list rooms, room details with image, capacity and price
- **Availability:** check if a room is free for a given day + shift (`MORNING` | `AFTERNOON` | `EVENING`)
- **Bookings:** list “My bookings”, manage booking modal, cancel reservation
- **Roles:** regular users see their own bookings; admins can see all (API)

## Prerequisites

- Node.js 20+ (or compatible with the project’s native modules)
- npm

## Backend setup

```bash
cd backend
npm install
```

Configure `backend/.env` (example):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret"
```

Generate Prisma client and apply migrations if needed:

```bash
npx prisma generate
npx prisma migrate dev
```

Optional — seed rooms:

```bash
npx tsx index.ts
```

Start the API:

```bash
npm run dev
```

- API: http://localhost:3000  
- Swagger: http://localhost:3000/api-docs  
- Static uploads: http://localhost:3000/uploads/...

### Main API routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create user |
| POST | `/login` | Login (returns JWT) |
| GET | `/rooms` | List rooms (auth) |
| GET | `/rooms/:id` | Room by id (auth) |
| GET | `/rooms/:id/availability?day=YYYY-MM-DD&shift=MORNING` | Check slot (auth) |
| GET | `/bookings` | List bookings (auth; own or all if admin) |
| POST | `/bookings` | Create booking (auth) |
| PUT | `/bookings/:id` | Update booking (auth) |
| DELETE | `/bookings/:id` | Cancel booking (auth) |

Send header: `Authorization: Bearer <token>`.

## Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/
```

Start the UI:

```bash
npm run dev
```

- App: http://localhost:5173 (Vite default)

### Frontend routes

| Path | Access | Page |
|------|--------|------|
| `/` | Public | Home |
| `/login` | Public (redirect if logged in) | Login |
| `/register` | Public | Register |
| `/rooms` | Auth | Rooms list |
| `/rooms/:id` | Auth | Room details + availability / book UI |
| `/bookings` | Auth | My bookings + manage/cancel modal |
| `*` | Public | 404 |

## Tech stack

**Backend:** Express 5, Prisma 7, SQLite, Zod, JWT, bcrypt, Swagger  

**Frontend:** React 19, React Router 7, Axios, Tailwind CSS 4, shadcn/ui (Base UI), react-day-picker

## Notes

- Booking uniqueness: one reservation per `roomId` + `day` + `shift`
- Day values are stored as UTC date-only; display booking dates with `timeZone: "UTC"` to avoid off-by-one in Brazil
- Room images under `backend/uploads/rooms/` are served at `/uploads/rooms/...`
