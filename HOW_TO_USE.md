# 🔗 How to Use TinyLink - Quick Guide

## ✅ **IMPORTANT: Two Different URLs**

### **1. Frontend Dashboard** (for managing links)
```
http://localhost:8081
```
Use this to:
- Create new short links
- View all your links
- See statistics
- Delete links

### **2. Backend Short Links** (for sharing)
```
http://localhost:3000/abc123
```
Use this to:
- Share with others
- Redirect to original URL
- Track clicks automatically

---

## 🎯 **How It Works**

### **Step 1: Create a Short Link**

1. Open **http://localhost:8081** (Frontend Dashboard)
2. Paste your long URL: `https://www.example.com/very/long/url`
3. Click "Shorten Link"
4. You get a short link: **`http://localhost:3000/abc123`**

### **Step 2: Share the Short Link**

**✅ CORRECT - Share this:**
```
http://localhost:3000/abc123
```

**❌ WRONG - Don't share this:**
```
http://localhost:8081/abc123  ← This goes to stats page
```

### **Step 3: What Happens When Someone Clicks**

When someone opens `http://localhost:3000/abc123`:
1. ✅ Backend receives the request
2. ✅ Looks up the code in database
3. ✅ Increments click count
4. ✅ **Redirects to original URL** (e.g., https://www.example.com)
5. ✅ User sees the original website

### **Step 4: View Statistics**

1. Go to **http://localhost:8081** (Dashboard)
2. Click "View Stats" button on any link
3. See detailed analytics

---

## 📋 **URL Structure**

| URL | Purpose | What It Does |
|-----|---------|--------------|
| `http://localhost:8081` | Dashboard | Manage your links |
| `http://localhost:8081/stats/abc123` | Stats Page | View link statistics |
| `http://localhost:3000/abc123` | **Short Link** | **Redirects to original URL** ✅ |
| `http://localhost:3000/healthz` | Health Check | Check server status |
| `http://localhost:3000/api/links` | API | Backend API endpoint |

---

## 🧪 **Test It Now**

### **Test 1: Create and Use Short Link**

1. **Open Dashboard**: http://localhost:8081
2. **Create Link**:
   - Paste: `https://www.google.com`
   - Click "Shorten Link"
   - Copy the short URL (e.g., `http://localhost:3000/xyz123`)

3. **Test Redirect**:
   - Open **NEW TAB**
   - Paste: `http://localhost:3000/xyz123`
   - Press Enter
   - ✅ Should redirect to Google!

4. **Check Stats**:
   - Go back to Dashboard
   - Refresh page
   - Click count should be **1** ✅

### **Test 2: View Statistics**

1. On Dashboard, click "View Stats" button
2. You'll see:
   - Total clicks
   - Last clicked time
   - Created date
   - Analytics chart

---

## ❌ **Common Mistakes**

### **Mistake 1: Using Frontend URL for Redirect**
```
❌ http://localhost:8081/abc123  ← Shows stats page, doesn't redirect
✅ http://localhost:3000/abc123  ← Redirects to original URL
```

### **Mistake 2: Forgetting Port Numbers**
```
❌ http://localhost/abc123       ← Won't work
✅ http://localhost:3000/abc123  ← Correct backend URL
```

### **Mistake 3: Using Wrong URL to Share**
```
When creating a link, the app shows:
"http://localhost:3000/abc123"

✅ Share this exact URL
❌ Don't modify it
```

---

## 🎉 **Summary**

**For Managing Links:**
- Use: `http://localhost:8081`

**For Sharing Links:**
- Use: `http://localhost:3000/YOUR_CODE`

**The short link will:**
- ✅ Redirect to original URL
- ✅ Track clicks automatically
- ✅ Work from anywhere

---

## 🚀 **Quick Copy-Paste Test**

```bash
# 1. Open dashboard
http://localhost:8081

# 2. Create a link with URL:
https://www.google.com

# 3. You'll get something like:
http://localhost:3000/abc123

# 4. Open that link in new tab
# → Should redirect to Google ✅
```

**Now try it yourself!** 🎯
