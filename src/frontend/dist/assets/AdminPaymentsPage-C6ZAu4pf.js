import { u as useAuth, b as useQueryClient, r as reactExports, P as PaymentStatus, j as jsxRuntimeExports, e as CardSkeleton } from "./index-JOqAemMk.js";
import { u as useApiService, a as useQuery } from "./api-BJm7cS3U.js";
import { u as useMutation } from "./useMutation-3PZEnUl4.js";
import { A as AdminLayout } from "./AdminLayout-B-HiSuMY.js";
import { E as EmptyState } from "./EmptyState-Bs2VlqML.js";
import { M as Modal } from "./Modal-CS88njSf.js";
import { P as PageHeader } from "./PageHeader-CYQif57L.js";
import { P as Plus } from "./plus-ClniduwG.js";
import { C as CircleCheckBig } from "./circle-check-big-szzhXTQg.js";
import { C as CreditCard } from "./credit-card-D3csqvbz.js";
import "./log-out-D-etv4XY.js";
import "./x-DzgZfkJo.js";
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function PaymentStatusBadge({ status }) {
  if (status === PaymentStatus.paid) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
      "Paid"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-full", children: "Pending" });
}
function AdminPaymentsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    centerId: "",
    amount: "",
    invoiceNumber: "",
    notes: ""
  });
  const [formError, setFormError] = reactExports.useState("");
  const [selectedCenter, setSelectedCenter] = reactExports.useState("all");
  const [centerName, setCenterName] = reactExports.useState("All Centers");
  const [centerSearch, setCenterSearch] = reactExports.useState("");
  const [showDropdown, setShowDropdown] = reactExports.useState(false);
  const { data: centers = [] } = useQuery({
    queryKey: ["admin.centers", user == null ? void 0 : user.token],
    queryFn: () => api.getCenters(user.token),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin.payments", user == null ? void 0 : user.token, selectedCenter],
    queryFn: async () => {
      if (!(user == null ? void 0 : user.token)) return [];
      if (selectedCenter === "all") {
        const allResults = await Promise.all(
          centers.map((c) => api.getPaymentsByCenter(user.token, c.id))
        );
        return allResults.flat().sort((a, b) => Number(b.date) - Number(a.date));
      }
      return api.getPaymentsByCenter(user.token, selectedCenter);
    },
    enabled: !!(user == null ? void 0 : user.token)
  });
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      if (!form.centerId || !form.amount || !form.invoiceNumber)
        throw new Error("Please fill all required fields.");
      return api.addPayment(
        user.token,
        form.centerId,
        BigInt(Math.round(Number(form.amount))),
        form.invoiceNumber,
        form.notes
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.payments"] });
      setAddOpen(false);
      setForm({ centerId: "", amount: "", invoiceNumber: "", notes: "" });
    },
    onError: (e) => setFormError(e.message)
  });
  const markPaidMutation = useMutation({
    mutationFn: async (paymentId) => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      return api.markPaymentPaid(user.token, paymentId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin.payments"] })
  });
  const filteredCenters = centers.filter(
    (c) => centerSearch === "" || c.name.toLowerCase().includes(centerSearch.toLowerCase()) || c.id.toLowerCase().includes(centerSearch.toLowerCase())
  );
  const totalPending = payments.filter((p) => p.status === PaymentStatus.pending).reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaid = payments.filter((p) => p.status === PaymentStatus.paid).reduce((sum, p) => sum + Number(p.amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Payments",
          subtitle: "Manage center commissions and billing",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setFormError("");
                setAddOpen(true);
              },
              "data-ocid": "admin.payments.add_button",
              className: "btn-primary flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Add Payment"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mt-1 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-xl text-warning mt-0.5", children: [
            "₹",
            totalPending.toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Paid Out" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-xl text-accent mt-0.5", children: [
            "₹",
            totalPaid.toLocaleString("en-IN")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "search",
            value: centerSearch,
            onChange: (e) => {
              setCenterSearch(e.target.value);
              setShowDropdown(true);
            },
            onFocus: () => setShowDropdown(true),
            placeholder: `Filtering: ${centerName}`,
            "data-ocid": "admin.payments.center_search_input",
            className: "input-field w-full"
          }
        ),
        showDropdown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-20 left-0 right-0 mt-1 border border-border rounded-lg bg-card shadow-md overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedCenter("all");
                setCenterName("All Centers");
                setCenterSearch("");
                setShowDropdown(false);
              },
              className: "w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border font-medium text-foreground",
              children: "All Centers"
            }
          ),
          filteredCenters.slice(0, 6).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedCenter(c.id);
                setCenterName(c.name);
                setCenterSearch("");
                setShowDropdown(false);
              },
              className: "w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-2 text-xs", children: c.id })
              ]
            },
            c.id
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-lg border border-border overflow-hidden bg-card shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.payments.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Invoice #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 7,
            className: "px-4 py-8 text-center text-muted-foreground text-sm",
            children: "Loading..."
          }
        ) }) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 7,
            className: "px-4 py-10 text-center text-muted-foreground text-sm",
            children: "No payment records found."
          }
        ) }) : payments.map((pay, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-smooth",
            "data-ocid": `admin.payments.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                "#",
                pay.invoiceNumber
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs", children: pay.centerId }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-bold text-foreground", children: [
                "₹",
                Number(pay.amount).toLocaleString("en-IN")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: formatDate(pay.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground truncate max-w-[160px]", children: pay.notes || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: pay.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: pay.status === PaymentStatus.pending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => markPaidMutation.mutate(pay.id),
                  "data-ocid": `admin.payments.mark_paid_button.${i + 1}`,
                  disabled: markPaidMutation.isPending,
                  className: "inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-lg transition-smooth disabled:opacity-50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
                    "Mark Paid"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) })
            ]
          },
          pay.id.toString()
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-2 md:hidden",
          "data-ocid": "admin.payments.list",
          children: isLoading ? ["psk1", "psk2", "psk3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}, k)) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-7 h-7" }),
              title: "No payments",
              description: "No payment records found.",
              "data-ocid": "admin.payments.empty_state"
            }
          ) : payments.map((pay, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "card-elevated p-4 flex items-center gap-3",
              "data-ocid": `admin.payments.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${pay.status === PaymentStatus.paid ? "bg-accent/10" : "bg-warning/10"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CreditCard,
                      {
                        className: `w-4 h-4 ${pay.status === PaymentStatus.paid ? "text-accent" : "text-warning"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground", children: [
                    "Invoice #",
                    pay.invoiceNumber
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    formatDate(pay.date),
                    " • ",
                    pay.centerId
                  ] }),
                  pay.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: pay.notes })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm text-foreground", children: [
                    "₹",
                    Number(pay.amount).toLocaleString("en-IN")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: pay.status }),
                  pay.status === PaymentStatus.pending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => markPaidMutation.mutate(pay.id),
                      "data-ocid": `admin.payments.mark_paid_button.${i + 1}`,
                      className: "flex items-center gap-1 text-[10px] font-semibold text-accent hover:underline mt-0.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
                        "Mark Paid"
                      ]
                    }
                  )
                ] })
              ]
            },
            pay.id.toString()
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: addOpen,
        onClose: () => {
          setAddOpen(false);
          setFormError("");
        },
        title: "Add Payment",
        "data-ocid": "admin.payments.add_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ap-center",
                className: "block text-xs font-semibold text-foreground mb-1",
                children: "Center *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "ap-center",
                value: form.centerId,
                onChange: (e) => setForm({ ...form, centerId: e.target.value }),
                "data-ocid": "admin.payments.add_modal.center_select",
                className: "input-field w-full",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select center..." }),
                  centers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
                    c.name,
                    " (",
                    c.id,
                    ")"
                  ] }, c.id))
                ]
              }
            )
          ] }),
          [
            {
              id: "ap-inv",
              label: "Invoice Number *",
              key: "invoiceNumber",
              placeholder: "INV-001"
            },
            {
              id: "ap-amt",
              label: "Amount (₹) *",
              key: "amount",
              placeholder: "e.g. 5000",
              type: "number"
            },
            {
              id: "ap-notes",
              label: "Notes",
              key: "notes",
              placeholder: "Payment details"
            }
          ].map(({ id, label, key, placeholder, type }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: id,
                className: "block text-xs font-semibold text-foreground mb-1",
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id,
                type: type ?? "text",
                value: form[key],
                onChange: (e) => setForm({ ...form, [key]: e.target.value }),
                placeholder,
                "data-ocid": `admin.payments.add_modal.${key}_input`,
                className: "input-field w-full"
              }
            )
          ] }, key)),
          formError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs",
              "data-ocid": "admin.payments.add_modal.error_state",
              children: formError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setAddOpen(false);
                  setFormError("");
                },
                "data-ocid": "admin.payments.add_modal.cancel_button",
                className: "btn-secondary flex-1 py-2.5",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => addMutation.mutate(),
                disabled: addMutation.isPending,
                "data-ocid": "admin.payments.add_modal.confirm_button",
                className: "btn-primary flex-1 py-2.5 disabled:opacity-60",
                children: addMutation.isPending ? "Adding..." : "Add Payment"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminPaymentsPage as default
};
