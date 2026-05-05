[# TaskFlow — Team Task Manager

A full-stack task management app built with React, Node.js, Express, and PostgreSQL.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Auth**: JWT

## Local Setup

### 1. Clone & install
```bash
git clone <your-repo>
cd taskflow

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure env
Create `backend/.env`:
DATABASE_URL=your_postgres_url
JWT_SECRET=yoursecretkey
PORT=5000
### 3. Run
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## Deployment (Railway)

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project
3. Add a PostgreSQL service
4. Deploy backend: point to `/backend`, set env vars
5. Deploy frontend: point to `/frontend`, set `VITE_API_URL` if needed
6. Done!

## Features
- JWT auth (signup/login)
- Project creation & member management
- Kanban-style task board (To Do / In Progress / Done)
- Role-based access (Admin vs Member)
- Dashboard with stats & overdue tracking](https://glistening-elegance-production-c892.up.railway.app/)
