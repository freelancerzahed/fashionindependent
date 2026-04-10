# 🔍 API Error Debugging Guide

## The Problem

You're getting "Failed to fetch documents" error, which means:
- The API call is being made
- But the response status is NOT 200-299 (not `response.ok`)

## How to Find the Actual Error

### Step 1: Open DevTools & Check Logs

1. Press **F12** to open DevTools
2. Go to the **Console** tab
3. Look for messages starting with `[Documents]`
4. **Write down EXACTLY what you see**

You should see something like:
```
[Documents] Fetching with token: eyJhbGc...
[Documents] Response status: XXX    ← THIS NUMBER IS KEY!
[Documents] Error response: { message: "..." }
```

### Step 2: What Does Status Code Mean?

| Status | Meaning | Solution |
|--------|---------|----------|
| **401** | Unauthorized | Token is invalid or expired → **Login again** |
| **403** | Forbidden | User doesn't have permission → **Check creator exists** |
| **404** | Not Found | API endpoint doesn't exist → **Check routes registered** |
| **500** | Server Error | Backend error → **Check Laravel logs** |
| **0** | Network Error | Backend not running → **Start backend** |

### Step 3: Check Network Tab

1. Go to **Network** tab in DevTools
2. Try uploading or accessing documents
3. Look for the request to `/api/v2/creator/documents`
4. Click on it and check:
   - **Status code** (top right)
   - **Headers** tab → Authorization header present?
   - **Response** tab → What's the error message?

## Quick Diagnosis Checklist

### Is Backend Running?
```bash
# You should see output like:
# Laravel development server started: http://127.0.0.1:8000
# Press Ctrl+C to quit.

# If not running, start it:
php artisan serve
```

### Is Token Available?
In Console, run:
```javascript
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('user'));
```

Both should have values. If empty → **Not logged in, login again**

### Test API Directly
In Console, run:
```javascript
const token = localStorage.getItem('auth_token');
console.log('Testing with token:', token ? 'YES' : 'NO');

fetch('/api/v2/creator/documents', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Response Status:', r.status, r.statusText);
  return r.json();
})
.then(data => console.log('Response Data:', data))
.catch(err => console.error('Fetch Error:', err));
```

Watch the console and note:
- **Response Status** number
- **Response Data** content
- Any error messages

### Check Creator Exists

In Console, run:
```javascript
// Check if you're actually a creator
const user = JSON.parse(localStorage.getItem('user'));
console.log('User Role:', user?.role);  // Should be 'creator'
console.log('User ID:', user?.id);
```

If role is not 'creator' → You're logged in as 'backer', need creator account

### Check Laravel Logs

In separate terminal:
```bash
# Watch logs in real-time
tail -f storage/logs/laravel.log

# Then try the API call in browser console
# Watch for error messages in logs
```

## Common Scenarios & Solutions

### Scenario 1: Status 401 (Unauthorized)
```
[Documents] Response status: 401
[Documents] Error response: { message: "Unauthenticated" }
```

**Solutions:**
- [ ] Logout: `localStorage.clear()` then refresh
- [ ] Login again with creator account
- [ ] Check token: `localStorage.getItem('auth_token')`
- [ ] Restart backend: `php artisan serve`

### Scenario 2: Status 404 (Not Found)
```
[Documents] Response status: 404
```

**Solutions:**
- [ ] Check routes: `php artisan route:list | grep documents`
- [ ] Clear route cache: `php artisan route:clear`
- [ ] Restart backend: `php artisan serve`

### Scenario 3: Status 500 (Server Error)
```
[Documents] Response status: 500
```

**Solutions:**
- [ ] Check Laravel logs: `tail -f storage/logs/laravel.log`
- [ ] Check database: `php artisan tinker` → `CreatorDocument::count()`
- [ ] Check model exists: `ls app/Models/CreatorDocument.php`
- [ ] Check controller: `ls app/Http/Controllers/Api/V2/DocumentController.php`

### Scenario 4: Status 0 (Network Error)
```
Network error / Cannot reach server
```

**Solutions:**
- [ ] Is backend running? `php artisan serve`
- [ ] Is it on http://localhost:8000?
- [ ] Check firewall isn't blocking
- [ ] Try: `curl http://localhost:8000`

### Scenario 5: No Token (undefined/null)
```javascript
Token: null
```

**Solutions:**
- [ ] Not logged in
- [ ] Login: Go to http://localhost:3000 → Login page
- [ ] Use creator account
- [ ] Check localStorage after login: `localStorage.getItem('auth_token')`

## Step-by-Step Debugging

### If You're Still Getting Error:

1. **Open DevTools** (F12)

2. **Check logs for exact error:**
   ```
   Look for: [Documents] Response status: ___
   Tell me the status code
   ```

3. **Run test in Console:**
   ```javascript
   const token = localStorage.getItem('auth_token');
   fetch('/api/v2/creator/documents', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   .then(r => r.json())
   .then(d => { console.log('Success:', d); })
   .catch(e => { console.error('Error:', e); });
   ```

4. **Check Network tab:**
   - Look for the request
   - Note the status code
   - Check the response body

5. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   # Try the request again
   # What error appears?
   ```

6. **Verify creator exists:**
   ```bash
   cd d:\laragon\www\mirrormefashion
   # Login to MySQL and check:
   # SELECT * FROM creators WHERE user_id = YOUR_USER_ID;
   ```

## What to Tell Me

When asking for help, provide:

1. **Exact error from Console:**
   ```
   [Documents] Response status: ___
   [Documents] Error response: { ... }
   ```

2. **Network tab status code:**
   ```
   Status: ___
   Response: { ... }
   ```

3. **Laravel log error:**
   ```
   Copy exact error message from logs
   ```

4. **User info:**
   ```javascript
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('Role:', user?.role);
   ```

5. **Backend running:**
   ```
   Is "php artisan serve" running? YES/NO
   ```

## Testing Template

Copy this and run in Console:
```javascript
console.log('=== DEBUGGING DOCUMENTS API ===');
console.log('Token exists:', !!localStorage.getItem('auth_token'));
console.log('User stored:', !!localStorage.getItem('user'));

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('auth_token');

console.log('User role:', user?.role);
console.log('Token preview:', token ? token.substring(0, 30) + '...' : 'NONE');

console.log('\nTesting API...');
fetch('/api/v2/creator/documents', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(async r => {
  console.log('Status:', r.status);
  const data = await r.json();
  console.log('Response:', data);
  return data;
})
.catch(e => console.error('Fetch error:', e));
```

Run this and share:
1. **What you see in console**
2. **Status code** (if shown)
3. **Response** (if shown)

This will help identify the exact issue! 🔍
