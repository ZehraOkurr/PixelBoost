@echo off
echo Starting PixelBoost AI...

REM Start Backend
start "PixelBoost AI Backend" cmd /k "cd backend && .venv\Scripts\activate && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM Start Frontend
start "PixelBoost AI Frontend" cmd /k "cd frontend && npm run dev"

echo PixelBoost AI is launching!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
timeout /t 3
start http://127.0.0.1:5173
