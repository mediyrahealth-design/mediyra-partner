import { u as useAuth, a as useNavigate, r as reactExports, j as jsxRuntimeExports, R as Role } from "./index-DC8ICoH5.js";
import { u as useApiService } from "./api-n3_FsYjY.js";
import { B as Building2 } from "./building-2-wGjg_aWl.js";
import { L as Lock, E as EyeOff, C as CircleAlert } from "./lock-DJ7Aiudw.js";
import { E as Eye } from "./eye-Bm17uRdv.js";
function LoginPage() {
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
      let centerName;
      if (session.role === Role.collectionCenter) {
        try {
          const center = await api.getMyCenter(session.token);
          centerName = center == null ? void 0 : center.name;
        } catch {
        }
      }
      login(session, centerName);
      if (session.role === Role.admin) {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch {
      setError("Connection error. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10",
          style: { background: "oklch(0.48 0.16 250)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10",
          style: { background: "oklch(0.6 0.15 170)" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg",
            style: { background: "oklch(0.48 0.16 250)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                width: "32",
                height: "32",
                viewBox: "0 0 32 32",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: "M16 3C9.37 3 4 8.37 4 15s5.37 12 12 12 12-5.37 12-12S22.63 3 16 3zm1 17h-2v-6h2v6zm0-8h-2V9h2v3z",
                      fill: "white",
                      opacity: "0.9"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z", fill: "white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      x: "14.5",
                      y: "11",
                      width: "3",
                      height: "10",
                      rx: "1.5",
                      fill: "white"
                    }
                  )
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "font-display font-bold text-3xl tracking-tight",
            style: { color: "oklch(0.18 0.015 230)" },
            children: "Mediyra Lab"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-8 h-px",
              style: { background: "oklch(0.48 0.16 250 / 0.4)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-medium font-body",
              style: { color: "oklch(0.48 0.16 250)" },
              children: "Partner Portal"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-8 h-px",
              style: { background: "oklch(0.48 0.16 250 / 0.4)" }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl shadow-xl border border-border p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-xl mb-1", children: "Welcome back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Sign in to your collection center account" })
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
                    htmlFor: "userId",
                    className: "text-sm font-semibold text-foreground",
                    children: "Collection Center ID"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "userId",
                      type: "text",
                      value: userId,
                      onChange: (e) => setUserId(e.target.value),
                      placeholder: "e.g. CC001",
                      autoComplete: "username",
                      "data-ocid": "login.userid_input",
                      className: "input-field w-full pl-10"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "password",
                    className: "text-sm font-semibold text-foreground",
                    children: "Password"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "password",
                      type: showPassword ? "text" : "password",
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      placeholder: "Enter your password",
                      autoComplete: "current-password",
                      "data-ocid": "login.password_input",
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
                  "data-ocid": "login.error_state",
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
                  "data-ocid": "login.submit_button",
                  className: "btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1",
                  children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" }),
                    "Signing in..."
                  ] }) : "Sign In"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "login.forgot_password_button",
                  className: "text-primary text-sm font-medium text-center hover:underline transition-smooth",
                  onClick: () => {
                    alert(
                      "Please contact Mediyra Lab support to reset your password.\n\nCall: +91 98765 43210"
                    );
                  },
                  children: "Forgot Password?"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-6 text-center font-body", children: "Powered by Mediyra Diagnostics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground/60 text-xs mt-1 text-center font-body", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Mediyra Lab. All rights reserved."
      ] })
    ] })
  ] });
}
export {
  LoginPage as default
};
