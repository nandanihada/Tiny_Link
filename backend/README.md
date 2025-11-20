# TinyLink Backend API

A URL shortener backend built with Node.js, Express, and PostgreSQL.

## Features

- ✅ Create short links with custom or auto-generated codes
- ✅ Track click statistics
- ✅ Redirect to original URLs
- ✅ RESTful API with proper error handling
- ✅ PostgreSQL database with Neon
- ✅ CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Schema

Run this SQL in your Neon PostgreSQL console:

```sql
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_code ON links(code);
CREATE INDEX idx_created_at ON links(created_at DESC);
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /healthz
```

### Create Link
```
POST /api/links
Body: { "originalUrl": "https://example.com", "customCode": "optional" }
```

### Get All Links
```
GET /api/links?limit=50&offset=0&sort=recent
```

### Get Link Stats
```
GET /api/links/:code
```

### Delete Link
```
DELETE /api/links/:code
```

### Redirect
```
GET /:code
```

## Response Format

All responses use camelCase field names:
- `originalUrl`
- `clickCount`
- `lastClickedAt`
- `createdAt`
- `shortUrl`

## Error Codes

- `INVALID_URL` - Invalid URL format
- `INVALID_CODE` - Invalid code format
- `CODE_EXISTS` - Code already exists
- `NOT_FOUND` - Link not found

## Deployment

### Render

1. Push to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

Build Command: `npm install`
Start Command: `npm start`
