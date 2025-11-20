# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Database
Your `.env` file is already configured with your Neon database:
```env
DATABASE_URL=postgresql://neondb_owner:npg_NnWGBQhsK39L@ep-aged-mountain-a7annh3i-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Run the Server
```bash
npm start
```

Server will start at: **http://localhost:3000**

## 🧪 Test the API

Run the test script:
```bash
.\test-api.ps1
```

Or test manually:

### Create a short link
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://www.google.com"}'
```

### Get all links
```bash
curl http://localhost:3000/api/links
```

### Redirect (in browser)
Open: `http://localhost:3000/{code}`

## 📚 API Documentation

See `README.md` for full API documentation.

## ✅ Verification Checklist

- [x] Dependencies installed
- [x] Database connected
- [x] Server running on port 3000
- [x] Health check returns OK
- [x] Can create links
- [x] Can redirect
- [x] Click tracking works
- [x] All tests pass

## 🎯 Ready for Frontend Integration!

Your backend is ready. Update your frontend to point to:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

Happy coding! 🎉
