# TinyLink Backend API Test Script
# Run this script to test all endpoints

Write-Host "`n=== TinyLink Backend API Tests ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
$health = Invoke-WebRequest -Uri http://localhost:3000/healthz | ConvertFrom-Json
Write-Host "✅ Health: $($health.ok), Database: $($health.database)" -ForegroundColor Green

# Test 2: Create Link (Auto-generated code)
Write-Host "`n2. Creating link with auto-generated code..." -ForegroundColor Yellow
$link1 = Invoke-WebRequest -Uri http://localhost:3000/api/links `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"originalUrl":"https://www.example.com"}' | ConvertFrom-Json
Write-Host "✅ Created: $($link1.shortUrl) -> $($link1.originalUrl)" -ForegroundColor Green

# Test 3: Create Link (Custom code)
Write-Host "`n3. Creating link with custom code..." -ForegroundColor Yellow
$link2 = Invoke-WebRequest -Uri http://localhost:3000/api/links `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"originalUrl":"https://www.google.com","customCode":"test123"}' | ConvertFrom-Json
Write-Host "✅ Created: $($link2.shortUrl) -> $($link2.originalUrl)" -ForegroundColor Green

# Test 4: Duplicate Code Error
Write-Host "`n4. Testing duplicate code error..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri http://localhost:3000/api/links `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"originalUrl":"https://www.bing.com","customCode":"test123"}' `
        -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "✅ Correctly returned 409 for duplicate code" -ForegroundColor Green
    }
}

# Test 5: Invalid URL Error
Write-Host "`n5. Testing invalid URL error..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri http://localhost:3000/api/links `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"originalUrl":"not-a-valid-url"}' `
        -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Correctly returned 400 for invalid URL" -ForegroundColor Green
    }
}

# Test 6: Get Link Stats
Write-Host "`n6. Getting link stats..." -ForegroundColor Yellow
$stats = Invoke-WebRequest -Uri "http://localhost:3000/api/links/$($link1.code)" | ConvertFrom-Json
Write-Host "✅ Stats: Code=$($stats.code), Clicks=$($stats.clickCount)" -ForegroundColor Green

# Test 7: Redirect
Write-Host "`n7. Testing redirect..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:3000/$($link1.code)" `
        -MaximumRedirection 0 `
        -ErrorAction SilentlyContinue
} catch {
    if ($_.Exception.Response.StatusCode -eq 302) {
        Write-Host "✅ Redirect working with 302 status" -ForegroundColor Green
    }
}

# Test 8: Verify Click Count Increment
Write-Host "`n8. Verifying click count increment..." -ForegroundColor Yellow
$statsAfter = Invoke-WebRequest -Uri "http://localhost:3000/api/links/$($link1.code)" | ConvertFrom-Json
if ($statsAfter.clickCount -gt $stats.clickCount) {
    Write-Host "✅ Click count incremented: $($stats.clickCount) -> $($statsAfter.clickCount)" -ForegroundColor Green
}

# Test 9: Get All Links
Write-Host "`n9. Getting all links..." -ForegroundColor Yellow
$allLinks = Invoke-WebRequest -Uri "http://localhost:3000/api/links?limit=10&sort=recent" | ConvertFrom-Json
Write-Host "✅ Found $($allLinks.total) total links, showing $($allLinks.links.Count)" -ForegroundColor Green

# Test 10: Delete Link
Write-Host "`n10. Deleting link..." -ForegroundColor Yellow
$deleteResult = Invoke-WebRequest -Uri "http://localhost:3000/api/links/$($link1.code)" `
    -Method DELETE | ConvertFrom-Json
Write-Host "✅ Deleted: $($deleteResult.code)" -ForegroundColor Green

# Test 11: Verify 404 After Delete
Write-Host "`n11. Verifying 404 after deletion..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:3000/$($link1.code)" -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ Correctly returned 404 for deleted link" -ForegroundColor Green
    }
}

Write-Host "`n=== All Tests Completed! ===" -ForegroundColor Cyan
