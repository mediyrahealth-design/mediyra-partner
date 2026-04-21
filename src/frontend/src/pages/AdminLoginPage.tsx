import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
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
      navigate({ to: "/admin/centers" });
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3 shadow-md">
            <ShieldCheck className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-foreground text-2xl">
            Admin Portal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Mediyra Lab Administration
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="adminUserId"
                className="text-sm font-semibold text-foreground"
              >
                Admin ID
              </label>
              <input
                id="adminUserId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Admin username"
                autoComplete="username"
                data-ocid="admin_login.userid_input"
                className="input-field w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="adminPassword"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  autoComplete="current-password"
                  data-ocid="admin_login.password_input"
                  className="input-field w-full pl-10 pr-10"
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

            {error && (
              <div
                className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                data-ocid="admin_login.error_state"
              >
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              data-ocid="admin_login.submit_button"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Admin"
              )}
            </button>
          </form>
        </div>

        <p className="text-muted-foreground text-xs mt-6 text-center">
          Not an admin?{" "}
          <a href="/login" className="text-primary font-medium hover:underline">
            Partner Login →
          </a>
        </p>
      </div>
    </div>
  );
}
