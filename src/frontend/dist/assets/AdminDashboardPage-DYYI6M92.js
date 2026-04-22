import { u as useAuth, r as reactExports, j as jsxRuntimeExports } from "./index-DC8ICoH5.js";
import { A as AdminLayout } from "./AdminLayout-d_yc4e_k.js";
import { c as createLucideIcon, u as useApiService } from "./api-n3_FsYjY.js";
import { C as ClipboardList } from "./clipboard-list-CYXuJmZN.js";
import { T as TestTube } from "./test-tube-lmlxbsFr.js";
import { I as IndianRupee } from "./indian-rupee-Cttq3nk2.js";
import { C as CalendarDays } from "./calendar-days-WP3s6UCc.js";
import { L as LoaderCircle } from "./loader-circle-Bn0Hw7i1.js";
import { U as Users } from "./users-eJui1AXv.js";
import { T as TrendingUp } from "./trending-up-B9P0qwrb.js";
import "./log-out-CvArZmaA.js";
import "./x-Dn3CuYsv.js";
import "./building-2-wGjg_aWl.js";
import "./credit-card-BSgX7_ct.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const FileWarning = createLucideIcon("file-warning", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode);
function formatDate(d) {
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function formatCurrency(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function formatBookingDate(ts) {
  const ms = Number(ts) > 1e15 ? Number(ts) / 1e6 : Number(ts);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
const STATUS_LABEL = {
  sampleCollected: "Collected",
  sampleReceived: "Received",
  processing: "Processing",
  reportReady: "Report Ready"
};
function StatusBadge({ status }) {
  const label = STATUS_LABEL[status] ?? status;
  if (status === "reportReady")
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success", children: label });
  if (status === "processing")
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-warning/15 px-2 py-1 text-xs font-semibold text-warning", children: label });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary", children: label });
}
function StatSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card animate-pulse", "aria-hidden": true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-24 rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-20 rounded bg-muted mb-1" })
  ] });
}
function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  highlight,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `stat-card group ${highlight ? "bg-primary border-primary/80 shadow-lg" : ""}`,
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-xs font-semibold uppercase tracking-wider ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`,
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? "bg-primary-foreground/15" : iconBg}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon,
                {
                  className: `w-5 h-5 ${highlight ? "text-primary-foreground" : iconColor}`
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-3xl font-bold font-display leading-none ${highlight ? "text-primary-foreground" : "text-foreground"}`,
              children: value
            }
          ),
          trend && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs font-semibold mb-0.5 flex items-center gap-0.5 ${highlight ? "text-primary-foreground/80" : "text-accent"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }),
                trend
              ]
            }
          )
        ] })
      ]
    }
  );
}
function QuickAction({
  title,
  desc,
  href,
  icon: Icon,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href,
      className: "flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-smooth group",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm font-display truncate", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5 truncate", children: desc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-smooth flex-shrink-0" })
      ]
    }
  );
}
function AdminDashboardPage() {
  const { user } = useAuth();
  const api = useApiService();
  const [stats, setStats] = reactExports.useState(null);
  const [patients, setPatients] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const token = user.token;
    const getDashboardStats = api.getDashboardStats;
    const getAllPatients = api.getAllPatients;
    async function load() {
      try {
        const [s, p] = await Promise.all([
          getDashboardStats(token),
          getAllPatients(token)
        ]);
        if (cancelled) return;
        setStats(s);
        const sorted = [...p].sort((a, b) => Number(b.bookingDate) - Number(a.bookingDate)).slice(0, 5);
        setPatients(sorted);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, api.getDashboardStats, api.getAllPatients]);
  const today = formatDate(/* @__PURE__ */ new Date());
  const statCards = [
    {
      label: "Total Bookings",
      value: error || !stats ? "--" : stats.totalBookings.toLocaleString("en-IN"),
      icon: ClipboardList,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      ocid: "admin_dashboard.stat_card.1"
    },
    {
      label: "Today's Samples",
      value: error || !stats ? "--" : stats.todaysSamples.toLocaleString("en-IN"),
      icon: TestTube,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      ocid: "admin_dashboard.stat_card.2"
    },
    {
      label: "Reports Pending",
      value: error || !stats ? "--" : stats.pendingReports.toLocaleString("en-IN"),
      icon: FileWarning,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      ocid: "admin_dashboard.stat_card.3"
    },
    {
      label: "Monthly Revenue",
      value: error || !stats ? "--" : formatCurrency(stats.thisMonthRevenue),
      icon: IndianRupee,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      highlight: true,
      ocid: "admin_dashboard.stat_card.4"
    }
  ];
  const quickActions = [
    {
      title: "Manage Bookings",
      desc: "View, update status & upload reports",
      href: "/admin/bookings",
      icon: ClipboardList,
      ocid: "admin_dashboard.quick_action.bookings"
    },
    {
      title: "Manage Centers",
      desc: "Add and configure partner collection centers",
      href: "/admin/centers",
      icon: Users,
      ocid: "admin_dashboard.quick_action.centers"
    },
    {
      title: "View Analytics",
      desc: "Daily bookings, revenue & partner performance",
      href: "/admin/analytics",
      icon: LayoutGrid,
      ocid: "admin_dashboard.quick_action.analytics"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-7xl mx-auto space-y-7",
      "data-ocid": "admin_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl text-foreground leading-tight", children: [
              "Welcome back, ",
              (user == null ? void 0 : user.userId) ?? "Admin"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4" }),
              today
            ] })
          ] }),
          loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-lg bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
            "Loading data…"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
            "data-ocid": "admin_dashboard.stats_section",
            children: loading ? ["s1", "s2", "s3", "s4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatSkeleton, {}, k)) : statCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...card }, card.label))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "admin_dashboard.quick_actions_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-base mb-3", children: "Quick Actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: quickActions.map((qa) => /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { ...qa }, qa.title)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            className: "bg-card rounded-xl border border-border shadow-sm overflow-hidden",
            "data-ocid": "admin_dashboard.recent_activity_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-base", children: "Recent Bookings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: "Latest patient test bookings across all centers" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: "/admin/bookings",
                    className: "text-primary text-sm font-semibold hover:underline transition-smooth flex items-center gap-1",
                    "data-ocid": "admin_dashboard.view_all_bookings_link",
                    children: [
                      "View all ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                "Loading bookings…"
              ] }) : patients.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-12 text-muted-foreground text-sm",
                  "data-ocid": "admin_dashboard.bookings_empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-8 h-8 mb-2 opacity-40" }),
                    "No bookings yet"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "table",
                {
                  className: "w-full",
                  "data-ocid": "admin_dashboard.bookings_table",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header", children: "Patient ID" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header", children: "Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header hidden md:table-cell", children: "Center" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header hidden lg:table-cell text-right", children: "Tests" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header hidden sm:table-cell", children: "Date" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header", children: "Status" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: patients.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: `hover:bg-muted/30 transition-smooth ${i % 2 === 1 ? "bg-muted/10" : ""}`,
                        "data-ocid": `admin_dashboard.booking_row.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell font-mono text-xs font-semibold text-primary", children: p.id }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell font-medium truncate max-w-[140px]", children: p.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell hidden md:table-cell text-muted-foreground truncate max-w-[120px]", children: p.centerId }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell hidden lg:table-cell text-right text-muted-foreground", children: p.testIds.length }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell hidden sm:table-cell text-muted-foreground", children: formatBookingDate(p.bookingDate) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: String(p.status) }) })
                        ]
                      },
                      p.id
                    )) })
                  ]
                }
              ) })
            ]
          }
        )
      ]
    }
  ) });
}
export {
  AdminDashboardPage as default
};
