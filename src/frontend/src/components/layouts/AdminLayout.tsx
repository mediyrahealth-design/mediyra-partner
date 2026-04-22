import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Building2,
  CreditCard,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";

const ADMIN_NAV = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings", path: "/admin/bookings", icon: BookOpen },
  { label: "Collection Centers", path: "/admin/centers", icon: Building2 },
  { label: "Tests", path: "/admin/tests", icon: FlaskConical },
  { label: "Reports", path: "/admin/reports", icon: FileText },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
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

  const initials = user?.userId ? user.userId.slice(0, 2).toUpperCase() : "AD";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg hover:bg-primary-foreground/10 md:hidden transition-smooth"
            aria-label="Toggle menu"
            data-ocid="admin.sidebar_toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <span className="font-display font-bold text-sm">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-tight leading-none">
              Mediyra Lab
            </span>
            <span className="text-primary-foreground/70 text-xs font-body">
              Admin Panel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-foreground/10">
            <div className="w-6 h-6 rounded-full bg-primary-foreground/30 flex items-center justify-center">
              <span className="text-xs font-bold">{initials}</span>
            </div>
            <span className="text-sm font-medium">
              {user?.userId ?? "Admin"}
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
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-card border-r border-border z-30 transition-transform duration-300 shadow-md md:shadow-none overflow-y-auto`}
        >
          <nav className="p-3 flex flex-col gap-0.5 pt-4">
            {ADMIN_NAV.map(({ label, path, icon: Icon }) => {
              const isActive =
                location.pathname === path ||
                (path !== "/admin/dashboard" &&
                  location.pathname.startsWith(path));
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  data-ocid={`admin.nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth font-medium text-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
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
