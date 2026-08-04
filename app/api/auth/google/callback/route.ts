import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL, GOOGLE_OAUTH_CONFIG, SITE_URL } from "@/config";

function getSafeAppOrigin(req: NextRequest) {
  const configuredOrigin = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || SITE_URL || "")
    .trim()
    .replace(/\/$/, "")

  if (configuredOrigin) {
    try {
      const parsedOrigin = new URL(configuredOrigin)
      if (parsedOrigin.protocol && parsedOrigin.host) {
        return parsedOrigin.origin
      }
    } catch {
      return configuredOrigin
    }
  }

  const requestUrl = new URL(req.url);
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = req.headers.get("host")?.trim();
  const requestHost = forwardedHost || host || requestUrl.host;
  const hostValue = requestHost.replace(/^https?:\/\//, "").split("/")[0];
  const hostname = hostValue.split(":")[0];
  const port = hostValue.includes(":") ? `:${hostValue.split(":").at(-1)}` : requestUrl.port ? `:${requestUrl.port}` : "";
  const protocol = forwardedProto || requestUrl.protocol.replace(/:$/, "");

  const isLocalHost = !hostname || hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]" || hostname === "127.0.0.1" || hostname === "localhost";

  if (isLocalHost) {
    return `${protocol}://localhost${port}`;
  }

  return `${protocol}://${hostname}${port}`;
}

export async function GET(req: NextRequest) {
  try {
    const origin = getSafeAppOrigin(req);
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check for OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description") || error;
      console.error("Google OAuth error:", errorDescription);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDescription)}`, origin)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=No authorization code received", origin)
      );
    }

    const redirectUri = `${origin.replace(/\/$/, "")}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      let errorData: Record<string, unknown> = {};

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }

      console.error("Token exchange error:", {
        status: tokenResponse.status,
        redirectUri,
        error: errorData,
      });
      const googleErrorMessage = typeof errorData === "object" && errorData !== null && "error_description" in errorData
        ? String((errorData as Record<string, unknown>).error_description)
        : typeof errorData === "object" && errorData !== null && "error" in errorData
          ? String((errorData as Record<string, unknown>).error)
          : "Failed to exchange authorization code";
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(googleErrorMessage)}`, origin)
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
      return NextResponse.redirect(new URL("/login?error=Failed to fetch user info", origin));
    }

    const googleUser = await userInfoResponse.json();

    const socialPayload = {
      social_provider: "google",
      access_token,
      provider: googleUser.sub, // Google's user ID
      name: googleUser.name,
      email: googleUser.email,
      type: "customer", // For fashionindependent, backers are "customer" type
    };

    const backendEndpoints = [
      `${BACKEND_URL}/auth/social-login`,
      `${BACKEND_URL}/auth/login`,
      `${BACKEND_URL}/auth/google`,
      `${BACKEND_URL}/auth/google/login`,
    ];

    let backendResponseText = "";
    let backendResponseStatus = 0;
    let backendResponseOk = false;
    let backendError: unknown = null;

    for (const endpoint of backendEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(socialPayload),
        });

        const responseText = await response.text();
        const isRouteError = response.status === 404 || responseText.includes("Invalid Route") || responseText.includes("Route not found");

        if (response.ok) {
          backendResponseText = responseText;
          backendResponseStatus = response.status;
          backendResponseOk = true;
          break;
        }

        if (!isRouteError) {
          backendResponseText = responseText;
          backendResponseStatus = response.status;
          backendResponseOk = false;
          backendError = responseText;
          break;
        }

        console.warn("[OAuth Callback] Route mismatch, trying next endpoint", {
          endpoint,
          status: response.status,
          responseText,
        });
      } catch (error) {
        backendError = error;
      }
    }

    if (!backendResponseText && backendError && !backendResponseStatus) {
      console.error("Backend auth error:", backendError);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
          origin
        )
      );
    }

    let authData: Record<string, any> = {};

    try {
      authData = JSON.parse(backendResponseText);
    } catch {
      authData = { raw: backendResponseText };
    }

    const authMessage = typeof authData.message === "string"
      ? authData.message
      : typeof authData.error === "string"
        ? authData.error
        : "";
    const isAuthSuccessful = Boolean(
      authData.access_token ||
      authData.token ||
      authData.user ||
      authData.result === true ||
      authData.status === true ||
      authData.success === true
    );
    const hasUserNotFoundSignal = /user not found|not found|not registered|register/i.test(authMessage);
    const isNewSocialUser = authData.is_new_user === true || authData.result === false || authData.status === false || authData.success === false;
    const needsProfileCompletion = Boolean(
      (isNewSocialUser && hasUserNotFoundSignal) ||
      (authData.is_new_user === true && (authData.profile_complete === false || !authData.user?.type || !String(authData.user.type).trim()))
    );

    if (!backendResponseOk) {
      console.error("Backend auth error:", authData);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(authData.message || authData.error || "Authentication failed")}`,
          origin
        )
      );
    }

    if (!isAuthSuccessful && !needsProfileCompletion) {
      console.error("Backend auth returned an unexpected shape:", authData);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(authMessage || "Authentication failed")}`,
          origin
        )
      );
    }

    // Map backend user type to frontend role
    const userData = authData.user ? {
      ...authData.user,
      role: authData.user.type === 'customer' ? 'backer' : (authData.user.type || 'backer')
    } : null;

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
      authMessage,
      isAuthSuccessful,
    });
    console.log("[OAuth Callback] Mapped user:", userData);

    if (needsProfileCompletion) {
      const signupUrl = new URL("/signup", origin);
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
    const initUrl = new URL("/auth/init-client", origin);
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Google OAuth callback error:", errorMessage, errorStack);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage || "An unexpected error occurred")}`, getSafeAppOrigin(req))
    );
  }
}
