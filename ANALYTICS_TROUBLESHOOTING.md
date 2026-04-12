# Analytics Error Troubleshooting Guide

## Error: "Failed to load analytics"

This guide helps you diagnose and fix the "Failed to load analytics" error on the Analytics Dashboard.

## Quick Diagnosis

### Step 1: Open Browser Developer Tools
Press **F12** to open DevTools, then go to **Console** tab

### Step 2: Look for Detailed Error Messages
You should see console logs like:
```
✓ Analytics data loaded successfully: { totalCampaigns: 5, uniqueCustomers: 10 }
```
or
```
❌ Analytics error: {detailed error message}
Error details: {...}
```

### Step 3: Use the Diagnostic Tool
On the error page, click "API Diagnostics" panel and run the diagnostics to auto-test everything.

---

## Common Issues & Solutions

### Issue 1: "API URL not configured"

**Cause:** The `NEXT_PUBLIC_API_URL` environment variable is not set.

**Solution:**
```bash
# Frontend folder
cd frontend/fashionindependent

# Check .env file (or .env.local)
cat .env

# Should contain:
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v2
```

**If not set, add it:**
```bash
# Edit .env or .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v2" >> .env.local

# Restart Next.js dev server
npm run dev
```

---

### Issue 2: "Authentication required" (401 error)

**Cause:** Your authentication token is missing or expired.

**Solution:**
1. Make sure you're logged in to the dashboard
2. Check if your token is stored:
   - Open DevTools → Storage → Local Storage
   - Look for `auth_token` key
   - If missing, log out and log back in

---

### Issue 3: Backend server not running

**Cause:** The Laravel API server is not running on the configured URL.

**Solution:**
```bash
# Terminal 1: Start Laravel backend
cd d:\laragon\www\mirrormefashion
php artisan serve

# Should output:
# INFO  Server running on [http://127.0.0.1:8000]
```

**Check if it's running:**
```bash
# Test in another terminal
curl http://localhost:8000/api/v2/analytics/health

# Should return:
# {"status":true,"message":"Analytics API is running",...}
```

---

### Issue 4: CORS Error (Network tab shows CORS error)

**Cause:** Frontend and backend have CORS issues.

**Solution:**

The CORS is already configured in `routes/api.php`. Check if it's working:

```bash
# Test CORS with curl
curl -X OPTIONS http://localhost:8000/api/v2/analytics/creator \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Should see `Access-Control-Allow-Origin` in response headers.

If CORS still fails, check `routes/api.php` has proper CORS config.

---

### Issue 5: Database tables don't exist

**Cause:** Migrations weren't run on the backend.

**Solution:**
```bash
cd d:\laragon\www\mirrormefashion

# Check migration status
php artisan migrate:status

# Run pending migrations
php artisan migrate

# Verify tables created
php artisan tinker
> DB::table('campaigns')->count()
> exit
```

---

### Issue 6: User is not a creator

**Cause:** The logged-in user doesn't have a creator account.

**Solution:**
1. Log in with a creator account
2. Or verify creator profile exists:

```bash
php artisan tinker
> Auth::loginUsingId(1) // Login as user ID 1
> exit

# Then refresh the page
```

---

### Issue 7: No campaigns exist for user

**Cause:** Very common - you have a creator account but no campaigns yet.

**Solution:**
1. This is normal - analytics will show all zeros
2. Create a campaign to populate data:
   - Go to Dashboard → Campaigns
   - Click "Create Campaign"
   - Fill in details and publish

Analytics will then show your campaign data.

---

## Advanced Debugging

### Enable Query Logging

Check what database queries are running:

```bash
# Terminal in project
php artisan tinker

# Enable query logging
> \DB::enableQueryLog();

# Make your analytics request
curl -X GET http://localhost:8000/api/v2/analytics/creator \
  -H "Authorization: Bearer YOUR_TOKEN"

# View queries
echo(\DB::getQueryLog());
exit
```

### Check Laravel Logs

```bash
# View recent errors
tail -f storage/logs/laravel.log

# Or from tinker
php artisan tinker
> Storage::disk('local')->get('logs/laravel.log')
```

---

### Test API Endpoint Directly

```bash
# Get your auth token from localStorage
# Then use it here:

TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."

curl -X GET http://localhost:8000/api/v2/analytics/creator \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -v
```

Expected response:
```json
{
  "status": true,
  "analytics": {
    "totalCampaigns": 5,
    "totalEarnings": 1500.00,
    "totalBackers": 23,
    ...
  }
}
```

---

## URL Checklist

### Frontend URLs (should work)
- ✅ `http://localhost:3000/dashboard/analytics`
- ✅ `http://localhost:3000/dashboard` (sidebar shows "Analytics" not "Backers")

### Backend URLs (test these)
- ✅ `http://localhost:8000/api/v2/analytics/health` (no auth needed)
- ✅ `http://localhost:8000/api/v2/analytics/creator` (requires Bearer token)
- ✅ `http://localhost:8000/api/v2/analytics/campaign/1` (requires Bearer token)

---

## Quick Test Script

```bash
#!/bin/bash

echo "=== Analytics Troubleshooting ==="

# 1. Check backend running
echo "1. Testing backend API..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8000/api/v2/analytics/health

# 2. Check NextJS running  
echo "2. Testing frontend..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/dashboard/analytics

# 3. Get token (you need to manually paste this)
echo "3. Test analytics with token (update TOKEN variable)"
TOKEN="${1:-YOUR_TOKEN_HERE}"
curl -s http://localhost:8000/api/v2/analytics/creator \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "=== Done ==="
```

---

## Still Having Issues?

### Collect Debug Info

When reporting an issue, provide:
1. **Console output** (F12 → Console tab)
2. **Network response** (F12 → Network tab → click `/analytics/creator` request)
3. **Laravel logs** (backend `storage/logs/laravel.log`)
4. **Environment variables**:
   ```bash
   echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
   ```

### Key Files to Check
- Frontend: `frontend/fashionindependent/app/dashboard/analytics/page.tsx`
- Backend: `app/Http/Controllers/Api/V2/AnalyticsController.php`
- Routes: `routes/api.php`
- Database: Migration file `database/migrations/2024_04_12_create_analytics_tables.php`

---

## Performance Issues

If analytics load slowly:

1. **Check database indexes:**
   ```bash
   php artisan tinker
   > Schema::getIndexes('campaigns')
   ```

2. **Run migrations again:**
   ```bash
   php artisan migrate:refresh
   ```

3. **Check query performance:**
   ```bash
   php artisan tinker
   > \DB::enableQueryLog()
   > Campaign::with('pledges.backer')->get()
   > \DB::getQueryLog()
   ```

---

## Need Help?

1. Check the **API Diagnostics** tool on the error page
2. Review **Console** logs in DevTools
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify backend is running: `php artisan serve`
5. Verify frontend environment: `echo $NEXT_PUBLIC_API_URL`

All these points should help identify the issue!
