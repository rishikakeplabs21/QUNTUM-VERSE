@echo off
echo ========================================================
echo   Starting KEP QuantumVerse Platform (Backend + Frontend)
echo ========================================================

start "KEP QuantumVerse Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"
timeout /t 2 /nobreak > nul

cd frontend
start "KEP QuantumVerse Frontend" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo KEP QuantumVerse is starting up:
echo Frontend UI: http://127.0.0.1:5173
echo Backend API: http://127.0.0.1:8000/docs
echo ========================================================
pause
