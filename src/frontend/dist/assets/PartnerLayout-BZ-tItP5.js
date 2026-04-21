import { u as useAuth, j as jsxRuntimeExports, L as Link } from "./index-JOqAemMk.js";
import { u as useLocation, L as LogOut, a as FlaskConical, F as FileText } from "./log-out-D-etv4XY.js";
import { c as createLucideIcon, u as useApiService } from "./api-BJm7cS3U.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode);
const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", path: "/book-test", icon: BookOpen },
  { label: "Samples", path: "/track-sample", icon: FlaskConical },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "More", path: "/billing", icon: Activity }
];
function PartnerLayout({ children }) {
  var _a;
  const { user, logout } = useAuth();
  const api = useApiService();
  const location = useLocation();
  const handleLogout = async () => {
    if (user == null ? void 0 : user.token) {
      await api.logout(user.token).catch(() => null);
    }
    logout();
  };
  const initials = (user == null ? void 0 : user.centerName) ? user.centerName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() : ((_a = user == null ? void 0 : user.userId) == null ? void 0 : _a.slice(0, 2).toUpperCase()) ?? "CL";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background max-w-md mx-auto relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-display font-bold text-sm", children: "M" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg tracking-tight", children: "Mediyra Lab" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-semibold text-xs", children: initials }) }),
          (user == null ? void 0 : user.centerName) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground/80 text-xs mt-0.5 max-w-[80px] truncate", children: user.centerName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleLogout,
            "data-ocid": "partner.logout_button",
            className: "p-2 rounded-full hover:bg-primary-foreground/10 transition-smooth",
            "aria-label": "Logout",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4 text-primary-foreground/80" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto pb-24", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border shadow-md z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-around py-2", children: NAV_ITEMS.map(({ label, path, icon: Icon }) => {
      const isActive = location.pathname === path;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: path,
          "data-ocid": `partner.nav.${label.toLowerCase()}_link`,
          className: `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-smooth min-w-0 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Icon,
              {
                className: `w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold tracking-wide ${isActive ? "text-primary" : ""}`,
                children: label
              }
            ),
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-primary mt-0.5" })
          ]
        },
        path
      );
    }) }) })
  ] });
}
export {
  Activity as A,
  PartnerLayout as P
};
