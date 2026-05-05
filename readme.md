# TaskFlow — Team Task Manager

A full-stack collaborative task management web application where teams can create projects, assign tasks, and track progress in real time. Built as a simplified alternative to tools like Trello or Asana.

![TaskFlow](https://img.shields.io/badge/TaskFlow-v1.0.0-brightgreen)
![Node](https://img.shields.io/badge/Node.js-v22-green)
![React](https://img.shields.io/badge/React-v18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![Railway](https://img.shields.io/badge/Deployed-Railway-purple)

---

## 🔗 Live Demo

**Frontend:** https://glistening-elegance-production-c892.up.railway.app
**Backend API:** https://taskflow-production-fc88.up.railway.app

---

## 📌 Features

### Authentication
- Signup with Name, Email, Password
- Secure login with JWT tokens
- Protected routes — unauthenticated users are redirected to login

### Project Management
- Create projects (creator automatically becomes Admin)
- Admin can invite members by email
- Admin can remove members from a project
- Members can view all projects they belong to

### Task Management
- Create tasks with Title, Description, Due Date, and Priority (Low / Medium / High)
- Assign tasks to specific project members
- Kanban-style board with three columns — To Do, In Progress, Done
- Any member can update task status
- Overdue tasks are highlighted in red

### Dashboard
- Total task count across all projects
- Tasks broken down by status with visual progress bars
- Task count per team member
- Overdue task count

### Role-Based Access Control
| Feature | Admin | Member |
|---|---|---|
| Create tasks | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Update task status | ✅ | ✅ |
| View projects & tasks | ✅ | ✅ |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (hosted on Neon) |
| Authentication | JWT (JSON Web Tokens) |
| Deployment | Railway |
| HTTP Client | Axios |

---

## 📁 Project Structure
taskflow/
├── backend/
│   ├── index.js              # Express app entry point + DB init
│   ├── db.js                 # PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js           # /api/auth — signup, login
│   │   ├── projects.js       # /api/projects — CRUD + members
│   │   └── tasks.js          # /api/tasks — CRUD + dashboard
│   ├── .env                  # Environment variables (not committed)
│   └── package.json
│
└── frontend/
├── src/
│   ├── App.jsx            # Routes configuration
│   ├── main.jsx           # React entry point
│   ├── api.js             # Axios instance with auth header
│   ├── index.css          # Global styles + design system
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   └── Tasks.jsx
│   └── components/
│       └── Navbar.jsx
├── index.html
└── package.json

---

## 🗄 Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary Key |
| name | VARCHAR | Required |
| email | VARCHAR | Unique |
| password | VARCHAR | Bcrypt hashed |
| created_at | TIMESTAMP | Auto |

### projects
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary Key |
| name | VARCHAR | Required |
| description | TEXT | Optional |
| admin_id | INTEGER | FK → users |
| created_at | TIMESTAMP | Auto |

### project_members
| Column | Type | Notes |
|---|---|---|
| project_id | INTEGER | FK → projects |
| user_id | INTEGER | FK → users |
| role | VARCHAR | admin / member |

### tasks
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary Key |
| title | VARCHAR | Required |
| description | TEXT | Optional |
| due_date | DATE | Optional |
| priority | VARCHAR | low / medium / high |
| status | VARCHAR | todo / inprogress / done |
| project_id | INTEGER | FK → projects |
| assigned_to | INTEGER | FK → users |
| created_by | INTEGER | FK → users |
| created_at | TIMESTAMP | Auto |

---

## 🔌 API Endpoints

### Auth
POST /api/auth/signup     — Register new user
POST /api/auth/login      — Login and receive JWT

### Projects
GET    /api/projects              — Get all my projects
POST   /api/projects              — Create a new project
GET    /api/projects/:id/members  — Get project members
POST   /api/projects/:id/members  — Add member by email (admin only)
DELETE /api/projects/:id/members/:userId — Remove member (admin only)

### Tasks
GET    /api/tasks/dashboard          — Get dashboard stats
GET    /api/tasks/project/:projectId — Get tasks for a project
POST   /api/tasks                    — Create task (admin only)
PATCH  /api/tasks/:id/status         — Update task status
DELETE /api/tasks/:id                — Delete task (admin only)

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18 or higher
- npm
- A free PostgreSQL database (Neon.tech recommended)

### 1. Clone the repository
```bash
git clone https://github.com/YOURUSERNAME/taskflow.git
cd taskflow
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_random_secret_key
PORT=5000

Start the backend:
```bash
npm run dev
```
You should see `Server on port 5000` and `DB ready`.  
Tables are created automatically on first run — no manual SQL needed.

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend` folder:
VITE_API_URL=http://localhost:5000/api

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🚀 Deployment (Railway)

### Backend
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory** to `backend`
3. Add environment variables:
   - `DATABASE_URL` — your Neon connection string
   - `JWT_SECRET` — any secret string
   - `PORT` — 5000
4. Set **Start Command** to `node index.js`
5. Generate a public domain from Settings → Networking

### Frontend
1. Add a new service in the same Railway project
2. Set **Root Directory** to `frontend`
3. Set **Build Command** to `npm run build`
4. Set **Start Command** to `npx serve dist`
5. Add environment variable:
   - `VITE_API_URL` — your Railway backend URL + `/api`  
     Example: `https://taskflow-backend.up.railway.app/api`
6. Generate a public domain — this is your live app URL

---

## 🔐 Environment Variables

### Backend `.env`
| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string from Neon |
| JWT_SECRET | Any random secret string for signing tokens |
| PORT | Port number (5000) |

### Frontend `.env`
| Variable | Description |
|---|---|
| VITE_API_URL | Full backend API URL including /api suffix |

---

## 👤 How to Use

1. **Sign up** with your name, email and password
2. Go to **Projects** → click **New Project** to create one (you become Admin)
3. Inside the project → click **Manage Members** → invite teammates by email
4. Click **Add Task** → fill in details and assign to a team member
5. Team members can drag tasks across **To Do → In Progress → Done**
6. Check the **Dashboard** for an overview of all task stats

---

## 🧠 Design Decisions

- **JWT over sessions** — stateless, works well with separate frontend/backend deployment
- **Auto table creation** — `initDB()` in `index.js` creates all tables on startup, no manual migration needed
- **Role stored in junction table** — `project_members` stores role per project, allowing a user to be admin in one project and member in another
- **Neon PostgreSQL** — serverless Postgres with free tier, works perfectly with Railway deployment
- **Vite + React** — fast development experience with HMR and optimized production builds

---

## 📹 Demo Video

[Link to demo video]

---

## 👨‍💻 Author

**Tanish Sharma**  
GitHub: [TanishSharma2004](https://github.com/TanishSharma2004)
