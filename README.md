# SpaceHub — Room Booking

Full-stack room booking app: users register/login, browse rooms, check availability, create bookings, and manage their reservations. Admins manage rooms, users, and bookings from a dedicated dashboard.

## Structure

```text
room-booking/
  backend/     Express + Prisma (PostgreSQL) + JWT + Multer + Swagger
  frontend/    React + Vite + TypeScript + Tailwind + shadcn/ui
```

## Features

### Users
- **Auth:** register, login (JWT), protected routes
- **Rooms:** list rooms, room details with image, capacity and price
- **Availability:** check if a room is free for a given day + shift (`MORNING` | `AFTERNOON` | `EVENING`)
- **Bookings:** list “My bookings”, manage booking modal, cancel reservation

### Admin (`isAdmin`)
- **Dashboard** at `/dashboard` with navbar links for Rooms, Users, and Bookings
- **Rooms CRUD:** create/edit/delete rooms, upload PNG/JPG images to `uploads/rooms/`
- **Users CRUD:** create/edit/delete users (including address and admin flag)
- **Bookings CRUD:** list all bookings (with room image + user), create for any user, edit day/shift/room, delete
- **Stats cards** on each admin overview (totals and “new this month” where applicable)

## Prerequisites

- Node.js 20+ (or compatible with the project’s native modules)
- npm
- PostgreSQL running locally (or a remote Postgres instance)

## Backend setup

```bash
cd backend
npm install
```

Configure `backend/.env` (example):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/spacehub?schema=public"
JWT_SECRET="your-secret"
```

> If the password has special characters (e.g. `!`), URL-encode them in `DATABASE_URL`.

Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Optional — seed rooms (images under `uploads/rooms/`):

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
| POST | `/login` | Login (returns JWT + user) |
| GET | `/users` | List users (**admin**) |
| POST | `/users` | Create user (**admin**) |
| PUT | `/users/:id` | Update user (**admin**) |
| DELETE | `/users/:id` | Delete user (**admin**) |
| GET | `/rooms` | List rooms (auth) |
| GET | `/rooms/:id` | Room by id (auth) |
| GET | `/rooms/:id/availability?day=YYYY-MM-DD&shift=MORNING` | Check slot (auth) |
| POST | `/rooms` | Create room (**admin**; `multipart/form-data`, field `image` optional) |
| PUT | `/rooms/:id` | Update room (**admin**; multipart, optional `image`) |
| DELETE | `/rooms/:id` | Delete room (**admin**) |
| GET | `/bookings` | List bookings (own, or all if admin) |
| POST | `/bookings` | Create booking (auth; admin may pass `userId`) |
| PUT | `/bookings/:id` | Update booking (auth) |
| DELETE | `/bookings/:id` | Cancel/delete booking (auth) |

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
| `/rooms/:id` | Auth | Room details + availability / book |
| `/bookings` | Auth | My bookings + manage/cancel modal |
| `/dashboard` | Admin | Admin home |
| `/dashboard/rooms` | Admin | Rooms overview + CRUD |
| `/dashboard/users` | Admin | Users overview + CRUD |
| `/dashboard/bookings` | Admin | Bookings overview + CRUD |
| `*` | Public | 404 |

## Tech stack

**Backend:** Express 5, Prisma 7, PostgreSQL, Zod, JWT, bcrypt, Multer, Swagger  

**Frontend:** React 19, React Router 7, Axios, Tailwind CSS 4, shadcn/ui (Base UI), lucide-react, react-day-picker

## Notes

- Booking uniqueness: one reservation per `roomId` + `day` + `shift`
- Day values are stored as UTC date-only; display booking dates with `timeZone: "UTC"` to avoid off-by-one in Brazil
- Room images are stored under `backend/uploads/rooms/` and served at `/uploads/rooms/...` (upload filenames include a timestamp to avoid collisions)
- Admin UI reuses shared layout pieces (`AdminPageHeader`, `StatCard`, `AdminDataPanel`, modals) across Rooms, Users, and Bookings
