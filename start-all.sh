#!/bin/bash

# Script untuk menjalankan semua server sekaligus
# Dashboard, Backend API, dan Form Absensi

echo "========================================"
echo "Starting All Servers"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu."
    exit 1
fi

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "WARNING: Port $1 sudah digunakan"
        return 1
    fi
    return 0
}

echo "[1/3] Starting Backend API Server..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 3

echo "[2/3] Starting Frontend Dashboard..."
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

echo "[3/3] Starting Form Absensi Server..."
cd form-absensi
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080 > ../form-absensi.log 2>&1 &
elif command -v python &> /dev/null; then
    python -m http.server 8080 > ../form-absensi.log 2>&1 &
else
    echo "WARNING: Python tidak ditemukan. Form Absensi bisa dibuka langsung di browser:"
    echo "  file://$(pwd)/index.html"
    FORM_PID=""
fi
FORM_PID=$!
cd ..

echo ""
echo "========================================"
echo "All Servers Started!"
echo "========================================"
echo ""
echo "Backend API:     http://localhost:3001"
echo "Frontend Dashboard: http://localhost:3000"
echo "Form Absensi:    http://localhost:8080"
echo ""
echo "Logs:"
echo "  Backend:    backend.log"
echo "  Frontend:   frontend.log"
echo "  Form:       form-absensi.log"
echo ""
echo "Tekan Ctrl+C untuk menghentikan semua server"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID $FORM_PID 2>/dev/null; exit" INT TERM
wait

