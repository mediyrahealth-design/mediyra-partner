import { u as useAuth, b as useQueryClient, r as reactExports, P as PaymentStatus, j as jsxRuntimeExports, e as CardSkeleton } from "./index-DC8ICoH5.js";
import { c as createLucideIcon, u as useApiService, a as useQuery } from "./api-n3_FsYjY.js";
import { u as useMutation } from "./useMutation-B2ld5fwH.js";
import { A as AdminLayout } from "./AdminLayout-d_yc4e_k.js";
import { E as EmptyState } from "./EmptyState-BedOWtud.js";
import { M as Modal } from "./Modal-ncSFHhz0.js";
import { P as PageHeader } from "./PageHeader-QEyl1Cn6.js";
import { P as Plus } from "./plus-C5zBxfHu.js";
import { C as CircleCheckBig } from "./circle-check-big-BiCm_b-S.js";
import { T as TrendingUp } from "./trending-up-B9P0qwrb.js";
import { C as CreditCard } from "./credit-card-BSgX7_ct.js";
import { F as FileText } from "./log-out-CvArZmaA.js";
import "./x-Dn3CuYsv.js";
import "./building-2-wGjg_aWl.js";
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
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatCurrency(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function PaymentStatusBadge({ status }) {
  if (status === PaymentStatus.paid) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
      "Paid"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-warning bg-warning/10 px-2.5 py-1 rounded-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-warning inline-block" }),
    "Pending"
  ] });
}
function generateInvoiceHTML(payment, centerName) {
  const dateStr = formatDate(payment.date);
  const amount = Number(payment.amount).toLocaleString("en-IN");
  const status = payment.status === PaymentStatus.paid ? "PAID" : "PENDING";
  const statusColor = payment.status === PaymentStatus.paid ? "#16a34a" : "#d97706";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${payment.invoiceNumber} – Mediyra Lab</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Figtree:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Figtree', sans-serif; background: #fff; color: #1e293b; font-size: 14px; }
    .page { max-width: 700px; margin: 0 auto; padding: 40px 48px; }
    .header { background: #1d4ed8; color: #fff; border-radius: 12px 12px 0 0; padding: 28px 36px; display: flex; justify-content: space-between; align-items: center; }
    .header-brand { display: flex; align-items: center; gap: 12px; }
    .header-logo { width: 42px; height: 42px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .header-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header-subtitle { font-size: 12px; opacity: 0.75; margin-top: 2px; }
    .header-inv { text-align: right; }
    .header-inv .inv-label { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
    .header-inv .inv-num { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; margin-top: 2px; }
    .body { border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 32px 36px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }
    .meta-item .label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 4px; }
    .meta-item .value { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; color: #1e293b; }
    .charges-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .charges-table thead tr { background: #f8fafc; }
    .charges-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
    .charges-table th:last-child { text-align: right; }
    .charges-table td { padding: 14px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9; }
    .charges-table td:last-child { text-align: right; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #1e293b; }
    .total-row { display: flex; justify-content: flex-end; margin-top: 4px; }
    .total-box { background: #1d4ed8; color: #fff; border-radius: 10px; padding: 16px 24px; min-width: 200px; text-align: right; }
    .total-box .t-label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.8px; }
    .total-box .t-amount { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; margin-top: 2px; }
    .status-stamp { display: inline-flex; align-items: center; gap: 6px; border: 2px solid ${statusColor}; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: ${statusColor}; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 20px; }
    .notes-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
    .notes-section .n-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 6px; }
    .notes-section .n-text { font-size: 13px; color: #475569; line-height: 1.6; }
    .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.7; }
    @media print {
      body { background: #fff; }
      .no-print { display: none !important; }
      .page { padding: 20px 30px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-brand">
        <div class="header-logo">🧪</div>
        <div>
          <div class="header-title">Mediyra Lab</div>
          <div class="header-subtitle">Pathology &amp; Diagnostics</div>
        </div>
      </div>
      <div class="header-inv">
        <div class="inv-label">Invoice</div>
        <div class="inv-num">#${payment.invoiceNumber}</div>
      </div>
    </div>
    <div class="body">
      <div class="meta-grid">
        <div class="meta-item">
          <div class="label">Bill To</div>
          <div class="value">${centerName}</div>
          <div style="font-size:12px;color:#64748b;margin-top:2px;">Center ID: ${payment.centerId}</div>
        </div>
        <div class="meta-item">
          <div class="label">Invoice Date</div>
          <div class="value">${dateStr}</div>
        </div>
        <div class="meta-item">
          <div class="label">Invoice Number</div>
          <div class="value">#${payment.invoiceNumber}</div>
        </div>
        <div class="meta-item">
          <div class="label">Payment Status</div>
          <div class="status-stamp">${status}</div>
        </div>
      </div>

      <table class="charges-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <div style="font-weight:600;color:#1e293b;">Lab Services Commission</div>
              <div style="font-size:12px;color:#64748b;margin-top:2px;">Collection Center: ${centerName}</div>
            </td>
            <td>₹${amount}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-row">
        <div class="total-box">
          <div class="t-label">Total Amount</div>
          <div class="t-amount">₹${amount}</div>
        </div>
      </div>

      ${payment.notes ? `<div class="notes-section"><div class="n-label">Notes</div><div class="n-text">${payment.notes}</div></div>` : ""}

      <div class="footer">
        <strong>Mediyra Lab</strong> · Pathology &amp; Diagnostics<br/>
        This is a computer-generated invoice. No signature required.<br/>
        For queries, contact accounts@mediyralab.com
      </div>
    </div>

    <div class="no-print" style="margin-top:24px;text-align:center;">
      <button onclick="window.print()" style="background:#1d4ed8;color:#fff;border:none;border-radius:8px;padding:12px 32px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;">
        🖨️ Print / Save as PDF
      </button>
      <button onclick="window.close()" style="background:#f1f5f9;color:#475569;border:none;border-radius:8px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;margin-left:12px;">
        Close
      </button>
    </div>
  </div>
</body>
</html>`;
}
function openInvoice(payment, centerName) {
  const html = generateInvoiceHTML(payment, centerName);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
function StatCard({
  icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `card-elevated p-4 flex items-start gap-3 ${accent ? "border-l-4 border-primary" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium truncate", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mt-0.5 leading-tight", children: value })
        ] })
      ]
    }
  );
}
function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  invoiceNum
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm",
      "data-ocid": "admin.payments.confirm_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6 text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-center text-foreground text-base mb-1", children: "Mark Invoice as Paid?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-center text-muted-foreground mb-6", children: [
          "Invoice ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            "#",
            invoiceNum
          ] }),
          " ",
          "will be marked as paid. This action cannot be undone."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onCancel,
              "data-ocid": "admin.payments.confirm_dialog.cancel_button",
              className: "btn-secondary flex-1 py-2.5 text-sm",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onConfirm,
              "data-ocid": "admin.payments.confirm_dialog.confirm_button",
              className: "btn-primary flex-1 py-2.5 text-sm bg-accent border-accent hover:bg-accent/90",
              children: "Confirm Paid"
            }
          )
        ] })
      ] })
    }
  );
}
function AdminPaymentsPage() {
  var _a;
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
  const [centerSearch, setCenterSearch] = reactExports.useState("");
  const [showDropdown, setShowDropdown] = reactExports.useState(false);
  const [confirmPaymentId, setConfirmPaymentId] = reactExports.useState(null);
  const [confirmInvoiceNum, setConfirmInvoiceNum] = reactExports.useState("");
  const { data: centers = [] } = useQuery({
    queryKey: ["admin.centers", user == null ? void 0 : user.token],
    queryFn: () => api.getCenters(user.token),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const selectedCenterName = selectedCenter === "all" ? "All Centers" : ((_a = centers.find((c) => c.id === selectedCenter)) == null ? void 0 : _a.name) ?? selectedCenter;
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
  const { data: billingStats } = useQuery({
    queryKey: ["admin.billingStats", user == null ? void 0 : user.token, selectedCenter],
    queryFn: () => selectedCenter !== "all" ? api.getBillingStats(user.token, selectedCenter) : Promise.resolve({
      totalTests: BigInt(0),
      totalCommission: BigInt(0),
      lastPayment: void 0
    }),
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
      qc.invalidateQueries({ queryKey: ["admin.billingStats"] });
      setAddOpen(false);
      setForm({ centerId: "", amount: "", invoiceNumber: "", notes: "" });
      setFormError("");
    },
    onError: (e) => setFormError(e.message)
  });
  const markPaidMutation = useMutation({
    mutationFn: async (paymentId) => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      return api.markPaymentPaid(user.token, paymentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.payments"] });
      qc.invalidateQueries({ queryKey: ["admin.billingStats"] });
      setConfirmPaymentId(null);
    }
  });
  const filteredCenters = centers.filter(
    (c) => centerSearch === "" || c.name.toLowerCase().includes(centerSearch.toLowerCase()) || c.id.toLowerCase().includes(centerSearch.toLowerCase())
  );
  const totalPending = payments.filter((p) => p.status === PaymentStatus.pending).reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaid = payments.filter((p) => p.status === PaymentStatus.paid).reduce((sum, p) => sum + Number(p.amount), 0);
  function getCenterNameById(id) {
    var _a2;
    return ((_a2 = centers.find((c) => c.id === id)) == null ? void 0 : _a2.name) ?? id;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Payment Management",
          subtitle: "View partner earnings, add payments, and generate invoices",
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-1 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-warning" }),
            label: "Pending",
            value: formatCurrency(totalPending)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-accent" }),
            label: "Paid Out",
            value: formatCurrency(totalPaid),
            accent: true
          }
        ),
        selectedCenter !== "all" && billingStats ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
              label: "Total Tests",
              value: Number(billingStats.totalTests).toLocaleString("en-IN")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
              label: "Total Commission",
              value: formatCurrency(Number(billingStats.totalCommission))
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-primary" }),
              label: "Total Records",
              value: payments.length.toString()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
              label: "Pending Count",
              value: payments.filter((p) => p.status === PaymentStatus.pending).length.toString()
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-5", "data-ocid": "admin.payments.center_filter", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowDropdown((v) => !v),
            "data-ocid": "admin.payments.center_select",
            className: "input-field w-full text-left flex items-center justify-between",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: selectedCenter === "all" ? "text-muted-foreground" : "text-foreground font-medium",
                  children: selectedCenter === "all" ? "Filter by Collection Center" : selectedCenterName
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  className: "w-4 h-4 text-muted-foreground",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  focusable: "false",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M19 9l-7 7-7-7"
                    }
                  )
                }
              )
            ]
          }
        ),
        showDropdown && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute z-20 left-0 right-0 mt-1 border border-border rounded-xl bg-card shadow-lg overflow-hidden",
            onBlur: () => setShowDropdown(false),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "search",
                  value: centerSearch,
                  onChange: (e) => setCenterSearch(e.target.value),
                  placeholder: "Search centers...",
                  "data-ocid": "admin.payments.center_search_input",
                  className: "input-field w-full text-sm",
                  onClick: (e) => e.stopPropagation()
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-56 overflow-y-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedCenter("all");
                      setCenterSearch("");
                      setShowDropdown(false);
                    },
                    className: "w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border font-medium text-foreground",
                    children: "All Centers"
                  }
                ),
                filteredCenters.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedCenter(c.id);
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
                )),
                filteredCenters.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-3 text-sm text-muted-foreground text-center", children: "No centers found" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-xl border border-border overflow-hidden bg-card shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.payments.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/50 border-b border-border", children: [
          "Invoice #",
          "Collection Center",
          "Amount",
          "Date",
          "Status",
          "Actions"
        ].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: `px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide ${i === 2 ? "text-right" : i === 4 ? "text-center" : i === 5 ? "text-right" : "text-left"}`,
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 6,
            className: "px-4 py-8 text-center text-muted-foreground text-sm",
            "data-ocid": "admin.payments.loading_state",
            children: "Loading payments..."
          }
        ) }) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 6,
            className: "px-4 py-12 text-center",
            "data-ocid": "admin.payments.empty_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-8 h-8 text-muted-foreground/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "No payment records found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "Add a payment entry to get started." })
            ] })
          }
        ) }) : payments.map((pay, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: `border-b border-border last:border-0 hover:bg-muted/20 transition-smooth ${i % 2 === 1 ? "bg-muted/10" : ""}`,
            "data-ocid": `admin.payments.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs font-semibold text-primary", children: [
                "#",
                pay.invoiceNumber
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground text-sm", children: getCenterNameById(pay.centerId) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono", children: pay.centerId })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-foreground", children: [
                "₹",
                Number(pay.amount).toLocaleString("en-IN")
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-sm", children: formatDate(pay.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: pay.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => openInvoice(pay, getCenterNameById(pay.centerId)),
                    "data-ocid": `admin.payments.invoice_button.${i + 1}`,
                    className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-smooth",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3 h-3" }),
                      "Invoice"
                    ]
                  }
                ),
                pay.status === PaymentStatus.pending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setConfirmPaymentId(pay.id);
                      setConfirmInvoiceNum(pay.invoiceNumber);
                    },
                    "data-ocid": `admin.payments.mark_paid_button.${i + 1}`,
                    disabled: markPaidMutation.isPending,
                    className: "inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-lg transition-smooth disabled:opacity-50",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
                      "Mark Paid"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground px-2", children: "—" })
              ] }) })
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
              className: "card-elevated p-4",
              "data-ocid": `admin.payments.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
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
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-primary font-mono", children: [
                        "#",
                        pay.invoiceNumber
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: pay.status })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground mt-0.5", children: getCenterNameById(pay.centerId) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDate(pay.date) }),
                    pay.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: pay.notes })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-sm text-foreground flex-shrink-0", children: [
                    "₹",
                    Number(pay.amount).toLocaleString("en-IN")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 pt-2.5 border-t border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => openInvoice(pay, getCenterNameById(pay.centerId)),
                      "data-ocid": `admin.payments.invoice_button.${i + 1}`,
                      className: "flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5" }),
                        "Generate Invoice"
                      ]
                    }
                  ),
                  pay.status === PaymentStatus.pending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setConfirmPaymentId(pay.id);
                        setConfirmInvoiceNum(pay.invoiceNumber);
                      },
                      "data-ocid": `admin.payments.mark_paid_button.${i + 1}`,
                      className: "flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
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
      ConfirmDialog,
      {
        isOpen: confirmPaymentId !== null,
        invoiceNum: confirmInvoiceNum,
        onConfirm: () => {
          if (confirmPaymentId !== null)
            markPaidMutation.mutate(confirmPaymentId);
        },
        onCancel: () => setConfirmPaymentId(null)
      }
    ),
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
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ap-center",
                className: "block text-xs font-semibold text-foreground mb-1.5",
                children: "Collection Center *"
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ap-inv",
                className: "block text-xs font-semibold text-foreground mb-1.5",
                children: "Invoice Number *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ap-inv",
                type: "text",
                value: form.invoiceNumber,
                onChange: (e) => setForm({ ...form, invoiceNumber: e.target.value }),
                placeholder: "e.g. INV-2024-001",
                "data-ocid": "admin.payments.add_modal.invoiceNumber_input",
                className: "input-field w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ap-amt",
                className: "block text-xs font-semibold text-foreground mb-1.5",
                children: "Amount (₹) *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ap-amt",
                type: "number",
                value: form.amount,
                onChange: (e) => setForm({ ...form, amount: e.target.value }),
                placeholder: "e.g. 5000",
                "data-ocid": "admin.payments.add_modal.amount_input",
                className: "input-field w-full",
                min: "0"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ap-notes",
                className: "block text-xs font-semibold text-foreground mb-1.5",
                children: "Notes"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "ap-notes",
                value: form.notes,
                onChange: (e) => setForm({ ...form, notes: e.target.value }),
                placeholder: "Optional payment details...",
                "data-ocid": "admin.payments.add_modal.notes_input",
                className: "input-field w-full resize-none",
                rows: 3
              }
            )
          ] }),
          formError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2",
              "data-ocid": "admin.payments.add_modal.error_state",
              children: formError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
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
                "data-ocid": "admin.payments.add_modal.submit_button",
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
