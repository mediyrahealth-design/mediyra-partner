import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Building2, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Role } from "../backend.d";
import { useAuth } from "../hooks/useAuth";
import { useApiService } from "../services/api";

export default function LoginPage() {
  const { login } = useAuth();
  const api = useApiService();
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError("Please enter your Collection Center ID and password.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const result = await api.login(userId.trim(), password);
      if (result.__kind__ === "err") {
        setError(result.err || "Invalid credentials. Please try again.");
        return;
      }
      const session = result.ok;
      let centerName: string | undefined;
      if (session.role === Role.collectionCenter) {
        try {
          const center = await api.getMyCenter(session.token);
          centerName = center?.name;
        } catch {
          // non-critical
        }
      }
      login(session, centerName);
      if (session.role === Role.admin) {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch {
      setError("Connection error. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center px-4 py-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "oklch(0.48 0.16 250)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "oklch(0.6 0.15 170)" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: "oklch(0.48 0.16 250)" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16 3C9.37 3 4 8.37 4 15s5.37 12 12 12 12-5.37 12-12S22.63 3 16 3zm1 17h-2v-6h2v6zm0-8h-2V9h2v3z"
                fill="white"
                opacity="0.9"
              />
              <path d="M16 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="white" />
              <rect
                x="14.5"
                y="11"
                width="3"
                height="10"
                rx="1.5"
                fill="white"
              />
            </svg>
          </div>
          <h1
            className="font-display font-bold text-3xl tracking-tight"
            style={{ color: "oklch(0.18 0.015 230)" }}
          >
            Mediyra Lab
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-8 h-px"
              style={{ background: "oklch(0.48 0.16 250 / 0.4)" }}
            />
            <p
              className="text-sm font-medium font-body"
              style={{ color: "oklch(0.48 0.16 250)" }}
            >
              Partner Portal
            </p>
            <div
              className="w-8 h-px"
              style={{ background: "oklch(0.48 0.16 250 / 0.4)" }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="mb-6">
            <h2 className="font-display font-semibold text-foreground text-xl mb-1">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm font-body">
              Sign in to your collection center account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Center ID */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="userId"
                className="text-sm font-semibold text-foreground"
              >
                Collection Center ID
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. CC001"
                  autoComplete="username"
                  data-ocid="login.userid_input"
                  className="input-field w-full pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  data-ocid="login.password_input"
                  className="input-field w-full pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5"
                data-ocid="login.error_state"
              >
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              data-ocid="login.submit_button"
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Forgot password */}
            <button
              type="button"
              data-ocid="login.forgot_password_button"
              className="text-primary text-sm font-medium text-center hover:underline transition-smooth"
              onClick={() => {
                alert(
                  "Please contact Mediyra Lab support to reset your password.\n\nCall: +91 98765 43210",
                );
              }}
            >
              Forgot Password?
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground text-xs mt-6 text-center font-body">
          Powered by Mediyra Diagnostics
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1 text-center font-body">
          © {new Date().getFullYear()} Mediyra Lab. All rights reserved.
        </p>
      </div>
    </div>
  );
}
