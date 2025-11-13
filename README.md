# Click Counter Application

A full-stack web application for tracking user clicks with authentication and analytics.

## Project Structure

```
click-counter-app/
├── frontend/     # React frontend application
├── backend/      # Express backend API
└── docs/         # Documentation repository
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm

### Setup

1. **Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Features

- User authentication (email/password)
- Click tracking per user
- Real-time click counter
- User analytics dashboard
- Global analytics with leaderboard

## Documentation

See the [docs](./docs/) directory for comprehensive documentation:
- [Setup Guide](./docs/SETUP.md)
- [API Documentation](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## License

Copyright Anysphere Inc.

