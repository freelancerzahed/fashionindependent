import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check for OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description") || error;
      console.error("Google OAuth error:", errorDescription);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDescription)}`, req.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=No authorization code received", req.url)
      );
    }

    // Determine the redirect URI based on the request origin
    const origin = new URL(req.url).origin;
    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange error:", errorData);
      return NextResponse.redirect(
        new URL("/login?error=Failed to exchange authorization code", req.url)
      );
    }

    const { access_token, id_token } = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error("Failed to fetch user info");
      return NextResponse.redirect(new URL("/login?error=Failed to fetch user info", req.url));
    }

    const googleUser = await userInfoResponse.json();

    // Send to backend for authentication using the social-login endpoint
    const backendResponse = await fetch(`${BACKEND_URL}/auth/social-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        social_provider: "google",
        access_token: access_token,
        provider: googleUser.sub, // Google's user ID
        name: googleUser.name,
        email: googleUser.email,
        type: "customer", // For fashionindependent, backers are "customer" type
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error("Backend auth error:", errorData);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(errorData.message || "Authentication failed")}`,
          req.url
        )
      );
    }

    const authData = await backendResponse.json();

    // Map backend user type to frontend role
    const userData = authData.user ? {
      ...authData.user,
      role: authData.user.type === 'customer' ? 'backer' : (authData.user.type || 'backer')
    } : null;

    const isNewSocialUser = authData.is_new_user === true;
    const needsProfileCompletion = isNewSocialUser && (authData.profile_complete === false || !authData.user?.type || !String(authData.user.type).trim());

    // Debug logging
    console.log("[OAuth Callback] Backend response:", {
      hasAccessToken: !!authData.access_token,
      hasUser: !!authData.user,
      userType: authData.user?.type,
      userEmail: authData.user?.email,
      isNewSocialUser,
      profileComplete: authData.profile_complete,
      profileMissingFields: authData.profile_missing_fields,
      needsProfileCompletion,
    });
    console.log("[OAuth Callback] Mapped user:", userData);

    if (needsProfileCompletion) {
      const signupUrl = new URL("/signup", req.url);
      signupUrl.search = new URLSearchParams({
        role: "creator",
        google: "1",
        name: googleUser.name || "",
        email: googleUser.email || "",
        avatar: googleUser.picture || "",
        provider_id: googleUser.sub || "",
      }).toString();

      return NextResponse.redirect(signupUrl);
    }

    // Encode auth data in URL for more reliable transfer
    const authParams = new URLSearchParams({
      token: authData.access_token || "",
      user: JSON.stringify(userData || {}),
    });

    // Create response with redirect to auth initialization page
    const initUrl = new URL("/auth/init-client", req.url);
    initUrl.search = authParams.toString();
    const response = NextResponse.redirect(initUrl);

    // Also set cookies as fallback for better compatibility
    if (authData.access_token) {
      response.cookies.set("token", authData.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    if (userData) {
      response.cookies.set("user", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=An unexpected error occurred", req.url)
    );
  }
}
