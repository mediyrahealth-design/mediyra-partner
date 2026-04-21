import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
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
        navigate({ to: "/admin/centers" });
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
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
      {/* Brand header */}
      <div className="flex flex-col items-center mb-10 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-3 shadow-lg">
          <span className="font-display font-bold text-primary-foreground text-2xl">
            M
          </span>
        </div>
        <h1 className="font-display font-bold text-primary-foreground text-3xl tracking-tight">
          Mediyra Lab
        </h1>
        <p className="text-primary-foreground/70 text-sm mt-1 font-body">
          Collection Center Partner Portal
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl p-6 animate-slide-up">
        <h2 className="font-display font-semibold text-foreground text-lg mb-1">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in to your partner account
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Center ID */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="userId"
              className="text-sm font-semibold text-foreground"
            >
              Collection Center ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="CC001"
                autoComplete="username"
                data-ocid="login.userid_input"
                className="input-field w-full pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
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
              className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
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
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

      <p className="text-primary-foreground/50 text-xs mt-8 text-center font-body">
        © {new Date().getFullYear()} Mediyra Lab. All rights reserved.
      </p>
    </div>
  );
}
