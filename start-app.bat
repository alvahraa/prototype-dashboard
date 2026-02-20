@echo off
echo Memulai Sistem Perpustakaan Dashboard...
echo ========================================

:: 1. Start Backend Server (Port 3001)
echo [1/2] Menyalakan Backend Server...
start "Backend Server (API)" cmd /k "cd /d "%~dp0backend" && npm install && node server.js"

:: 2. Start Frontend Dashboard (Port 3000)
echo [2/2] Menyalakan Dashboard...
start "Dashboard (React)" cmd /k "cd /d "%~dp0" && npm start"

echo.
echo ========================================
echo Sistem sedang dinyalakan!
echo Mohon tunggu biarkan kedua jendela CMD terbuka.
echo Dashboard akan otomatis terbuka di browser.
echo.
pause
