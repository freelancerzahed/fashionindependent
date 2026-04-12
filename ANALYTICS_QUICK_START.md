# Analytics Quick Start Reference

**Get analytics working in 5 minutes.**

---

## ⚡ Quick Start (Copy & Paste Commands)

### 1. Start Backend (Terminal 1)
```bash
cd d:\laragon\www\mirrormefashion
php artisan migrate
php artisan serve
```

**Expected output:**
```
INFO  Server running on [http://127.0.0.1:8000]
```

### 2. Start Frontend (Terminal 2)
```bash
cd d:\laragon\www\mirrormefashion\frontend\fashionindependent
npm run dev
```

**Expected output:**
```
▲ Next.js 16.2.1
- Local:        http://localhost:3000
```

### 3. Test Backend Health
```bash
curl http://localhost:8000/api/v2/analytics/health
```

**Should return:**
```json
{"status":true,"message":"Analytics API is running",...}
```

### 4. Visit Dashboard
1. Open http://localhost:3000 in browser
2. Log in with creator account
3. Go to Dashboard → Analytics
4. See data load (or run diagnostics if error)

---

## 📋 Common Commands

### Check Backend is Running
```bash
curl http://localhost:8000/api/v2/analytics/health
```

### Get Auth Token (from browser)
1. Open DevTools (F12)
2. Go to Storage → Local Storage
3. Find `auth_token` value
4. Copy it (for API testing)

### Test Analytics Endpoint
```bash
curl -X GET http://localhost:8000/api/v2/analytics/creator \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### View Laravel Logs
```bash
cd d:\laragon\www\mirrormefashion
tail -f storage/logs/laravel.log
```

### View Next.js Logs
Look at Terminal 2 where you ran `npm run dev`

### Check Database Connection
```bash
php artisan tinker
> DB::connection()->getPdo();
> exit
```

### Run Migrations
```bash
cd d:\laragon\www\mirrormefashion
php artisan migrate
```

### Reset Database (Warning: Deletes data!)
```bash
php artisan migrate:refresh
```

---

## 🐛 When "Failed to load analytics" Error Appears

### Step 1: Check Console (F12)
- Look for blue log messages showing API URL
- Look for red error messages showing what failed

### Step 2: Run Diagnostics (On Error Page)
- Click "API Diagnostics" button
- Click "Run Tests"
- See which test fails

### Step 3: Troubleshoot Based on Failed Test

**Test 1 fails (API URL):**
```bash
# Check .env.local
cd frontend/fashionindependent
cat .env.local | grep NEXT_PUBLIC_API_URL
# Should show: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v2
```

**Test 2 fails (Health check):**
```bash
# Start backend
cd d:\laragon\www\mirrormefashion
php artisan serve
```

**Test 3 fails (Auth token):**
- Log out and log back in
- Token should appear in localStorage

**Test 4 fails (Analytics endpoint):**
```bash
# Check migrations ran
php artisan migrate:status

# Check user has campaigns
php artisan tinker
> Auth::loginUsingId(1)
> Auth::user()->campaigns()->count()
> exit
```

---

## 🔍 Debugging Checklist

- [ ] Backend running? `curl http://localhost:8000/api/v2/analytics/health`
- [ ] Frontend running? Can you see http://localhost:3000?
- [ ] Logged in? Shows "Dashboard" in sidebar?
- [ ] Migrations run? `php artisan migrate:status` shows all as "Ran"
- [ ] Have campaigns? Create one via Dashboard → Campaigns
- [ ] Check console? F12 → Console tab for logs and errors

---

## 📊 File Locations

| What | Where |
|------|-------|
| Frontend page | `frontend/fashionindependent/app/dashboard/analytics/page.tsx` |
| Diagnostics | `frontend/fashionindependent/components/analytics-diagnostics.tsx` |
| Backend controller | `app/Http/Controllers/Api/V2/AnalyticsController.php` |
| Database migration | `database/migrations/2024_04_12_create_analytics_tables.php` |
| API routes | `routes/api.php` |
| Setup guide | `ANALYTICS_SETUP.md` |
| Troubleshooting | `ANALYTICS_TROUBLESHOOTING.md` |
| Testing checklist | `ANALYTICS_TESTING_CHECKLIST.md` |

---

## API Endpoints

```
GET /api/v2/analytics/health
  No auth required ✓
  Test API connectivity
  Returns: {status, timestamp, authenticated, database}

GET /api/v2/analytics/creator
  Requires: Bearer token ✓
  Get creator's analytics
  Returns: {analytics: {...all metrics...}}

GET /api/v2/analytics/campaign/{id}
  Requires: Bearer token ✓
  Get specific campaign analytics
  Returns: {analytics: {...campaign metrics...}}
```

---

## Frontend URLs

```
http://localhost:3000                    → Home
http://localhost:3000/dashboard          → Dashboard (sidebar shows Analytics)
http://localhost:3000/dashboard/analytics → Analytics page
```

---

## Expected Data Structure

When analytics loads successfully, you should see (in console):
```javascript
{
  totalCampaigns: 5,
  totalEarnings: 1500.50,
  totalBackers: 23,
  conversionRate: 12.5,
  campaigns: {
    active: 2,
    sales: 15,
    closed: 0
  },
  sizingBreakdown: [{size: "S", quantity: 5}, ...],
  questionResponses: [{question: "...", responses: [{answer: "...", count: 3}]}],
  demographics: [{location: "USA", count: 10}, ...],
  customers: [{name: "John", spent: 150.50, purchases: 3}, ...],
  AOV: 65.22,
  feedback: [{comment: "Great!", rating: 5}, ...],
  earlyAdopters: 3,
  returns: {count: 1, rate: 0.04}
}
```

---

## Performance Targets

- ✅ Page load: < 3 seconds
- ✅ API response: < 1 second
- ✅ No console errors
- ✅ All 6 tabs load instantly when clicked

---

## Need Help?

1. **Read first:** `ANALYTICS_TROUBLESHOOTING.md` (7 common issues)
2. **Then test:** `ANALYTICS_TESTING_CHECKLIST.md` (12 validation phases)
3. **For tech details:** `ANALYTICS_SETUP.md` and `ANALYTICS_INTEGRATION.md`

---

**Status:** ✅ Ready to test and deploy!
