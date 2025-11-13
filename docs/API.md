# API Documentation

Complete API reference for the Click Counter Application backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt-token-string"
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password, or user already exists
- `400 Bad Request`: Password too short (less than 6 characters)

---

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt-token-string"
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password

---

#### Logout

```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Note:** Since JWT tokens are stateless, logout is primarily handled client-side by removing the token.

---

#### Get Current User

```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

---

### Click Tracking Endpoints

#### Record Click

```http
POST /api/clicks
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201 Created):**
```json
{
  "click": {
    "id": "uuid",
    "userId": "uuid",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to record click

---

#### Get User Click Count

```http
GET /api/clicks/count
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "count": 42
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to get count

---

#### Get User Clicks

```http
GET /api/clicks
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "clicks": [
    {
      "id": "uuid",
      "userId": "uuid",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to get clicks

---

### Analytics Endpoints

#### Get User Analytics

```http
GET /api/analytics/user
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "totalClicks": 150,
  "clicksToday": 5,
  "averagePerDay": 12.5,
  "clicks": [
    {
      "id": "uuid",
      "userId": "uuid",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to get analytics

---

#### Get Global Analytics

```http
GET /api/analytics/global
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "totalClicks": 1000,
  "topUsers": [
    {
      "user": {
        "id": "uuid",
        "email": "user@example.com"
      },
      "clickCount": 250
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to get global analytics

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

## Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Valid token but insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider implementing rate limiting on authentication endpoints to prevent brute force attacks.

## CORS

CORS is configured to allow requests from the frontend origin (default: `http://localhost:5173`). Adjust the `FRONTEND_URL` environment variable to change the allowed origin.

