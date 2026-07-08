# CloudArch AI — AWS Architecture Generator SaaS

An AI-powered SaaS platform that generates three tailored AWS architecture blueprints (Startup, Production, Enterprise) from a plain-language app description.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS v3 + React Flow |
| Backend | FastAPI (Python 3.11) + SQLAlchemy + Alembic |
| AI | Google Gemini 1.5 Pro (structured JSON) |
| Database | PostgreSQL (docker-compose locally / Supabase in prod) |
| Auth | AWS Cognito (User Pools, JWKS JWT verification) |
| Storage | Amazon S3 |

---

## Project Structure

```
.
├── backend/          # FastAPI application
├── frontend/         # React Vite application
├── infrastructure/   # AWS CloudFormation templates
├── docker-compose.yml
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Docker Desktop
- Node.js 20+
- Python 3.11+

### Step 1: Clone & configure environment

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and `frontend/.env` with your real values (see Phase 2 guide below for Cognito setup).

### Step 2: Start the database + backend

```bash
docker-compose up -d postgres
```

### Step 3: Install backend dependencies & run migrations

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Or use docker-compose for everything:
```bash
docker-compose up
```

### Step 4: Install frontend dependencies & start dev server

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173
Backend API docs: http://localhost:8000/docs

---

## Phase-by-Phase AWS Setup Guide

### 🔑 Phase 2 — AWS Cognito Setup

> Follow these steps EXACTLY. I'll guide you through the AWS console.

#### Step 2.1 — Create Cognito User Pool via CloudFormation

1. Go to **AWS Console** → Search **"CloudFormation"** → Click **"Create stack"** → **"With new resources"**
2. Choose **"Upload a template file"** → Upload `infrastructure/cloudformation/cognito.yaml`
3. Stack name: `cloudarch-ai-auth`
4. Parameters:
   - `AppName`: `cloudarch-ai`
   - `UserPoolDomain`: `cloudarch-ai-auth-YOURNAME` (must be globally unique)
5. Click **Next** → **Next** → Check "I acknowledge..." → **Create stack**
6. Wait ~2 minutes for status to show `CREATE_COMPLETE`
7. Go to **Outputs** tab — copy these values:
   - `UserPoolId` → paste into `backend/.env` as `AWS_COGNITO_USER_POOL_ID`
   - `UserPoolClientId` → paste into both `.env` files as `AWS_COGNITO_APP_CLIENT_ID`
   - `CognitoHostedUIDomain` → paste into `frontend/.env` as `VITE_COGNITO_DOMAIN`

#### Step 2.2 — Verify Cognito is working

After setting env vars and restarting backend:
```bash
curl http://localhost:8000/api/v1/health
# Should return: {"status": "ok", ...}
```

---

### 🤖 Phase 4 — Gemini API Key Setup

1. Go to **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"** → Select your Google Cloud project
3. Copy the key → paste into `backend/.env` as `GEMINI_API_KEY`

---

### 🗃️ Phase 3 — Database Setup (Supabase for production)

**Local (docker-compose):** Already configured — PostgreSQL runs on port 5432.

**Supabase (production):**
1. Go to **https://supabase.com** → Create a new project
2. Go to **Settings** → **Database** → Copy the **Connection string** (URI format)
3. Replace `postgresql://` with `postgresql+asyncpg://`
4. Paste into `backend/.env` as `DATABASE_URL`

---

### 🪣 S3 Setup (optional for local dev)

1. Go to **AWS Console** → **S3** → **Create bucket**
2. Bucket name: `cloudarch-ai-reports-YOURNAME`
3. Region: `us-east-1`
4. Block all public access: ✅ checked
5. Enable server-side encryption: ✅ AES-256
6. Paste bucket name into `backend/.env` as `AWS_S3_BUCKET_NAME`

> **Note:** S3 upload is non-fatal in local dev — you can leave `AWS_S3_BUCKET_NAME` empty.

---

## Running Database Migrations

```bash
cd backend

# Create initial migration (first time only)
alembic revision --autogenerate -m "initial tables"

# Apply migrations
alembic upgrade head

# Rollback one version
alembic downgrade -1
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/projects` | List user's projects |
| POST | `/api/v1/projects` | Create a project |
| GET | `/api/v1/projects/{id}` | Get project |
| PUT | `/api/v1/projects/{id}/questions` | Save clarifying answers |
| POST | `/api/v1/projects/{id}/generate` | Generate architectures via Gemini |
| DELETE | `/api/v1/projects/{id}` | Delete project |
| GET | `/api/v1/architectures/project/{id}` | Get all architectures for a project |

All endpoints except `/health` require a Cognito `Authorization: Bearer <id_token>` header.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL async URL |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `AWS_COGNITO_REGION` | e.g. `us-east-1` |
| `AWS_COGNITO_USER_POOL_ID` | From CloudFormation Outputs |
| `AWS_COGNITO_APP_CLIENT_ID` | From CloudFormation Outputs |
| `AWS_S3_BUCKET_NAME` | S3 bucket for reports |
| `AWS_REGION` | AWS region |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) |
| `ENVIRONMENT` | `development` or `production` |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL |
| `VITE_COGNITO_REGION` | e.g. `us-east-1` |
| `VITE_COGNITO_USER_POOL_ID` | From CloudFormation Outputs |
| `VITE_COGNITO_APP_CLIENT_ID` | From CloudFormation Outputs |
| `VITE_COGNITO_DOMAIN` | Cognito hosted UI domain |

---

## Security Notes

- Never commit real `.env` files — only `.env.example`
- Cognito JWT verification uses JWKS (public key) — no secret stored
- All DB queries filter by `owner_id = cognito_sub` — users can only see their own data
- S3 bucket is private — no public access
- IAM: Use task roles with minimum permissions only

---

## License

MIT
