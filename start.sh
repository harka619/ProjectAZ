#!/bin/bash

# Task Tracker Startup Script

echo "🚀 Starting Task Tracker Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file from example..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file. Please review and update the values if needed."
fi

# Check if frontend .env file exists
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file from example..."
    cp frontend/env.example frontend/.env
    echo "✅ Created frontend/.env file."
fi

echo "🐳 Starting services with Docker Compose..."

# Start the services
docker-compose up -d

echo "⏳ Waiting for services to be ready..."

# Wait for backend to be healthy
echo "🔍 Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start. Check logs with: docker-compose logs backend"
        exit 1
    fi
    sleep 2
done

# Wait for frontend to be ready
echo "🔍 Checking frontend health..."
for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Frontend failed to start. Check logs with: docker-compose logs frontend"
        exit 1
    fi
    sleep 2
done

echo ""
echo "🎉 Task Tracker is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "📊 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""
echo "👤 You can now register a new account or login to start managing tasks!"
