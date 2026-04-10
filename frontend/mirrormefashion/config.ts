
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/mirrormefashion/api/v2"



export const recaptcha = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfzDdErAAAAAOdwh_1bxq9fTckoR7tnabeh6wyu", // client-side fallback
  secretKey: process.env.RECAPTCHA_SECRET_KEY || "6LfzDdErAAAAADqqSlEqoOKnBAFpkg118lDfnGUw", // server-side fallback
}
