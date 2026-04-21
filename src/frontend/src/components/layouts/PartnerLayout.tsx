import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  CreditCard,
  FileText,
  FlaskConical,
  HeadphonesIcon,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", path: "/book-test", icon: BookOpen },
  { label: "Samples", path: "/track-sample", icon: FlaskConical },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "More", path: "/billing", icon: Activity },
];

export function PartnerLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const api = useApiService();
  const location = useLocation();

  const handleLogout = async () => {
    if (user?.token) {
      await api.logout(user.token).catch(() => null);
    }
    logout();
  };

  const initials = user?.centerName
    ? user.centerName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : (user?.userId?.slice(0, 2).toUpperCase() ?? "CL");

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-md mx-auto relative">
      {/* Top Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">
              M
            </span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Mediyra Lab
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xs">
                {initials}
              </span>
            </div>
            {user?.centerName && (
              <span className="text-primary-foreground/80 text-xs mt-0.5 max-w-[80px] truncate">
                {user.centerName}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="partner.logout_button"
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-smooth"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 text-primary-foreground/80" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border shadow-md z-40">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                data-ocid={`partner.nav.${label.toLowerCase()}_link`}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-smooth min-w-0 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`}
                />
                <span
                  className={`text-[10px] font-semibold tracking-wide ${isActive ? "text-primary" : ""}`}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// Re-export other icons for use in pages
export { User, CreditCard, HeadphonesIcon };
