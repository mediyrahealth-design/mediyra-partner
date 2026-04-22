import { u as useAuth, a as useNavigate, r as reactExports, j as jsxRuntimeExports, R as Role } from "./index-DC8ICoH5.js";
import { c as createLucideIcon, u as useApiService } from "./api-n3_FsYjY.js";
import { U as User } from "./user-chrMZ9cv.js";
import { L as Lock, E as EyeOff, C as CircleAlert } from "./lock-DJ7Aiudw.js";
import { E as Eye } from "./eye-Bm17uRdv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function AdminLoginPage() {
  const { login } = useAuth();
  const api = useApiService();
  const navigate = useNavigate();
  const [userId, setUserId] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const handleSubmit = async (e) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07]",
          style: { background: "oklch(0.28 0.14 250)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.07]",
          style: { background: "oklch(0.28 0.14 250)" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
              style: { background: "oklch(0.33 0.18 255)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-8 h-8 text-white" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
              style: { background: "oklch(0.6 0.15 170)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  width: "10",
                  height: "10",
                  viewBox: "0 0 10 10",
                  fill: "none",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: "M2 5l2 2 4-4",
                      stroke: "white",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "font-display font-bold text-3xl tracking-tight",
            style: { color: "oklch(0.18 0.015 230)" },
            children: "Mediyra Lab Admin"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-8 h-px",
              style: { background: "oklch(0.33 0.18 255 / 0.4)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-medium font-body",
              style: { color: "oklch(0.33 0.18 255)" },
              children: "Staff Portal"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-8 h-px",
              style: { background: "oklch(0.33 0.18 255 / 0.4)" }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl shadow-xl border border-border p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-xl mb-1", children: "Administrator Sign In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Restricted access — authorized staff only" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "flex flex-col gap-5",
            noValidate: true,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "adminUserId",
                    className: "text-sm font-semibold text-foreground",
                    children: "Username"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "adminUserId",
                      type: "text",
                      value: userId,
                      onChange: (e) => setUserId(e.target.value),
                      placeholder: "Admin username",
                      autoComplete: "username",
                      "data-ocid": "admin_login.userid_input",
                      className: "input-field w-full pl-10"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "adminPassword",
                    className: "text-sm font-semibold text-foreground",
                    children: "Password"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "adminPassword",
                      type: showPassword ? "text" : "password",
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      placeholder: "Admin password",
                      autoComplete: "current-password",
                      "data-ocid": "admin_login.password_input",
                      className: "input-field w-full pl-10 pr-11"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
                      "aria-label": showPassword ? "Hide password" : "Show password",
                      children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5",
                  "data-ocid": "admin_login.error_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive mt-0.5 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs font-medium", children: error })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  disabled: isLoading,
                  "data-ocid": "admin_login.submit_button",
                  className: "w-full py-3 text-base flex items-center justify-center gap-2 rounded-lg text-white font-semibold transition-smooth hover:opacity-90 active:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed mt-1",
                  style: { background: "oklch(0.33 0.18 255)" },
                  children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" }),
                    "Signing in..."
                  ] }) : "Sign In"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "admin_login.forgot_password_button",
                  className: "text-sm font-medium text-center hover:underline transition-smooth",
                  style: { color: "oklch(0.33 0.18 255)" },
                  onClick: () => {
                    alert(
                      "Please contact your system administrator to reset your admin credentials."
                    );
                  },
                  children: "Forgot Password?"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-6 text-center font-body", children: [
        "Not an admin?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/login",
            className: "text-primary font-semibold hover:underline",
            children: "Partner Login →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground/60 text-xs mt-2 text-center font-body", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Mediyra Lab. All rights reserved."
      ] })
    ] })
  ] });
}
export {
  AdminLoginPage as default
};
