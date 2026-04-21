import { r as reactExports, j as jsxRuntimeExports } from "./index-JOqAemMk.js";
import { X } from "./x-DzgZfkJo.js";
function Modal({
  isOpen,
  onClose,
  title,
  children,
  "data-ocid": ocid
}) {
  const overlayRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: overlayRef,
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm animate-fade-in",
      onClick: (e) => {
        if (e.target === overlayRef.current) onClose();
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      "data-ocid": ocid,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-base text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "data-ocid": ocid ? `${ocid}.close_button` : void 0,
              className: "p-1.5 rounded-full hover:bg-muted transition-smooth",
              "aria-label": "Close modal",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children })
      ] })
    }
  );
}
export {
  Modal as M
};
