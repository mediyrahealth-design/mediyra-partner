import { u as useAuth, r as reactExports, j as jsxRuntimeExports, e as CardSkeleton, P as PaymentStatus } from "./index-DC8ICoH5.js";
import { c as createLucideIcon, u as useApiService, a as useQuery } from "./api-n3_FsYjY.js";
import { P as PartnerLayout } from "./PartnerLayout-CTHtkMyk.js";
import { E as EmptyState } from "./EmptyState-BedOWtud.js";
import { P as PageHeader } from "./PageHeader-QEyl1Cn6.js";
import { T as TrendingUp } from "./trending-up-B9P0qwrb.js";
import { I as IndianRupee } from "./indian-rupee-Cttq3nk2.js";
import { C as CalendarDays } from "./calendar-days-WP3s6UCc.js";
import { C as ChevronDown } from "./chevron-down-CQGfTeUJ.js";
import { C as CircleCheck } from "./circle-check-D37CQIOC.js";
import "./log-out-CvArZmaA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock4 = createLucideIcon("clock-4", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
];
const Receipt = createLucideIcon("receipt", __iconNode);
function formatINR(amount) {
  return Number(amount).toLocaleString("en-IN");
}
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function getMonthYear(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
}
function getMonthKey(ts) {
  const d = new Date(Number(ts));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function StatCard({ icon, iconBg, label, value, sub, ocid }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-4 flex flex-col gap-3", "data-ocid": ocid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium leading-tight", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground mt-0.5 leading-none", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 truncate", children: sub })
    ] })
  ] });
}
function PaymentRow({ payment, index }) {
  const isPaid = payment.status === PaymentStatus.paid;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "card-elevated p-4 flex items-center gap-3",
      "data-ocid": `billing.payment.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isPaid ? "bg-accent/10" : "bg-warning/10"}`,
            children: isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock4, { className: "w-5 h-5 text-warning" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground truncate", children: [
            "Invoice #",
            payment.invoiceNumber
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatDate(payment.date) }),
          payment.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: payment.notes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-base text-foreground", children: [
            "₹",
            formatINR(payment.amount)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-[10px] font-semibold px-2.5 py-0.5 rounded-full leading-tight ${isPaid ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"}`,
              "data-ocid": `billing.payment.status.${index}`,
              children: isPaid ? "Paid" : "Pending"
            }
          )
        ] })
      ]
    }
  );
}
function BillingPage() {
  var _a;
  const { user } = useAuth();
  const api = useApiService();
  const [selectedMonth, setSelectedMonth] = reactExports.useState("all");
  const [filterOpen, setFilterOpen] = reactExports.useState(false);
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["billingStats", user == null ? void 0 : user.token, user == null ? void 0 : user.userId],
    queryFn: () => api.getBillingStats(user.token, user.userId),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", user == null ? void 0 : user.token, user == null ? void 0 : user.userId],
    queryFn: () => api.getPaymentsByCenter(user.token, user.userId),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const monthOptions = Array.from(
    new Map(
      payments.map((p) => [getMonthKey(p.date), getMonthYear(p.date)])
    ).entries()
  ).sort((a, b) => b[0].localeCompare(a[0]));
  const filteredPayments = selectedMonth === "all" ? payments : payments.filter((p) => getMonthKey(p.date) === selectedMonth);
  const lastPaymentSub = (stats == null ? void 0 : stats.lastPayment) ? `${formatDate(stats.lastPayment.date)} · ₹${formatINR(stats.lastPayment.amount)}` : "No payments yet";
  const selectedLabel = selectedMonth === "all" ? "All Time" : ((_a = monthOptions.find(([k]) => k === selectedMonth)) == null ? void 0 : _a[1]) ?? "All Time";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PartnerLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Billing & Earnings",
        subtitle: "Commission summary and payment records"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-6 flex flex-col gap-4", children: [
      statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "billing.stats_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-primary" }),
              iconBg: "bg-primary/10",
              label: "Total Tests Sent",
              value: (stats == null ? void 0 : stats.totalTests.toString()) ?? "0",
              ocid: "billing.stat.total_tests"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-5 h-5 text-accent" }),
              iconBg: "bg-accent/10",
              label: "Total Commission",
              value: `₹${formatINR((stats == null ? void 0 : stats.totalCommission) ?? BigInt(0))}`,
              ocid: "billing.stat.total_commission"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-5 h-5 text-warning" }),
            iconBg: "bg-warning/10",
            label: "Last Payment",
            value: (stats == null ? void 0 : stats.lastPayment) ? `₹${formatINR(stats.lastPayment.amount)}` : "—",
            sub: lastPaymentSub,
            ocid: "billing.stat.last_payment"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-4 h-4 text-primary" }),
          "Payment History"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full transition-smooth hover:bg-primary/15 active:bg-primary/20",
              type: "button",
              onClick: () => setFilterOpen((v) => !v),
              "aria-expanded": filterOpen,
              "data-ocid": "billing.month_filter.toggle",
              children: [
                selectedLabel,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronDown,
                  {
                    className: `w-3.5 h-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`
                  }
                )
              ]
            }
          ),
          filterOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute right-0 top-8 z-20 w-44 card-elevated py-1 shadow-lg",
              "data-ocid": "billing.month_filter.dropdown",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: `w-full text-left px-4 py-2 text-xs font-medium transition-smooth hover:bg-muted ${selectedMonth === "all" ? "text-primary font-semibold" : "text-foreground"}`,
                    onClick: () => {
                      setSelectedMonth("all");
                      setFilterOpen(false);
                    },
                    "data-ocid": "billing.month_filter.option.all",
                    children: "All Time"
                  }
                ),
                monthOptions.map(([key, label], idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: `w-full text-left px-4 py-2 text-xs font-medium transition-smooth hover:bg-muted ${selectedMonth === key ? "text-primary font-semibold" : "text-foreground"}`,
                    onClick: () => {
                      setSelectedMonth(key);
                      setFilterOpen(false);
                    },
                    "data-ocid": `billing.month_filter.option.${idx + 1}`,
                    children: label
                  },
                  key
                ))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-2.5",
          "data-ocid": "billing.payments_list",
          children: paymentsLoading ? ["psk1", "psk2", "psk3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}, k)) : filteredPayments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-7 h-7" }),
              title: "No payments yet",
              description: selectedMonth === "all" ? "Your payment history will appear here once the lab processes a payment." : "No payments found for the selected month.",
              "data-ocid": "billing.empty_state"
            }
          ) : filteredPayments.map((pay, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentRow, { payment: pay, index: i + 1 }, pay.id.toString()))
        }
      )
    ] })
  ] });
}
export {
  BillingPage as default
};
