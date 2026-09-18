import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Store } from "lucide-react";

// ============================================================================
// Easy-to-edit configuration
// ============================================================================
const COMPANY_NAME = "Acme Software Solutions";
const COMPANY_TAGLINE = "Software Development & Digital Solutions";
const COMPANY_PHONE = "+1 (555) 123-4567";

// Point this at your existing PHP authentication handler.
const PHP_LOGIN_ENDPOINT = "/login.php";
// Query parameter your PHP backend adds when redirecting back on failure, e.g. ?error=1
const PHP_ERROR_QUERY_PARAM = "error";
// ============================================================================

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sign In | TK Franchise Shop" },
      {
        name: "description",
        content: "Secure sign in to TK Franchise Shop.",
      },
      {
        property: "og:title",
        content: "Sign In | TK Franchise Shop",
      },
      {
        property: "og:description",
        content: "Secure sign in to TK Franchise Shop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const formRef = useRef<HTMLFormElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get(PHP_ERROR_QUERY_PARAM)) {
      setErrors({
        general: "Invalid username or password. Please try again.",
      });
    }
  }, []);

  const validate = () => {
    const next: typeof errors = {};
    if (!username.trim()) {
      next.username = "Username is required";
    }
    if (!password) {
      next.password = "Password is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setIsSubmitting(true);
    // Submit natively so the existing PHP backend handles authentication unchanged.
    formRef.current?.submit();
  };

  return (
    <div className="login-bg flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="login-bg mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground shadow-lg">
              <Store className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              TK Franchise Shop
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your franchise
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            action={PHP_LOGIN_ENDPOINT}
            method="POST"
            className="space-y-6"
          >
            {errors.general && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your username"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="login-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="px-4 py-6 text-center text-sm">
        <p className="login-footer-heading font-medium">{COMPANY_NAME}</p>
        <p className="login-footer-text mt-1">{COMPANY_TAGLINE}</p>
        <p className="login-footer-text mt-1">Phone: {COMPANY_PHONE}</p>
      </footer>
    </div>
  );
}
