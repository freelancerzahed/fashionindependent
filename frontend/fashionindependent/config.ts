// Backend API URL - Points to Laravel API routes
// Local development: http://localhost/mirrormefashion/api/v2

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/mirrormefashion/api/v2";

// Auth config - Using v2/auth routes
export const AUTH_CONFIG = {
  loginEndpoint: "/auth/login",
  signupEndpoint: "/auth/signup",
  creatorSignupEndpoint: "/register",
  logoutEndpoint: "/auth/logout",
}

const envSiteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://thefashionindependent.com"

export const SITE_URL = envSiteUrl.replace(/\/$/, "")

export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
}

// Campaign config - Using /campaign (not /v2/campaign) to avoid duplicate /v2
// The final URL will be http://localhost/mirrormefashion/api/v2/campaign
export const CAMPAIGN_CONFIG = {
  createEndpoint: "/campaign",  // Changed from "/v2/campaign" to "/campaign" to avoid duplicate v2
  listEndpoint: "/campaign",
  getEndpoint: (id: string) => `/campaign/${id}`,
}

export const recaptcha = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Lf6bmgtAAAAAF2N-a99mzorPNES_w07VaflmOM9", // client-side fallback
  secretKey: process.env.RECAPTCHA_SECRET_KEY || "6Lf6bmgtAAAAAM0KAPHQn3xVaJkJckuUFrUTapkh", // server-side fallback
}

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_KEY || "pk_live_51IsUGRHkO4Hrmh8p74IjzWbm5Po8ZKAPoSbn6W7Vc4SZ3XtUnmKs6tgVFzRPdnArLZh33P0mm0YnyCFOISAnVtnk0097bnXe2y",
}