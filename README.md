# Task Tracker

A full-stack web application for managing personal tasks with user authentication, built with Node.js, React, and PostgreSQL.

## Features
- *** hi i am trying 
- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Status**: Mark tasks as pending or completed
- **Responsive UI**: Clean, modern interface that works on all devices
- **Real-time Updates**: Instant task status changes
- **Secure**: Password hashing with bcrypt and JWT authentication

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Jest** for testing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

### DevOps
- **Docker** and Docker Compose
- **GitHub Actions** for CI/CD
- **Nginx** for production frontend serving

## Project Structure

```
task-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database configuration
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   └── taskController.js  # Task CRUD operations
│   │   ├── middlewares/
│   │   │   ├── auth.js            # JWT authentication middleware
│   │   │   └── error.js           # Error handling middleware
│   │   ├── models/
│   │   │   ├── User.js            # User model
│   │   │   ├── Task.js            # Task model
│   │   │   └── index.js           # Model associations
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Authentication routes
│   │   │   └── taskRoutes.js      # Task routes
│   │   ├── tests/
│   │   │   ├── auth.test.js       # Auth API tests
│   │   │   ├── tasks.test.js      # Task API tests
│   │   │   └── setup.js           # Test configuration
│   │   ├── app.js                 # Express app configuration
│   │   └── server.js              # Server entry point
│   ├── Dockerfile                 # Production backend image
│   ├── Dockerfile.dev             # Development backend image
│   ├── package.json
│   └── env.example                # Environment variables example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Main task dashboard
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── Register.jsx       # Registration form
│   │   │   ├── TaskForm.jsx       # Task creation/editing form
│   │   │   ├── TaskItem.jsx       # Individual task component
│   │   │   └── TaskList.jsx       # Task list component
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── Dockerfile                 # Production frontend image
│   ├── Dockerfile.dev             # Development frontend image
│   ├── nginx.conf                 # Nginx configuration
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── docker-compose.yml             # Production services
├── docker-compose.dev.yml         # Development services
└── README.md
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-tracker
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit the .env file with your preferred values
   nano backend/.env
   ```

3. **Start the application**
   ```bash
   # For production
   docker-compose up -d
   
   # For development (with hot reload)
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000 (production) or http://localhost:5173 (development)
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

### Local Development

1. **Set up the database**
   ```bash
   # Start PostgreSQL
   docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=tasktracker -p 5432:5432 -d postgres:15
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tasktracker
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Health Check
- `GET /api/health` - API health status

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Docker Commands

### Production
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
1. Runs tests on push/PR
2. Lints code
3. Builds Docker images
4. Pushes to Docker Hub (if configured)
5. Deploys to production (configurable)

To enable Docker Hub push:
1. Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets to your GitHub repository
2. Update the workflow file with your Docker Hub username

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `passwordHash`
- `createdAt`
- `updatedAt`

### Tasks Table
- `id` (Primary Key)
- `userId` (Foreign Key to Users)
- `title`
- `description`
- `status` (pending/completed)
- `createdAt`
- `updatedAt`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation
- SQL injection protection via Sequelize ORM
- XSS protection headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check database credentials in .env file
   - Verify database exists

2. **Port conflicts**
   - Change ports in docker-compose.yml
   - Update CORS_ORIGIN in backend .env

3. **Frontend not connecting to backend**
   - Check VITE_API_URL in frontend
   - Ensure backend is running on correct port
   - Check CORS configuration

4. **Docker build failures**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```
