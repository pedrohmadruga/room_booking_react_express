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

## Deploy (Supabase + Render + Vercel)

### 1. Supabase (database)
1. Project Settings → Database → **Connection string** / Connect.
2. Locally, Direct (`db.<ref>.supabase.co:5432`) often works.
3. **On Render, Direct usually fails with P1001** (IPv6). Use **Session pooler** instead:
   - Host: `aws-0-<region>.pooler.supabase.com`
   - Port: `5432`
   - User: `postgres.<project-ref>` (not only `postgres`)
   - Add `?sslmode=require`
4. Also check **Database → Network Restrictions**: allow all (or Render) for the free demo.
5. From your machine (Direct URL in `backend/.env` is fine for this step):

```bash
cd backend
npx prisma migrate deploy
```

### 2. Render (backend)
| Field | Value |
|--------|--------|
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

Environment variables on Render (use the **Session pooler** URI, not Direct):
```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require
JWT_SECRET=...long random string...
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

`PORT` is injected by Render. Free tier sleeps after idle; cold start can take ~30–60s.

If build still fails with P1001, your Build Command is still reaching the DB — use Build = `npm install && npx prisma generate` only; migrations run on `npm start`.

### 3. Vercel (frontend)
| Field | Value |
|--------|--------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output | `dist` |

`frontend/vercel.json` already rewrites all routes to `index.html` (required for React Router — without it, `/register`, `/login`, etc. return 404 on refresh).

Environment variable on Vercel:
```env
VITE_API_URL=https://your-api.onrender.com/
```

After the Vercel URL exists, set `FRONTEND_URL` on Render to that origin (no trailing slash) and redeploy the API (CORS).

### 4. Local CORS helper
For local + production origins, use `FRONTEND_URL` (comma-separated). See `backend/.env.example`.

## Notes

- Booking uniqueness: one reservation per `roomId` + `day` + `shift`
- Day values are stored as UTC date-only; display booking dates with `timeZone: "UTC"` to avoid off-by-one in Brazil
- Room images are stored under `backend/uploads/rooms/` and served at `/uploads/rooms/...` (upload filenames include a timestamp to avoid collisions)
- On Render free tier, files written to disk are lost on redeploy — seed/static images are safer until you move to object storage (e.g. Supabase Storage)
- Admin UI reuses shared layout pieces (`AdminPageHeader`, `StatCard`, `AdminDataPanel`, modals) across Rooms, Users, and Bookings
