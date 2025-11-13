# Click Counter Backend

Backend API for the click counter application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

3. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

See the main documentation in the `docs/` repository for complete API documentation.

