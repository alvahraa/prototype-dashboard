#!/usr/bin/env bash
# exit on error
set -o errexit

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Build React application
npm run build
