# Setup Guide

Detailed setup instructions for the Click Counter Application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **PostgreSQL**: Version 12 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

## Step 1: Clone or Navigate to the Project

```bash
cd click-counter-app
```

## Step 2: Database Setup

### Install PostgreSQL

Follow the installation instructions for your operating system from the [PostgreSQL website](https://www.postgresql.org/download/).

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE clickcounter;

# Exit psql
\q
```

### Alternative: Using Docker

```bash
docker run --name clickcounter-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=clickcounter \
  -p 5432:5432 \
  -d postgres
```

## Step 3: Backend Setup

### Navigate to Backend Directory

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/clickcounter?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

**Important**: 
- Replace `username` and `password` with your PostgreSQL credentials
- Change `JWT_SECRET` to a secure random string for production
- Ensure the database name matches what you created

### Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### Start Backend Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The backend server should now be running on `http://localhost:5000`.

## Step 4: Frontend Setup

### Navigate to Frontend Directory

Open a new terminal window:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables (Optional)

Create a `.env` file if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:5000
```

### Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`.

## Step 5: Verify Installation

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the login page
3. Create a new account with email and password
4. After registration, you should be redirected to the dashboard
5. Click the "CLICK" button to test click tracking
6. Navigate to the Analytics page to view statistics

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solutions**:
- Verify PostgreSQL is running: `pg_isready` or check service status
- Check database credentials in `.env`
- Ensure PostgreSQL is listening on port 5432
- Check firewall settings

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solutions**:
- Change the `PORT` in backend `.env` file
- Stop the process using the port: `lsof -ti:5000 | xargs kill`

### Prisma Migration Issues

**Error**: `Migration failed`

**Solutions**:
- Reset database: `npx prisma migrate reset` (WARNING: This deletes all data)
- Check database connection string
- Ensure database exists and is accessible

### Frontend Can't Connect to Backend

**Error**: `Network Error` or `CORS Error`

**Solutions**:
- Verify backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env` matches frontend URL
- Verify CORS configuration in `backend/src/server.ts`

### Module Not Found Errors

**Error**: `Cannot find module`

**Solutions**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version: `node --version` (should be 18+)

## Development Workflow

### Backend Development

1. Make changes to TypeScript files in `src/`
2. Server automatically restarts with `npm run dev`
3. Check console for errors
4. Test endpoints with Postman or curl

### Frontend Development

1. Make changes to React components
2. Browser automatically refreshes with Vite HMR
3. Check browser console for errors
4. Use React DevTools for debugging

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description-of-change`
3. Prisma Client regenerates automatically
4. Update TypeScript types if needed

## Next Steps

- Read the [Architecture Documentation](./ARCHITECTURE.md) to understand the system design
- Review the [API Documentation](./API.md) for endpoint details
- Check [Deployment Guide](./DEPLOYMENT.md) for production setup
- See [Contributing Guide](./CONTRIBUTING.md) for development guidelines

