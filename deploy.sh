#!/bin/bash

# Deployment Script untuk Perpustakaan Dashboard
# Script ini akan build frontend dan mempersiapkan aplikasi untuk deployment

echo "Starting deployment preparation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "ERROR: Node.js version must be 16 or higher. Current version: $(node -v)"
    exit 1
fi

echo "Node.js version: $(node -v)"

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..

# Build frontend
echo "Building React application..."
npm run build

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build React application"
    exit 1
fi

# Check if build folder exists
if [ ! -d "build" ]; then
    echo "ERROR: Build folder not found. Build may have failed."
    exit 1
fi

echo "Build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure it"
echo "2. Copy backend/.env.example to backend/.env and configure it"
echo "3. Upload all files to your hosting server"
echo "4. Run 'cd backend && npm start' on your server"
echo ""
echo "Deployment preparation complete!"

