# Deployment Guide

Guide for deploying the Click Counter Application to production.

## Pre-Deployment Checklist

- [ ] Update environment variables for production
- [ ] Set secure JWT secret
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Review security settings

## Environment Variables

### Backend Production Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/clickcounter?schema=public&sslmode=require"
JWT_SECRET="<strong-random-secret-minimum-32-characters>"
PORT=5000
NODE_ENV=production
FRONTEND_URL="https://your-frontend-domain.com"
```

### Frontend Production Variables

```env
VITE_API_URL="https://your-api-domain.com"
```

## Deployment Options

### Option 1: Traditional VPS/Server

#### Backend Deployment

1. **Build the application**:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. **Set up process manager** (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name click-counter-api
   pm2 save
   pm2 startup
   ```

3. **Configure reverse proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Frontend Deployment

1. **Build the application**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Serve static files** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /path/to/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Option 2: Docker Deployment

#### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

#### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: clickcounter
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/clickcounter?schema=public
      JWT_SECRET: ${JWT_SECRET}
      PORT: 5000
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Option 3: Cloud Platform Deployment

#### Heroku

**Backend**:
```bash
cd backend
heroku create click-counter-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

**Frontend**:
```bash
cd frontend
heroku create click-counter-frontend
# Configure buildpack for static sites
git push heroku main
```

#### Vercel/Netlify (Frontend)

1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

#### Railway/Render (Backend)

1. Connect repository
2. Set start command: `npm start`
3. Configure environment variables
4. Add PostgreSQL database

## Database Migration in Production

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

**Important**: Always backup database before running migrations in production.

## SSL/TLS Configuration

### Using Let's Encrypt (Certbot)

```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}
```

## Security Hardening

### Backend Security

1. **Rate Limiting**: Implement rate limiting middleware
2. **Helmet.js**: Add security headers
3. **Input Validation**: Use validation libraries (zod, joi)
4. **HTTPS Only**: Enforce HTTPS in production
5. **CORS**: Restrict to production frontend URL only

### Database Security

1. **Connection Encryption**: Use SSL connections
2. **Strong Passwords**: Use complex database passwords
3. **Limited Access**: Restrict database access to backend only
4. **Regular Backups**: Automated backup strategy

### Frontend Security

1. **Environment Variables**: Don't expose secrets
2. **Content Security Policy**: Configure CSP headers
3. **HTTPS**: Serve over HTTPS only
4. **Token Storage**: Consider httpOnly cookies instead of localStorage

## Monitoring and Logging

### Application Monitoring

- Set up error tracking (Sentry, Rollbar)
- Monitor API response times
- Track database query performance
- Set up uptime monitoring

### Logging

- Use structured logging (Winston, Pino)
- Log all API requests
- Log authentication events
- Set up log aggregation (ELK, Datadog)

### Health Checks

Implement health check endpoints:

```typescript
app.get('/health', async (req, res) => {
  const dbStatus = await checkDatabase();
  res.json({
    status: dbStatus ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString()
  });
});
```

## Backup Strategy

### Database Backups

```bash
# Automated daily backup script
pg_dump -U postgres clickcounter > backup_$(date +%Y%m%d).sql
```

### Backup Storage

- Store backups in separate location
- Keep multiple backup versions
- Test restore procedures regularly

## Scaling Considerations

### Horizontal Scaling

- Use load balancer for multiple backend instances
- Stateless API design supports horizontal scaling
- Database connection pooling
- Consider read replicas for analytics queries

### Caching

- Redis for session management
- Cache analytics queries
- CDN for static assets

## Rollback Procedure

1. Keep previous deployment artifacts
2. Database migration rollback scripts
3. Quick revert process documented
4. Test rollback in staging environment

## Post-Deployment Verification

- [ ] Verify all endpoints are accessible
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Check error logging
- [ ] Monitor performance metrics
- [ ] Test on multiple browsers/devices

