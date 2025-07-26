# Notes API - Test Task

A robust REST API built with NestJS for managing notes with user authentication and secure sharing capabilities.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Notes Management**: Create, read, update, and delete personal notes
- **Secure Sharing**: Generate secure share links for notes with expiration
- **Database**: PostgreSQL with TypeORM for data persistence
- **Caching**: Redis integration for performance optimization
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Comprehensive test suite with Jest
- **Docker Support**: Containerized development and production environments
- **CI/CD**: GitHub Actions workflow for automated testing and deployment

## 🛠 Tech Stack

- **Framework**: NestJS 10.4.20
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM with transactional support
- **Authentication**: JWT with Passport
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **Package Manager**: Yarn

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15
- Redis

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <https://github.com/Lyudvig33/test-task-notes>
   cd test-task
   ```

2. **Start the application with Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5434
   - Redis on port 6379
   - API server on port 3000

3. **Access the API documentation**
   - Swagger UI: http://localhost:3000/api/docs

### Manual Setup

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.development.example .env.development
   # Edit .env.development with your database credentials
   ```

3. **Start PostgreSQL and Redis**

   ```bash
   docker-compose up postgres redis -d
   ```

4. **Run database migrations**

   ```bash
   npm run migration:run
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

## 📁 Project Structure

```
src/
├── common/                    # Shared utilities and configurations
│   ├── configs/              # Application configurations
│   ├── database/             # Database entities and migrations
│   ├── decorators/           # Custom decorators
│   ├── dtos/                 # Data Transfer Objects
│   ├── enums/                # TypeScript enums
│   ├── error-messages/       # Error message constants
│   ├── filters/              # Exception filters
│   ├── guards/               # Authentication guards
│   ├── helpers/              # Utility functions
│   ├── interceptors/         # Request/response interceptors
│   ├── models/               # Shared models and validators
│   ├── pipes/                # Custom pipes
│   └── providers/            # Shared providers
├── resources/                # Feature modules
│   ├── auth/                 # Authentication module
│   ├── notes/                # Notes management module
│   ├── shared-links/         # Note sharing module
│   └── users/                # User management module
├── app.module.ts             # Root application module
└── main.ts                   # Application entry point
```

## 🗄 Database Schema

### Users

- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `refreshToken`: String (Optional)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Notes

- `id`: UUID (Primary Key)
- `title`: String
- `body`: Text
- `userId`: UUID (Foreign Key to Users)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Share Links

- `id`: UUID (Primary Key)
- `tokenHash`: String (Unique)
- `expiresAt`: Timestamp
- `isUsed`: Boolean
- `noteId`: UUID (Foreign Key to Notes)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## 🔐 Authentication

The API uses JWT-based authentication with the following endpoints:

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

## 📝 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/users` - Get users
- `PATCH /api/v1/users/me` - Update user
- `DELETE /api/v1/users/me` - Delete user

### Notes

- `GET /api/v1/notes` - Get all user notes
- `POST /api/v1/notes` - Create a new note
- `GET /api/v1/notes/:id` - Get a specific note
- `PUT /api/v1/notes/:id` - Update a note
- `DELETE /api/v1/notes/:id` - Delete a note

### Shared Links

- `POST /api/v1/shared-links` - Create a share link for a note
- `GET /api/v1/shared-links/:token` - Access a shared note
- `DELETE /api/v1/shared-links/:id` - Delete a share link

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm run test

```

## 📦 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run lint` - Run ESLint
- `npm run migration:run` - Run database migrations
- `npm run migration:generate` - Generate new migration
- `npm run migration:create` - Create empty migration
- `npm run migration:revert` - Revert last migration

## 🔧 Configuration

The application uses environment-based configuration:

- `.env.development` - Development environment

Key configuration options:

- Database connection settings
- JWT secret keys
- Redis connection
- Application port and host

## 🐳 Docker

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker build --target production -t notes-api .
docker run -p 3000:3000 notes-api
```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:3000/api/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is private and unlicensed.

## 👨‍💻 Author

**Lyudvig Asoyan**

## 🔄 CI

The project includes a GitHub Actions workflow that:

- Runs on pushes to the master branch
- Installs dependencies
- Runs linting
- Builds the application
- Executes tests

## 🚨 Environment Variables

Create `.env.development` file with the following variables:

```env
#APP_NAME='test'
APP_VERSION=1.0
PORT=3000
NODE_ENV=development
ENVIRONMENT=development

# Database configurations
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=dbUSERNAME
DATABASE_PASSWORD=dbPASSWORD
DATABASE_NAME=test_task
DB_SYNC=true

# Local Database configurations for migration
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_USER=dbUSERNAME
DATABASE_PASSWORD=dbPASSWORD
DATABASE_NAME=test_task
DB_SYNC=true

#Authentication configurations
JWT_SECRET=testtest
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=yourRefreshSecret
JWT_REFRESH_SECRET_EXPIRES_IN=7d

#Cache Configuration
REDIS_HOST=redis
REDIS_PORT=6379
```

## 📊 Performance

- Database queries are optimized with proper indexing
- Redis caching for frequently accessed data
- Transactional database operations for data consistency
- Efficient JWT token management with refresh tokens
