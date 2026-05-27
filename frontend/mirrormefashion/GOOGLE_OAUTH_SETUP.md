# Google Sign-In Setup Guide

## Summary of Changes

I've implemented Google OAuth support for the login page. The following changes have been made:

### 1. **Updated Login Page** (`app/(main)/login/page.tsx`)
   - Added import for `Chrome` icon from lucide-react
   - Added `handleGoogleSignIn()` function that initiates Google OAuth flow
   - Added "Sign in with Google" button with proper styling and click handler
   - Added divider between email/password login and Google OAuth

### 2. **Created Google OAuth Callback Handler** (`app/api/auth/google/callback/route.ts`)
   - Handles OAuth redirect from Google
   - Exchanges authorization code for access tokens
   - Fetches user information from Google
   - Sends authentication request to backend
   - Sets authentication cookies and redirects to profile

### 3. **Updated Environment Configuration** (`.env.local`)
   - Added `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - must be configured
   - Added `GOOGLE_CLIENT_SECRET` - must be configured

## Setup Instructions

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Environment Variables

Update `.env.local` with your Google credentials:

```bash
NEXT_PUBLIC_API_URL=http://localhost/mirrormefashion/api/v2
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
NEXTAUTH_URL=http://localhost:3000
```

### Step 3: Backend Implementation

Your backend API needs to implement the endpoint:

**POST** `/auth/google-login`

**Request Body:**
```json
{
  "google_id": "string (unique Google ID)",
  "email": "string (user email)",
  "name": "string (user full name)",
  "picture": "string (profile picture URL)",
  "id_token": "string (JWT ID token from Google)"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  },
  "token": "string (JWT authentication token)"
}
```

### Step 4: Restart the Frontend Server

```bash
cd frontend/mirrormefashion
npm run dev
```

## How It Works

1. **User clicks "Sign in with Google"** → Browser redirects to Google OAuth consent screen
2. **User grants permission** → Google redirects to `/api/auth/google/callback`
3. **Exchange authorization code** → Frontend exchanges code for access token
4. **Fetch user info** → Frontend gets user details from Google
5. **Backend authentication** → Frontend sends user data to backend for verification/creation
6. **Set authentication cookies** → Frontend stores token and user data
7. **Redirect to profile** → User is logged in and redirected to dashboard

## Files Modified

- `app/(main)/login/page.tsx` - Added Google OAuth button and handler
- `.env.local` - Added Google OAuth environment variables
- `app/api/auth/google/callback/route.ts` - Created new callback handler

## Testing

1. Navigate to `http://localhost:3000/login`
2. Click the "Sign in with Google" button
3. Complete the Google authentication flow
4. You should be redirected to your profile page if authentication succeeds

## Troubleshooting

- **"Google Client ID is not configured"** → Check `.env.local` and restart the server
- **"Failed to exchange authorization code"** → Verify Client ID and Secret are correct
- **Redirect URI mismatch** → Ensure the redirect URI in Google Console matches exactly
- **Backend returns 400/401** → Implement the backend endpoint and ensure it returns proper response format

## Security Notes

- The `GOOGLE_CLIENT_SECRET` should never be exposed to the frontend
- Use HTTPS in production
- Validate ID token on the backend
- Implement rate limiting on the backend authentication endpoint
- Consider storing the Google ID for future sign-ins
