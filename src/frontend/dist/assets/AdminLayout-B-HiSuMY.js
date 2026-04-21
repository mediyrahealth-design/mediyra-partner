import { u as useAuth, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-JOqAemMk.js";
import { u as useLocation, L as LogOut, a as FlaskConical, F as FileText } from "./log-out-D-etv4XY.js";
import { c as createLucideIcon, u as useApiService } from "./api-BJm7cS3U.js";
import { X } from "./x-DzgZfkJo.js";
import { C as CreditCard } from "./credit-card-D3csqvbz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = createLucideIcon("menu", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const ADMIN_NAV = [
  { label: "Collection Centers", path: "/admin/centers", icon: Users },
  { label: "Tests", path: "/admin/tests", icon: FlaskConical },
  { label: "Reports", path: "/admin/reports", icon: FileText },
  { label: "Payments", path: "/admin/payments", icon: CreditCard }
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMobileOpen(!mobileOpen),
            className: "p-1.5 rounded-lg hover:bg-primary-foreground/10 md:hidden",
            "aria-label": "Toggle menu",
            children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm", children: "M" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-base tracking-tight", children: [
          "Mediyra Lab",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-primary-foreground/70 text-sm", children: "Admin" })
        ] })
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
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "aside",
        {
          className: `${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-card border-r border-border z-30 transition-transform duration-300 shadow-md md:shadow-none`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-3 flex flex-col gap-1", children: ADMIN_NAV.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname.startsWith(path);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: path,
                onClick: () => setMobileOpen(false),
                "data-ocid": `admin.nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`,
                className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth font-medium text-sm ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Icon,
                    {
                      className: `w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`
                    }
                  ),
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
  Users as U
};
