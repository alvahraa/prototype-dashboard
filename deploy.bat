@echo off
REM Deployment Script untuk Perpustakaan Dashboard (Windows)
REM Script ini akan build frontend dan mempersiapkan aplikasi untuk deployment

echo Starting deployment preparation...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

echo Node.js version:
node -v

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    exit /b 1
)
cd ..

REM Build frontend
echo Building React application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build React application
    exit /b 1
)

REM Check if build folder exists
if not exist "build" (
    echo ERROR: Build folder not found. Build may have failed.
    exit /b 1
)

echo Build completed successfully!
echo.
echo Next steps:
echo 1. Copy .env.example to .env and configure it
echo 2. Copy backend\.env.example to backend\.env and configure it
echo 3. Upload all files to your hosting server
echo 4. Run 'cd backend && npm start' on your server
echo.
echo Deployment preparation complete!
pause

