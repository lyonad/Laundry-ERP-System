# Script untuk menjalankan Backend dan Frontend sekaligus

Write-Host "🚀 Starting Sistem ERP Laundry..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "📦 Starting Backend Server (Port 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🎨 Starting Frontend Server (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "✅ Servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:3002" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop servers" -ForegroundColor Gray
