import { u as useAuth, a as useNavigate, r as reactExports, j as jsxRuntimeExports, R as Role } from "./index-JOqAemMk.js";
import { u as useApiService } from "./api-BJm7cS3U.js";
import { U as User } from "./user-DUNAeE4v.js";
import { L as Lock, E as EyeOff, a as Eye, C as CircleAlert } from "./lock-BOv9ujjy.js";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-primary flex flex-col items-center justify-center px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-10 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-3 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-primary-foreground text-2xl", children: "M" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-primary-foreground text-3xl tracking-tight", children: "Mediyra Lab" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/70 text-sm mt-1 font-body", children: "Collection Center Partner Portal" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm bg-card rounded-2xl shadow-xl p-6 animate-slide-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-lg mb-1", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Sign in to your partner account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          className: "flex flex-col gap-5",
          noValidate: true,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "userId",
                  className: "text-sm font-semibold text-foreground",
                  children: "Collection Center ID"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "userId",
                    type: "text",
                    value: userId,
                    onChange: (e) => setUserId(e.target.value),
                    placeholder: "CC001",
                    autoComplete: "username",
                    "data-ocid": "login.userid_input",
                    className: "input-field w-full pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "password",
                  className: "text-sm font-semibold text-foreground",
                  children: "Password"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" }),
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
                className: "flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2",
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
                className: "btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed",
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary-foreground/50 text-xs mt-8 text-center font-body", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Mediyra Lab. All rights reserved."
    ] })
  ] });
}
export {
  LoginPage as default
};
