"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";
import { Eye, EyeOff, Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { recaptcha } from "@/config";

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

export default function LoginPage() {
  const { login, loading, error } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const isRenderedRef = useRef(false);
  const router = useRouter();

  // ✅ Unique IDs
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  // reCAPTCHA setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const renderRecaptcha = () => {
      if (!recaptchaRef.current || !window.grecaptcha || isRenderedRef.current) return;
      try {
        const widgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: recaptcha.siteKey,
          theme: "light",
          size: "normal",
        });
        setRecaptchaWidgetId(widgetId);
        setRecaptchaLoaded(true);
        isRenderedRef.current = true;
      } catch (err) {
        console.error("[v0] Failed to render reCAPTCHA:", err);
      }
    };

    window.onRecaptchaLoad = renderRecaptcha;

    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha?.render) {
      renderRecaptcha();
    }

    return () => {
      if (recaptchaWidgetId !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(recaptchaWidgetId);
          isRenderedRef.current = false;
        } catch (err) {
          console.error("[v0] Failed to reset reCAPTCHA:", err);
        }
      }
    };
  }, [recaptchaWidgetId]);

  // Handle login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaLoaded || !window.grecaptcha || recaptchaWidgetId === null) {
      alert("Please wait for reCAPTCHA to load");
      return;
    }

    const recaptchaResponse = window.grecaptcha.getResponse(recaptchaWidgetId);
    if (!recaptchaResponse) {
      alert("Please complete the reCAPTCHA verification");
      return;
    }

    try {
      const success = await login(email, password, recaptchaResponse, rememberMe);
      if (success) router.push("/profile");
    } catch (err) {
      console.error("[v0] Login failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `hsl(var(--background))`,
        color: `hsl(var(--foreground))`,
      }}
    >
      <div className="w-full max-w-md">
        <div
          className="backdrop-blur-md shadow-2xl rounded-3xl p-8"
          style={{
            background: `hsl(var(--card))`,
            color: `hsl(var(--card-foreground))`,
            border: `1px solid hsl(var(--border))`,
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-md"
              style={{ background: `hsl(var(--primary))` }}
            >
              <Shield className="w-8 h-8" style={{ color: `hsl(var(--primary-foreground))` }} />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ color: `hsl(var(--primary))` }}
            >
              Welcome Back
            </h1>
            <p className="mt-2" style={{ color: `hsl(var(--muted-foreground))` }}>
              Sign in to your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert
              className="mb-6"
              style={{
                borderColor: `hsl(var(--destructive))`,
                backgroundColor: `hsl(var(--destructive) / 0.1)`,
              }}
            >
              <AlertDescription style={{ color: `hsl(var(--destructive))` }}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor={emailId} className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: `hsl(var(--muted-foreground))` }}
                />
                <Input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="pl-10 h-12"
                  style={{
                    borderColor: `hsl(var(--border))`,
                    backgroundColor: `hsl(var(--input))`,
                    color: `hsl(var(--foreground))`,
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor={passwordId} className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: `hsl(var(--muted-foreground))` }}
                />
                <Input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10 pr-10 h-12"
                  style={{
                    borderColor: `hsl(var(--border))`,
                    backgroundColor: `hsl(var(--input))`,
                    color: `hsl(var(--foreground))`,
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: `hsl(var(--muted-foreground))` }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={rememberId}
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor={rememberId} className="text-sm" style={{ color: `hsl(var(--muted-foreground))` }}>
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                style={{ color: `hsl(var(--primary))`, fontWeight: 500 }}
                onClick={() => router.push("/forgot-password")}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* reCAPTCHA */}
            <div className="flex flex-col items-center">
              <div ref={recaptchaRef} id="recaptcha-container" className="transform scale-90 origin-center" />
              {!recaptchaLoaded && (
                <div className="flex items-center space-x-2 mt-2" style={{ color: `hsl(var(--muted-foreground))` }}>
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: `hsl(var(--border))`,
                      borderTopColor: `hsl(var(--primary))`,
                    }}
                  />
                  <span className="text-sm">Loading reCAPTCHA...</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !recaptchaLoaded}
              className="w-full h-12 font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: `hsl(var(--primary))`,
                color: `hsl(var(--primary-foreground))`,
              }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: `hsl(var(--primary-foreground))` }}
                  />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>

            {/* Footer */}
            <p className="text-xs text-center" style={{ color: `hsl(var(--muted-foreground))` }}>
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" style={{ color: `hsl(var(--primary))` }} className="hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" style={{ color: `hsl(var(--primary))` }} className="hover:underline">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
