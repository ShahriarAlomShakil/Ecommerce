# E-commerce Project

This repository contains a Medusa v2 commerce backend and a Next.js 15 storefront.

- **Backend:** Medusa server + admin dashboard (`backend/`)
- **Storefront:** Next.js customer-facing shop (`storefront/`)
- **Database/cache:** PostgreSQL + Redis

The application is designed to run locally with:

- Medusa backend on **http://localhost:9000**
- Medusa admin on **http://localhost:9000/app**
- Next.js storefront on **http://localhost:8000**

---

## 1. Tech stack

### Backend
- Medusa `2.13.1`
- Node.js `20+`
- npm `10.x`
- PostgreSQL
- Redis

### Storefront
- Next.js `15.3.9`
- React `19`
- Yarn `4.12.0`
- Tailwind CSS
- TypeScript

---

## 2. System requirements

Install these before starting:

- **Git**
- **Node.js 20 or later**
- **npm 10 or later**
- **Corepack** enabled for Yarn 4 support
- **Docker** (recommended for PostgreSQL and Redis)
- **PostgreSQL** if you don't want to use Docker
- **Redis** if you don't want to use Docker

### Recommended versions

- Node.js: `20.x` or `22.x`
- npm: `10.x`
- Yarn: managed through `corepack`
- Docker Engine / Docker Desktop: latest stable

> Avoid Node.js 25 for this setup. Medusa + the starter storefront are safest on Node.js 20/22.

---

## 3. Repository structure

```text
E-commerce/
├── backend/        # Medusa backend and admin
├── storefront/     # Next.js storefront
├── run-backend.sh  # Helper script that starts Docker containers and runs backend
└── README.md
```

---

## 4. Local ports used by the project

| Service | Port | Notes |
|---|---:|---|
| Medusa backend | 9000 | API + admin dashboard |
| Storefront | 8000 | Next.js app |
| PostgreSQL | 5433 | Backend expects DB here |
| Redis | 6379 | Backend expects Redis here |

---

## 5. Environment files

This project already includes environment templates for both apps.

### Backend environment
Create `backend/.env` from `backend/.env.template`.

Expected variables:

```env
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgres://medusa:medusa@localhost:5433/medusa
DB_NAME=medusa-v2
```

### Storefront environment
Create `storefront/.env.local` from `storefront/.env.template`.

Minimum required variables:

```env
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<your-publishable-key>
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=bd
```

Optional variables:

```env
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=
REVALIDATE_SECRET=supersecret
MEDUSA_CLOUD_S3_HOSTNAME=
MEDUSA_CLOUD_S3_PATHNAME=
```

### Important note about the default region

This project's seed script creates a **Bangladesh** region using country code `bd` and currency `bdt`.

For the storefront to work correctly after seeding, set:

```env
NEXT_PUBLIC_DEFAULT_REGION=bd
```

---

## 6. First-time installation

Open a terminal in the project root.

### 6.1 Enable Corepack

The storefront uses Yarn 4. Enable Corepack first:

```bash
corepack enable
```

### 6.2 Install backend dependencies

```bash
cd backend
npm install
```

### 6.3 Install storefront dependencies

```bash
cd ../storefront
yarn install
```

---

## 7. Database and Redis setup

The backend expects:

- PostgreSQL at `localhost:5433`
- Redis at `localhost:6379`

## Option A: Use existing Docker containers

The helper script `run-backend.sh` expects these container names to already exist:

- `medusa-postgres`
- `local-redis`

If you already created them before, you can reuse them.

## Option B: Create the containers yourself

If the containers do not exist yet, create them once:

### PostgreSQL container

```bash
docker run -d \
  --name medusa-postgres \
  -e POSTGRES_USER=medusa \
  -e POSTGRES_PASSWORD=medusa \
  -e POSTGRES_DB=medusa \
  -p 5433:5432 \
  postgres:16
```

### Redis container

```bash
docker run -d \
  --name local-redis \
  -p 6379:6379 \
  redis:7
```

### Start the containers later

```bash
docker start medusa-postgres local-redis
```

---

## 8. Backend setup and run guide

Go to the backend folder:

```bash
cd backend
```

### 8.1 Create the backend environment file

```bash
cp .env.template .env
```

Then update `DATABASE_URL` so it matches your PostgreSQL setup.

Recommended local value:

```env
DATABASE_URL=postgres://medusa:medusa@localhost:5433/medusa
```

### 8.2 Run initial Medusa admin/database setup

This project includes a convenience script:

```bash
npm run admin:setup
```

What it does:

- prepares the database
- runs Medusa DB setup
- creates an admin user

Default admin credentials created by the script:

- **Email:** `admin@medusa-test.com`
- **Password:** `supersecret`

### 8.3 Seed demo data

Run the seed script after DB setup:

```bash
npm run seed
```

This repository's seed script creates project-specific data, including:

- a **Bangladesh** region
- supported currencies including **BDT**
- default sales channel
- stock location
- shipping/tax data
- product categories and products
- a **publishable API key** linked to the default sales channel

### 8.4 Start the backend

```bash
npm run dev
```

The backend will be available at:

- API: `http://localhost:9000`
- Admin: `http://localhost:9000/app`

### 8.5 Alternative helper script

From the repository root, you can also use:

```bash
./run-backend.sh
```

This script:

1. starts the `medusa-postgres` and `local-redis` Docker containers
2. changes into `backend/`
3. runs `npm run dev`

Use this only if those Docker containers already exist.

---

## 9. Storefront setup and run guide

Go to the storefront folder:

```bash
cd storefront
```

### 9.1 Create the storefront environment file

```bash
cp .env.template .env.local
```

Then update it.

Recommended local values:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=bd
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<your-publishable-key>
```

### 9.2 Get the Medusa publishable API key

The storefront needs a publishable key to call Medusa Store API routes.

You have two ways to get it:

#### Option A: Use the key created by the seed script

The seed script creates a publishable API key and links it to the default sales channel. After seeding, open the Medusa admin and copy the key value.

#### Option B: Create one manually in Medusa Admin

1. Start the backend.
2. Open `http://localhost:9000/app`
3. Sign in with the admin user.
4. Go to **Settings → Publishable API Keys**.
5. Create a new publishable key.
6. Make sure it is scoped to the correct sales channel.
7. Copy the token into `storefront/.env.local` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

### 9.3 Make sure at least one region exists

The storefront requires at least one region in Medusa.

This project's seed script already creates one:

- Region: **Bangladesh**
- Country code: `bd`
- Currency: `bdt`

If you skip seeding, the storefront middleware may fail when trying to resolve region data.

### 9.4 Start the storefront

```bash
yarn dev
```

The storefront will be available at:

- `http://localhost:8000`

---

## 10. Full local run sequence

If this is your first time running the project, use this order:

### Step 1
Install dependencies.

```bash
cd backend && npm install
cd ../storefront && yarn install
```

### Step 2
Create environment files.

```bash
cd ../backend && cp .env.template .env
cd ../storefront && cp .env.template .env.local
```

### Step 3
Start PostgreSQL and Redis.

```bash
docker start medusa-postgres local-redis
```

### Step 4
Prepare the backend database and admin user.

```bash
cd ../backend
npm run admin:setup
```

### Step 5
Seed demo data.

```bash
npm run seed
```

### Step 6
Start the backend.

```bash
npm run dev
```

### Step 7
Copy the publishable API key from Medusa Admin into `storefront/.env.local`.

### Step 8
Start the storefront in another terminal.

```bash
cd ../storefront
yarn dev
```

### Step 9
Open the apps.

- Storefront: `http://localhost:8000`
- Admin: `http://localhost:9000/app`

---

## 11. Build commands

### Backend

```bash
cd backend
npm run build
npm run start
```

### Storefront

```bash
cd storefront
yarn build
yarn start
```

---

## 12. Useful development commands

### Backend

```bash
npm run dev
npm run build
npm run start
npm run seed
npm run admin:setup
npm run admin:create-user -- -e you@example.com -p yourpassword
npm run test:unit
npm run test:integration:http
npm run test:integration:modules
```

### Storefront

```bash
yarn dev
yarn build
yarn start
yarn lint
yarn analyze
```

---

## 13. Troubleshooting

### `yarn` command not found
Enable Corepack:

```bash
corepack enable
```

### Backend cannot connect to PostgreSQL
Check:

- PostgreSQL container is running
- port `5433` is exposed
- database name is `medusa`
- username/password match `DATABASE_URL`

### Backend cannot connect to Redis
Check that Redis is running on:

- `redis://localhost:6379`

### Storefront shows region or middleware errors
Usually one of these is missing:

- backend is not running
- `MEDUSA_BACKEND_URL` is wrong
- publishable key is missing
- no region exists in Medusa
- `NEXT_PUBLIC_DEFAULT_REGION` does not match a seeded country code

For this repository, prefer:

```env
NEXT_PUBLIC_DEFAULT_REGION=bd
```

### Products or categories do not appear
Run the seed script again:

```bash
cd backend
npm run seed
```

### Admin login does not work
Recreate the admin user:

```bash
cd backend
npm run admin:create-user -- -e admin@medusa-test.com -p supersecret
```

---

## 14. Production notes

Before deploying:

- replace all local secrets
- use managed PostgreSQL and Redis
- update CORS values in `backend/.env`
- update storefront URLs in `storefront/.env.local`
- use a real publishable key for the correct sales channel
- configure Stripe keys only if payment integration is required

---

## 15. Quick reference

### Backend

- Folder: `backend/`
- Install: `npm install`
- Dev server: `npm run dev`
- Admin URL: `http://localhost:9000/app`

### Storefront

- Folder: `storefront/`
- Install: `yarn install`
- Dev server: `yarn dev`
- Store URL: `http://localhost:8000`

### Infrastructure

- PostgreSQL: `localhost:5433`
- Redis: `localhost:6379`

---

## 16. Recommended first successful run checklist

- [ ] Node.js 20/22 installed
- [ ] Corepack enabled
- [ ] Backend dependencies installed
- [ ] Storefront dependencies installed
- [ ] PostgreSQL running on port 5433
- [ ] Redis running on port 6379
- [ ] `backend/.env` created
- [ ] `storefront/.env.local` created
- [ ] `npm run admin:setup` completed
- [ ] `npm run seed` completed
- [ ] Publishable API key copied to storefront env
- [ ] `npm run dev` running in `backend/`
- [ ] `yarn dev` running in `storefront/`

If all items above are done, the project should run locally end-to-end.
