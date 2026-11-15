# PixelBoost AI Launch Script (PowerShell)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       Launching PixelBoost AI Server      " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Start Backend Process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\.venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend Process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Starting browser at http://127.0.0.1:5173 ..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://127.0.0.1:5173"
