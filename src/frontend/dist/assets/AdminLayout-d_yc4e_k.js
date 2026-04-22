import { u as useAuth, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-DC8ICoH5.js";
import { u as useLocation, L as LogOut, b as LayoutDashboard, B as BookOpen, a as FlaskConical, F as FileText } from "./log-out-CvArZmaA.js";
import { c as createLucideIcon, u as useApiService } from "./api-n3_FsYjY.js";
import { X } from "./x-Dn3CuYsv.js";
import { B as Building2 } from "./building-2-wGjg_aWl.js";
import { C as CreditCard } from "./credit-card-BSgX7_ct.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = createLucideIcon("menu", __iconNode);
const ADMIN_NAV = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings", path: "/admin/bookings", icon: BookOpen },
  { label: "Collection Centers", path: "/admin/centers", icon: Building2 },
  { label: "Tests", path: "/admin/tests", icon: FlaskConical },
  { label: "Reports", path: "/admin/reports", icon: FileText },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Analytics", path: "/admin/analytics", icon: ChartColumn }
];
function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const api = useApiService();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const handleLogout = async () => {
    if (user == null ? void 0 : user.token) {
      await api.logout(user.token).catch(() => null);
    }
    logout();
  };
  const initials = (user == null ? void 0 : user.userId) ? user.userId.slice(0, 2).toUpperCase() : "AD";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMobileOpen(!mobileOpen),
            className: "p-1.5 rounded-lg hover:bg-primary-foreground/10 md:hidden transition-smooth",
            "aria-label": "Toggle menu",
            "data-ocid": "admin.sidebar_toggle",
            children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm", children: "M" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-base tracking-tight leading-none", children: "Mediyra Lab" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground/70 text-xs font-body", children: "Admin Panel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-foreground/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-primary-foreground/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: initials }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: (user == null ? void 0 : user.userId) ?? "Admin" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleLogout,
            "data-ocid": "admin.logout_button",
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-smooth text-sm font-medium",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "aside",
        {
          className: `${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-card border-r border-border z-30 transition-transform duration-300 shadow-md md:shadow-none overflow-y-auto`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-3 flex flex-col gap-0.5 pt-4", children: ADMIN_NAV.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path || path !== "/admin/dashboard" && location.pathname.startsWith(path);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: path,
                onClick: () => setMobileOpen(false),
                "data-ocid": `admin.nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`,
                className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth font-medium text-sm ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 flex-shrink-0" }),
                  label
                ]
              },
              path
            );
          }) })
        }
      ),
      mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed inset-0 bg-foreground/20 z-20 md:hidden",
          role: "button",
          tabIndex: 0,
          "aria-label": "Close menu",
          onClick: () => setMobileOpen(false),
          onKeyDown: (e) => e.key === "Escape" && setMobileOpen(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto min-w-0", children })
    ] })
  ] });
}
export {
  AdminLayout as A,
  ChartColumn as C
};
