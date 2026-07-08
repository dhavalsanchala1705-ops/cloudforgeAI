@echo off
echo ╔══════════════════════════════════════════════════════════╗
echo ║     CloudArch AI — Local Dev Startup Script             ║
echo ╚══════════════════════════════════════════════════════════╝

echo.
echo [1/4] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    exit /b 1
)
echo ✅ Docker is running

echo.
echo [2/4] Starting PostgreSQL...
docker-compose up -d postgres
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Running database migrations...
cd backend
call venv\Scripts\activate
alembic upgrade head
cd ..

echo.
echo [4/4] Starting FastAPI backend...
start "CloudArch Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo.
echo [5/5] Starting React frontend...
start "CloudArch Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ All services starting!
echo.
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.
pause
