import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { Role } from "../backend.d";
import { useAuth } from "../hooks/useAuth";
import { useApiService } from "../services/api";

export default function AdminLoginPage() {
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
      setError("Please enter your admin credentials.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const result = await api.login(userId.trim(), password);
      if (result.__kind__ === "err") {
        setError(result.err || "Invalid credentials.");
        return;
      }
      const session = result.ok;
      if (session.role !== Role.admin) {
        setError("Access denied. This portal is for administrators only.");
        return;
      }
      login(session, "Admin");
      navigate({ to: "/admin/dashboard" });
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "oklch(0.28 0.14 250)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.07]"
          style={{ background: "oklch(0.28 0.14 250)" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "oklch(0.33 0.18 255)" }}
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.6 0.15 170)" }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5l2 2 4-4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h1
            className="font-display font-bold text-3xl tracking-tight"
            style={{ color: "oklch(0.18 0.015 230)" }}
          >
            Mediyra Lab Admin
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-8 h-px"
              style={{ background: "oklch(0.33 0.18 255 / 0.4)" }}
            />
            <p
              className="text-sm font-medium font-body"
              style={{ color: "oklch(0.33 0.18 255)" }}
            >
              Staff Portal
            </p>
            <div
              className="w-8 h-px"
              style={{ background: "oklch(0.33 0.18 255 / 0.4)" }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="mb-6">
            <h2 className="font-display font-semibold text-foreground text-xl mb-1">
              Administrator Sign In
            </h2>
            <p className="text-muted-foreground text-sm font-body">
              Restricted access — authorized staff only
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="adminUserId"
                className="text-sm font-semibold text-foreground"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                <input
                  id="adminUserId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Admin username"
                  autoComplete="username"
                  data-ocid="admin_login.userid_input"
                  className="input-field w-full pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="adminPassword"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                <input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  autoComplete="current-password"
                  data-ocid="admin_login.password_input"
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
                data-ocid="admin_login.error_state"
              >
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              data-ocid="admin_login.submit_button"
              className="w-full py-3 text-base flex items-center justify-center gap-2 rounded-lg text-white font-semibold transition-smooth hover:opacity-90 active:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{ background: "oklch(0.33 0.18 255)" }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Forgot password */}
            <button
              type="button"
              data-ocid="admin_login.forgot_password_button"
              className="text-sm font-medium text-center hover:underline transition-smooth"
              style={{ color: "oklch(0.33 0.18 255)" }}
              onClick={() => {
                alert(
                  "Please contact your system administrator to reset your admin credentials.",
                );
              }}
            >
              Forgot Password?
            </button>
          </form>
        </div>

        {/* Partner login link */}
        <p className="text-muted-foreground text-sm mt-6 text-center font-body">
          Not an admin?{" "}
          <a
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Partner Login →
          </a>
        </p>
        <p className="text-muted-foreground/60 text-xs mt-2 text-center font-body">
          © {new Date().getFullYear()} Mediyra Lab. All rights reserved.
        </p>
      </div>
    </div>
  );
}
