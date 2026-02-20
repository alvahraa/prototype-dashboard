@echo off
REM Script untuk menjalankan semua server sekaligus
REM Dashboard, Backend API, dan Form Absensi

echo ========================================
echo Starting All Servers
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu.
    pause
    exit /b 1
)

echo [1/3] Starting Backend API Server...
start "Backend API - Port 3001" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Dashboard...
start "Frontend Dashboard - Port 3000" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Form Absensi Server...
cd form-absensi
start "Form Absensi - Port 8080" cmd /k "python -m http.server 8080"
cd ..

echo.
echo ========================================
echo All Servers Started!
echo ========================================
echo.
echo Backend API:     http://localhost:3001
echo Frontend Dashboard: http://localhost:3000
echo Form Absensi:    http://localhost:8080
echo.
echo Tekan tombol apapun untuk menutup window ini...
echo (Server akan tetap berjalan di window terpisah)
pause >nul

