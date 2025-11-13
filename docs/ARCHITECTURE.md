# Architecture Documentation

## System Overview

The Click Counter Application follows a three-tier architecture:

1. **Frontend Layer**: React SPA with client-side routing
2. **Backend Layer**: RESTful API with Express.js
3. **Data Layer**: PostgreSQL database with Prisma ORM

## Architecture Diagram

```
┌─────────────────┐
│   React Frontend │
│   (Port 5173)    │
└────────┬─────────┘
         │ HTTP/REST
         │
┌────────▼─────────┐
│  Express Backend │
│   (Port 5000)    │
└────────┬─────────┘
         │
         │ Prisma ORM
         │
┌────────▼─────────┐
│   PostgreSQL     │
│    Database      │
└──────────────────┘
```

## Frontend Architecture

### Component Structure

```
src/
├── App.tsx                 # Main app component with routing
├── main.tsx                # Entry point
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── components/
│   ├── NavBar.tsx          # Navigation component
│   └── PrivateRoute.tsx    # Protected route wrapper
├── pages/
│   ├── Login.tsx           # Login/Register page
│   ├── Dashboard.tsx       # Main click counter page
│   └── Analytics.tsx       # Analytics visualization
└── services/
    ├── api.ts              # Axios instance with interceptors
    ├── auth.ts             # Authentication API calls
    ├── clicks.ts           # Click tracking API calls
    └── analytics.ts        # Analytics API calls
```

### State Management

- **Authentication**: React Context API (`AuthContext`)
- **Component State**: Local React state with hooks
- **API State**: Managed through service layer with async/await

### Routing

- React Router v6 for client-side routing
- Protected routes using `PrivateRoute` component
- Automatic redirects based on authentication status

## Backend Architecture

### Directory Structure

```
src/
├── server.ts               # Express app setup
├── middleware/
│   └── auth.ts             # JWT authentication middleware
├── routes/
│   ├── auth.ts             # Authentication endpoints
│   ├── clicks.ts           # Click tracking endpoints
│   └── analytics.ts        # Analytics endpoints
└── services/
    ├── auth.service.ts     # Authentication business logic
    └── click.service.ts    # Click tracking business logic
```

### API Design

- RESTful API design principles
- JSON request/response format
- JWT token-based authentication
- Error handling with consistent error responses

### Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  clicks    Click[]
  createdAt DateTime @default(now())
}

model Click {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(...)
  timestamp DateTime @default(now())
}
```

## Security Considerations

### Authentication

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 24-hour expiration
- Token stored in localStorage (consider httpOnly cookies for production)

### API Security

- CORS configured for specific frontend origin
- Input validation on all endpoints
- SQL injection protection via Prisma parameterized queries
- Rate limiting recommended for production

### Data Protection

- Passwords never stored in plain text
- User IDs used instead of emails in JWT payload
- Cascade delete for user clicks

## Data Flow

### Click Recording Flow

1. User clicks button in frontend
2. Frontend calls `POST /api/clicks` with JWT token
3. Backend validates token via middleware
4. Backend creates Click record in database
5. Backend returns success response
6. Frontend updates local counter state

### Authentication Flow

1. User submits login/register form
2. Frontend calls auth endpoint (`/api/auth/login` or `/api/auth/register`)
3. Backend validates credentials or creates user
4. Backend returns JWT token and user info
5. Frontend stores token in localStorage
6. Frontend redirects to dashboard

## Scalability Considerations

### Current Implementation

- Single database instance
- Stateless API (can scale horizontally)
- Client-side state management

### Future Enhancements

- Redis for session management
- Database connection pooling
- Caching layer for analytics queries
- CDN for static assets
- Load balancing for API servers

## Error Handling

### Frontend

- Try-catch blocks in async functions
- Error messages displayed to users
- Automatic token refresh on 401 errors
- Graceful fallbacks for failed API calls

### Backend

- Consistent error response format
- HTTP status codes for different error types
- Error logging (implement logging service)
- Validation error messages

## Testing Strategy

### Unit Tests

- Service layer functions
- Utility functions
- Component rendering

### Integration Tests

- API endpoint testing
- Database operations
- Authentication flows

### E2E Tests

- User registration and login
- Click recording
- Analytics viewing

## Deployment Architecture

### Development

- Local PostgreSQL database
- Development servers with hot reload
- Environment variables in `.env` files

### Production (Recommended)

- Containerized applications (Docker)
- Managed PostgreSQL database
- Environment variables via secrets management
- Reverse proxy (nginx) for frontend
- API gateway for backend
- Monitoring and logging services

