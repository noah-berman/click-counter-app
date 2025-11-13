# Click Counter Application Documentation

Welcome to the Click Counter Application documentation. This application is a full-stack web application that allows users to track their clicks with authentication and analytics.

## Overview

The Click Counter Application consists of three main repositories:

- **Frontend**: React-based user interface
- **Backend**: Express.js API server
- **Docs**: This documentation repository

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Setup Steps

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Documentation Structure

- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions
- [API Documentation](./API.md) - Complete API reference
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Deployment](./DEPLOYMENT.md) - Production deployment guide
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## Features

- User authentication (email/password)
- Click tracking per user
- Real-time click counter
- User analytics dashboard
- Global analytics with leaderboard

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **Authentication**: JWT tokens with bcrypt password hashing

## Support

For issues or questions, please refer to the [Contributing Guide](./CONTRIBUTING.md).

