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
          // ignore
        }
      }

      login(session, centerName);

      navigate({
        to: session.role === Role.admin ? "/admin/dashboard" : "/dashboard",
      });
    } catch {
      setError("Connection error. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "oklch(0.48 0.16 250)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "oklch(0.6 0.15 170)" }}
        />
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: "oklch(0.48 0.16 250)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 3C9.37 3 4 8.37 4 15s5.37 12 12 12 12-5.37 12-12S22.63 3 16 3zm1 17h-2v-6h2v6zm0-8h-2V9h2v3z"
                fill="white"
                opacity="0.9"
              />
              <path d="M16 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="white" />
              <rect x="14.5" y="11" width="3" height="10" rx="1.5" fill="white" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Mediyra Lab
          </h1>

          <p className="text-sm text-blue-600 mt-1 font-medium">
            Partner Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your collection center account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* User ID */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Collection Center ID
              </label>

              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. CC001"
                  autoComplete="username"
                  className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
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
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Forgot */}
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
              onClick={() =>
                alert(
                  "Please contact Mediyra Lab support.\n\nCall: +91 98765 43210"
                )
              }
            >
              Forgot Password?
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Powered by Mediyra Diagnostics
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          © {new Date().getFullYear()} Mediyra Lab
        </p>

      </div>
    </div>
  );
}

