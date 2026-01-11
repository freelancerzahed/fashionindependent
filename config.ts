// Backend API URL - Points to Laravel API routes
// Local development: http://localhost/mirrormefashion/api/v2
// The frontend will append /campaign, /auth/login, etc. to this base URL
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/mirrormefashion/api/v2"

// Auth config - Using v2/auth routes
export const AUTH_CONFIG = {
  loginEndpoint: "/auth/login",
  signupEndpoint: "/auth/signup",
  creatorSignupEndpoint: "/creator/register",
  logoutEndpoint: "/auth/logout",
}

// Campaign config - Using /campaign (not /v2/campaign) to avoid duplicate /v2
// The final URL will be http://localhost/mirrormefashion/api/v2/campaign
export const CAMPAIGN_CONFIG = {
  createEndpoint: "/campaign",  // Changed from "/v2/campaign" to "/campaign" to avoid duplicate v2
  listEndpoint: "/campaign",
  getEndpoint: (id: string) => `/campaign/${id}`,
}

export const recaptcha = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfzDdErAAAAAOdwh_1bxq9fTckoR7tnabeh6wyu", // client-side fallback
  secretKey: process.env.RECAPTCHA_SECRET_KEY || "6LfzDdErAAAAADqqSlEqoOKnBAFpkg118lDfnGUw", // server-side fallback
}