@echo off
title Findora AI Discovery Engine Launcher
cls
echo =========================================================
echo    Findora AI E-Commerce Discovery Engine Launcher
echo =========================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo Installing backend dependencies...
    venv\Scripts\python.exe -m pip install -r backend/requirements.txt
)

echo [1/2] Starting FastAPI Backend Server on http://127.0.0.1:8000...
start "Findora Backend API" cmd /k "cd /d %ROOT_DIR% && venv\Scripts\python.exe -m uvicorn app.main:app --reload --app-dir backend --port 8000"

timeout /t 3 >nul

echo [2/2] Starting React + Vite Frontend App on http://localhost:3000...
start "Findora Frontend App" cmd /k "cd /d %ROOT_DIR%frontend && npm run dev"

echo.
echo =========================================================
echo Both servers are now running!
echo  - Frontend App: http://localhost:3000
echo  - Backend Docs: http://127.0.0.1:8000/docs
echo =========================================================
echo.
pause
