@echo off
REM Script untuk menjalankan semua server dengan output yang terlihat
REM Dashboard, Backend API, dan Form Absensi

echo ========================================
echo Starting All Servers (Debug Mode)
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
echo Backend akan berjalan di: http://localhost:3001
start "Backend API - Port 3001" cmd /k "cd backend && echo Starting Backend... && npm start"
timeout /t 5 /nobreak >nul

echo [2/3] Starting Frontend Dashboard...
echo Frontend akan berjalan di: http://localhost:3000
start "Frontend Dashboard - Port 3000" cmd /k "echo Starting Frontend... && npm start"
timeout /t 5 /nobreak >nul

echo [3/3] Starting Form Absensi Server...
echo Form Absensi akan berjalan di: http://localhost:8080
cd form-absensi
start "Form Absensi - Port 8080" cmd /k "echo Starting Form Absensi Server... && python -m http.server 8080"
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
echo Window terpisah akan terbuka untuk setiap server.
echo Check window tersebut untuk melihat status dan error (jika ada).
echo.
echo Tekan tombol apapun untuk menutup window ini...
echo (Server akan tetap berjalan di window terpisah)
pause >nul

