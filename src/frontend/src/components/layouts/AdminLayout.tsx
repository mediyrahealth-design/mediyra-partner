import { Link, useLocation } from "@tanstack/react-router";
import {
  CreditCard,
  FileText,
  FlaskConical,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";

const ADMIN_NAV = [
  { label: "Collection Centers", path: "/admin/centers", icon: Users },
  { label: "Tests", path: "/admin/tests", icon: FlaskConical },
  { label: "Reports", path: "/admin/reports", icon: FileText },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const api = useApiService();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    if (user?.token) {
      await api.logout(user.token).catch(() => null);
    }
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg hover:bg-primary-foreground/10 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-bold text-base tracking-tight">
            Mediyra Lab{" "}
            <span className="font-normal text-primary-foreground/70 text-sm">
              Admin
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          data-ocid="admin.logout_button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-smooth text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-card border-r border-border z-30 transition-transform duration-300 shadow-md md:shadow-none`}
        >
          <nav className="p-3 flex flex-col gap-1">
            {ADMIN_NAV.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  data-ocid={`admin.nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth font-medium text-sm ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-foreground/20 z-20 md:hidden"
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
