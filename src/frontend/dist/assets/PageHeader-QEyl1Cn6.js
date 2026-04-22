import { j as jsxRuntimeExports } from "./index-DC8ICoH5.js";
function PageHeader({ title, subtitle, action }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground leading-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: subtitle })
    ] }),
    action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: action })
  ] });
}
export {
  PageHeader as P
};
