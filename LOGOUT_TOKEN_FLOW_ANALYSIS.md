# Logout & Token Management Flow Analysis

## Executive Summary
**CRITICAL ISSUE FOUND**: The `fashionindependent` frontend's logout flow does **NOT** call the backend to revoke tokens. This creates a security vulnerability where logged-out tokens remain valid on the backend.

---

## 1. Frontend: fashionindependent Logout Flow ❌ VULNERABLE

### Location: [lib/auth-context.tsx](lib/auth-context.tsx#L176-L181)

```typescript
const logout = () => {
  setUser(null)
  setToken(null)
  localStorage.removeItem("user")
  localStorage.removeItem("auth_token")
}
```

### Issues:
- ✅ Clears React state (`user`, `token`)
- ✅ Clears localStorage (`user`, `auth_token`)
- ❌ **NO backend API call** - token is NOT revoked on server
- ❌ Token remains valid indefinitely in `personal_access_tokens` table
- ❌ No session/cookie cleanup

### Token Remains Valid After Logout
Once logged out, the old token can still be used to make authenticated API calls because:
1. Frontend just removes it from localStorage
2. Backend doesn't know the token has been "revoked"
3. Sanctum tokens have no expiry by default

---

## 2. Next.js API Proxy: app/api/auth/logout/route.ts

### Location: [frontend/mirrormefashion/app/api/auth/logout/route.ts](frontend/mirrormefashion/app/api/auth/logout/route.ts)

```typescript
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      const text = await res.text();
      console.warn("Backend logout returned non-JSON:", text);
      return NextResponse.json({ message: "Logout completed (non-JSON response)" });
    }
  } catch (err) {
    console.error("Logout proxy error:", err);
    return NextResponse.json({ error: "Failed to call backend logout" }, { status: 500 });
  }
}
```

### Analysis:
- ✅ **mirrormefashion** has a proper API proxy for logout
- ✅ Calls backend GET `/auth/logout`
- ✅ Handles JSON and non-JSON responses
- ⚠️ Only used by **mirrormefashion**, NOT by **fashionindependent**

---

## 3. Backend: Laravel AuthController logout() Method

### Location: [app/Http/Controllers/Api/V2/AuthController.php](app/Http/Controllers/Api/V2/AuthController.php#L471-L479)

```php
public function logout(Request $request)
{
    $user = request()->user();
    if ($user && $user->currentAccessToken()) {
        $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
    }

    return response()->json([
        'result' => true,
        'message' => translate('Successfully logged out')
    ]);
}
```

### Analysis:
- ✅ **Correctly revokes the token** by deleting from `personal_access_tokens` table
- ✅ Gets current user from authenticated request
- ✅ Deletes only the current token, not all tokens (supports multiple device login)
- ✅ Returns success response

### Route: [routes/api.php](routes/api.php#L79)

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('logout', 'logout');  // Requires authentication
    });
});
```

---

## 4. Token Storage in localStorage After Registration/Login

### Login Process: [lib/auth-context.tsx](lib/auth-context.tsx#L41-L97)

```typescript
// Login response from backend
const authToken = data.token || data.access_token || data.data?.token || ""
setToken(authToken)
localStorage.setItem("user", JSON.stringify(mockUser))
localStorage.setItem("auth_token", authToken)
```

### Signup Process: [lib/auth-context.tsx](lib/auth-context.tsx#L99-L159)

```typescript
// Same token handling as login
const authToken = data.token || data.access_token || data.data?.token || ""
setToken(authToken)
localStorage.setItem("user", JSON.stringify(newUser))
localStorage.setItem("auth_token", authToken)
```

### Backend Response Format (Login/Signup):

```php
// From AuthController::login() & signup()
return response()->json([
    'result'  => true,
    'message' => 'Login/Registration successful!',
    'user'    => $user,
    'token'   => $token  // Sanctum plainTextToken
]);
```

### Analysis:
- ✅ Token is stored consistently in both login and signup
- ✅ Multiple fallback paths for token (`token`, `access_token`, `data.token`)
- ✅ User object stored as JSON in localStorage
- ✅ Same key format (`auth_token`) used everywhere
- ✅ **Token format is identical** - Sanctum generated plainTextToken

---

## 5. Token Format & Structure

### Sanctum Token Generation

```php
// From AuthController (line 149, 271)
$token = $user->createToken('auth_token')->plainTextToken;
```

### Token Format:
- **Structure**: `|` separated string: `{tokenId}|{hashed_token}`
- **Example**: `1|abcdefghijklmnopqrstuvwxyz...`
- **Uniqueness**: Generated via `Str::random(40)` hashed with SHA256
- **Storage**: Hashed in `personal_access_tokens.token` column
- **Validation**: Sanctum middleware (`auth:sanctum`) validates against hashed version

### Token Usage in Frontend:
```typescript
// Sent in Authorization header
headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
}
```

---

## 6. Token Refresh & Validation Issues

### Current State:
- ❌ **NO token refresh mechanism** implemented
- ❌ **NO token expiry** set (Sanctum tokens are permanent by default)
- ❌ **NO token validation** before API calls in fashionindependent
- ✅ Backend validates token via `auth:sanctum` middleware

### Potential Issues:

#### Issue 1: Post-Logout Login Doesn't Clear Old Token Memory
```typescript
// Current logout in fashionindependent
logout: () => {
  setUser(null)
  setToken(null)
  localStorage.removeItem("user")
  localStorage.removeItem("auth_token")  // ✅ Clears from storage
  // But backend STILL has the token in personal_access_tokens table
}

// After logout, backend can still use old token
```

#### Issue 2: No Token Expiration
- Logged-out tokens remain valid forever on backend
- If localStorage is compromised, attacker can use old token indefinitely
- No way to know if token was revoked without backend call

#### Issue 3: Multiple Tokens Not Cleaned Up
```typescript
// Logout only deletes current token
$user->tokens()->where('id', $user->currentAccessToken()->id)->delete();

// Other tokens (from other devices) remain valid
// User could have 10 old tokens from previous logins
```

---

## 7. Complete Logout Flow Comparison

### ❌ fashionindependent (BROKEN):

```
User clicks "Logout"
    ↓
handleLogout() in profile-dropdown.tsx
    ↓
logout() from useAuth()
    ↓
React state cleared
localStorage.removeItem("auth_token")
localStorage.removeItem("user")
    ↓
✅ Frontend: Token unavailable
❌ Backend: Token STILL VALID in personal_access_tokens table
❌ NO API call made
```

### ✅ mirrormefashion (CORRECT):

```
User clicks "LogoutButton"
    ↓
handleLogout() in logout-button.tsx
    ↓
fetch("/api/auth/logout", { method: "GET" })
    ↓
Next.js API route proxy
    ↓
Backend: DELETE from personal_access_tokens WHERE id = current_token
    ↓
Backend response: { result: true, message: "Successfully logged out" }
    ↓
Clear localStorage (user, token)
Clear sessionStorage (user, token)
Clear cookies
    ↓
✅ Frontend: Token unavailable
✅ Backend: Token DELETED
```

---

## 8. Token Management Issues Summary

| Issue | Status | Impact |
|-------|--------|--------|
| **fashionindependent doesn't revoke tokens** | 🔴 CRITICAL | Old tokens remain valid forever |
| **No token expiration** | 🔴 CRITICAL | Compromised tokens never expire |
| **Multiple devices not cleaned** | 🟡 HIGH | Old device tokens accumulate |
| **No token refresh mechanism** | 🟡 MEDIUM | Can't rotate tokens without relogin |
| **Post-logout login stores new token** | ✅ OK | New token created properly |
| **Token format consistent** | ✅ OK | Registration and login tokens identical |

---

## 9. Recommendations

### Immediate Fixes (CRITICAL):

1. **Update fashionindependent logout to call backend:**
```typescript
const logout = async () => {
  try {
    // Call backend to revoke token
    await fetch("/api/auth/logout", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    console.error("Backend logout failed:", error)
    // Clear local data anyway
  } finally {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")
  }
}
```

2. **Add API endpoint to fashionindependent** (if not using next.js proxy):
   - Create proper API route or use Next.js proxy like mirrormefashion

3. **Clear all tokens on logout** (optional but recommended):
```php
public function logout(Request $request)
{
    $user = request()->user();
    // Delete ALL tokens for this user
    $user->tokens()->delete();  // vs. current implementation
    
    return response()->json([
        'result' => true,
        'message' => translate('Successfully logged out')
    ]);
}
```

### Medium-term Improvements:

4. **Add token expiration** (e.g., 7 days):
```php
$token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;
```

5. **Implement token refresh endpoint:**
   - Issue new token before old one expires
   - Revoke old token immediately

6. **Add logout all devices option:**
```php
public function logoutAllDevices(Request $request)
{
    $user = request()->user();
    $user->tokens()->delete();  // Delete all tokens
    return response()->json(['message' => 'All tokens revoked']);
}
```

---

## 10. Files Involved

### Frontend Files (fashionindependent):
- [lib/auth-context.tsx](lib/auth-context.tsx) - Logout logic (VULNERABLE)
- [components/profile-dropdown.tsx](components/profile-dropdown.tsx) - UI trigger
- [components/mobile-nav.tsx](components/mobile-nav.tsx) - Mobile UI trigger
- [config.ts](config.ts) - API endpoints configuration

### Frontend Files (mirrormefashion):
- [frontend/mirrormefashion/contexts/UserContext.tsx](frontend/mirrormefashion/contexts/UserContext.tsx) - Proper logout (CORRECT)
- [frontend/mirrormefashion/components/logout-button.tsx](frontend/mirrormefashion/components/logout-button.tsx)
- [frontend/mirrormefashion/app/api/auth/logout/route.ts](frontend/mirrormefashion/app/api/auth/logout/route.ts) - API proxy

### Backend Files:
- [app/Http/Controllers/Api/V2/AuthController.php](app/Http/Controllers/Api/V2/AuthController.php#L471-L479) - logout() method
- [routes/api.php](routes/api.php#L79) - API route definition

---

## 11. Testing Recommendations

### Test 1: Token Revocation
```bash
# Login
curl -X POST http://localhost/mirrormefashion/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get token from response
TOKEN="<token_from_response>"

# Logout
curl -X GET http://localhost/mirrormefashion/api/v2/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# Try to use old token (should fail)
curl -X GET http://localhost/mirrormefashion/api/v2/user \
  -H "Authorization: Bearer $TOKEN"
# Should return 401 Unauthorized
```

### Test 2: Frontend Logout Flow
1. Login on fashionindependent
2. Check `localStorage.getItem('auth_token')`
3. Click logout
4. Verify token removed from localStorage
5. **ISSUE FOUND**: Old token still works with backend
6. Manually verify token is deleted from `personal_access_tokens` table

---

## Conclusion

The `fashionindependent` frontend has a **critical security vulnerability** in its logout implementation. While `mirrormefashion` correctly revokes tokens on logout, `fashionindependent` only clears them from the client side, leaving them valid on the backend indefinitely.

**Severity: CRITICAL** 🔴 - Requires immediate fix
