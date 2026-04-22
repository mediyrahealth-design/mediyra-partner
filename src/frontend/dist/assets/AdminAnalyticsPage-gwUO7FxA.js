import { u as useAuth, r as reactExports, j as jsxRuntimeExports } from "./index-DC8ICoH5.js";
import { A as AdminLayout, C as ChartColumn } from "./AdminLayout-d_yc4e_k.js";
import { c as createLucideIcon, u as useApiService } from "./api-n3_FsYjY.js";
import { C as Calendar } from "./calendar-CKmBxPt1.js";
import { D as Download } from "./download-44AthqLy.js";
import { L as LoaderCircle } from "./loader-circle-Bn0Hw7i1.js";
import { T as TrendingUp } from "./trending-up-B9P0qwrb.js";
import { U as Users } from "./users-eJui1AXv.js";
import { C as ChevronDown } from "./chevron-down-CQGfTeUJ.js";
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
const __iconNode$3 = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
  ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
];
const ChevronsUpDown = createLucideIcon("chevrons-up-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
function toDateStr(nanos) {
  return new Date(Number(nanos / 1000000n)).toISOString().slice(0, 10);
}
function formatINR(value) {
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
  if (value >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}
function cutoffDate(range) {
  if (range === "all") return null;
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - Number.parseInt(range, 10));
  d.setHours(0, 0, 0, 0);
  return d;
}
function SortIcon({
  column,
  sortKey,
  sortDir
}) {
  if (column !== sortKey)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "w-3.5 h-3.5 text-muted-foreground/50 ml-1 inline" });
  return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5 ml-1 inline text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 ml-1 inline text-primary" });
}
function AdminAnalyticsPage() {
  const { user } = useAuth();
  const token = (user == null ? void 0 : user.token) ?? "";
  const api = useApiService();
  const [patients, setPatients] = reactExports.useState([]);
  const [tests, setTests] = reactExports.useState([]);
  const [centers, setCenters] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [dateRange, setDateRange] = reactExports.useState("30");
  const [sortKey, setSortKey] = reactExports.useState("bookings");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  reactExports.useEffect(() => {
    if (!token) return;
    const getAllPatients = api.getAllPatients;
    const getTests = api.getTests;
    const getCenters = api.getCenters;
    setLoading(true);
    Promise.all([getAllPatients(token), getTests(), getCenters(token)]).then(([p, t, c]) => {
      setPatients(p);
      setTests(t);
      setCenters(c);
    }).finally(() => setLoading(false));
  }, [token, api.getAllPatients, api.getTests, api.getCenters]);
  const testMap = reactExports.useMemo(
    () => new Map(tests.map((t) => [t.id.toString(), t])),
    [tests]
  );
  const centerMap = reactExports.useMemo(
    () => new Map(centers.map((c) => [c.id, c])),
    [centers]
  );
  const filteredPatients = reactExports.useMemo(() => {
    const cutoff = cutoffDate(dateRange);
    if (!cutoff) return patients;
    return patients.filter((p) => new Date(toDateStr(p.bookingDate)) >= cutoff);
  }, [patients, dateRange]);
  const dailyData = reactExports.useMemo(() => {
    var _a, _b;
    const map = {};
    for (const p of filteredPatients) {
      const dateStr = toDateStr(p.bookingDate);
      if (!map[dateStr]) map[dateStr] = { count: 0, revenue: 0 };
      map[dateStr].count += 1;
      const rev = p.testIds.reduce((sum, id) => {
        const t = testMap.get(id.toString());
        return sum + (t ? Number(t.partnerPrice) : 0);
      }, 0);
      map[dateStr].revenue += rev;
    }
    const days = dateRange === "all" ? 90 : Number.parseInt(dateRange, 10);
    const entries = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      entries.push({
        date: key,
        count: ((_a = map[key]) == null ? void 0 : _a.count) ?? 0,
        revenue: ((_b = map[key]) == null ? void 0 : _b.revenue) ?? 0
      });
    }
    return entries;
  }, [filteredPatients, testMap, dateRange]);
  const testStats = reactExports.useMemo(() => {
    const map = {};
    for (const p of filteredPatients) {
      for (const testId of p.testIds) {
        const key = testId.toString();
        const t = testMap.get(key);
        if (!map[key])
          map[key] = {
            name: (t == null ? void 0 : t.name) ?? `Test #${key}`,
            bookings: 0,
            revenue: 0
          };
        map[key].bookings += 1;
        map[key].revenue += t ? Number(t.partnerPrice) : 0;
      }
    }
    return Object.entries(map).map(([id, v]) => ({ testId: BigInt(id), ...v })).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [filteredPatients, testMap]);
  const maxTestRevenue = reactExports.useMemo(
    () => Math.max(1, ...testStats.map((t) => t.revenue)),
    [testStats]
  );
  const partnerStats = reactExports.useMemo(() => {
    const map = {};
    for (const p of filteredPatients) {
      if (!map[p.centerId])
        map[p.centerId] = { bookings: 0, revenue: 0, lastBooking: "" };
      map[p.centerId].bookings += 1;
      const rev = p.testIds.reduce((sum, id) => {
        const t = testMap.get(id.toString());
        return sum + (t ? Number(t.partnerPrice) : 0);
      }, 0);
      map[p.centerId].revenue += rev;
      const dateStr = toDateStr(p.bookingDate);
      if (!map[p.centerId].lastBooking || dateStr > map[p.centerId].lastBooking) {
        map[p.centerId].lastBooking = dateStr;
      }
    }
    return Object.entries(map).map(([centerId, v]) => {
      const center = centerMap.get(centerId);
      return {
        centerId,
        name: (center == null ? void 0 : center.name) ?? centerId,
        bookings: v.bookings,
        revenue: v.revenue,
        lastBooking: v.lastBooking,
        active: (center == null ? void 0 : center.status) === "active"
      };
    });
  }, [filteredPatients, testMap, centerMap]);
  const sortedPartners = reactExports.useMemo(() => {
    const sorted = [...partnerStats].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "bookings") cmp = a.bookings - b.bookings;
      else if (sortKey === "revenue") cmp = a.revenue - b.revenue;
      else if (sortKey === "lastBooking")
        cmp = a.lastBooking.localeCompare(b.lastBooking);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [partnerStats, sortKey, sortDir]);
  const totalBookings = filteredPatients.length;
  const totalRevenue = reactExports.useMemo(
    () => filteredPatients.reduce(
      (sum, p) => sum + p.testIds.reduce((s, id) => {
        const t = testMap.get(id.toString());
        return s + (t ? Number(t.partnerPrice) : 0);
      }, 0),
      0
    ),
    [filteredPatients, testMap]
  );
  const activeCenters = centers.filter((c) => c.status === "active").length;
  const avgBookingsPerDay = dailyData.length > 0 ? (totalBookings / Math.max(1, dailyData.filter((d) => d.count > 0).length)).toFixed(1) : "0";
  const handleSort = reactExports.useCallback(
    (key) => {
      if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
      else {
        setSortKey(key);
        setSortDir("desc");
      }
    },
    [sortKey]
  );
  const exportCSV = reactExports.useCallback(() => {
    const lines = [];
    lines.push("DAILY BOOKINGS");
    lines.push("Date,Bookings,Revenue (INR)");
    for (const d of dailyData) {
      lines.push(`${d.date},${d.count},${d.revenue}`);
    }
    lines.push("");
    lines.push("TEST-WISE REVENUE");
    lines.push("Test Name,Bookings,Revenue (INR)");
    for (const t of testStats) {
      lines.push(`"${t.name}",${t.bookings},${t.revenue}`);
    }
    lines.push("");
    lines.push("PARTNER PERFORMANCE");
    lines.push("Center Name,Total Bookings,Revenue (INR),Last Booking,Status");
    for (const p of sortedPartners) {
      lines.push(
        `"${p.name}",${p.bookings},${p.revenue},${p.lastBooking},${p.active ? "Active" : "Inactive"}`
      );
    }
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dailyData, testStats, sortedPartners]);
  const rangeLabels = {
    "7": "Last 7 Days",
    "30": "Last 30 Days",
    "90": "Last 90 Days",
    all: "All Time"
  };
  const displayedDailyData = reactExports.useMemo(() => {
    if (dateRange === "7") return dailyData;
    if (dateRange === "30") return dailyData;
    if (dateRange === "90") {
      const weekly = [];
      for (let i = 0; i < dailyData.length; i += 7) {
        const slice = dailyData.slice(i, i + 7);
        weekly.push({
          date: slice[0].date,
          count: slice.reduce((s, d) => s + d.count, 0),
          revenue: slice.reduce((s, d) => s + d.revenue, 0)
        });
      }
      return weekly;
    }
    return dailyData;
  }, [dailyData, dateRange]);
  const displayedMax = reactExports.useMemo(
    () => Math.max(1, ...displayedDailyData.map((d) => d.count)),
    [displayedDailyData]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-7xl mx-auto space-y-6",
      "data-ocid": "admin_analytics.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Analytics & Insights" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Performance data across bookings, tests, and partners" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1 bg-card border border-border rounded-lg p-1",
                "data-ocid": "admin_analytics.date_range_filter",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-muted-foreground ml-1.5" }),
                  ["7", "30", "90", "all"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDateRange(r),
                      onKeyDown: (e) => {
                        if (e.key === "Enter" || e.key === " ") setDateRange(r);
                      },
                      "data-ocid": `admin_analytics.range_${r}.tab`,
                      className: `px-3 py-1 rounded-md text-xs font-semibold transition-smooth ${dateRange === r ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`,
                      children: r === "7" ? "7D" : r === "30" ? "30D" : r === "90" ? "90D" : "All"
                    },
                    r
                  ))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: exportCSV,
                disabled: loading,
                "data-ocid": "admin_analytics.export_csv_button",
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-smooth disabled:opacity-50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                  "Export CSV"
                ]
              }
            )
          ] })
        ] }),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-center py-16 text-muted-foreground gap-2",
            "data-ocid": "admin_analytics.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Loading analytics…" })
            ]
          }
        ),
        !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
              "data-ocid": "admin_analytics.summary_section",
              children: [
                {
                  label: "Total Bookings",
                  value: totalBookings.toLocaleString("en-IN"),
                  sub: `${rangeLabels[dateRange]}`,
                  icon: ChartColumn,
                  up: true
                },
                {
                  label: "Total Revenue",
                  value: formatINR(totalRevenue),
                  sub: "Partner price basis",
                  icon: TrendingUp,
                  up: true
                },
                {
                  label: "Active Centers",
                  value: String(activeCenters),
                  sub: `of ${centers.length} total`,
                  icon: Users,
                  up: true
                },
                {
                  label: "Avg Bookings/Day",
                  value: avgBookingsPerDay,
                  sub: "Active days only",
                  icon: Calendar,
                  up: Number.parseFloat(avgBookingsPerDay) >= 5
                }
              ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "stat-card",
                  "data-ocid": `admin_analytics.stat.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: stat.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "w-4 h-4 text-primary" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground", children: stat.value }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: stat.sub })
                  ]
                },
                stat.label
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card rounded-xl border border-border p-6",
              "data-ocid": "admin_analytics.daily_chart",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-lg", children: "Daily Bookings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md", children: [
                    totalBookings.toLocaleString("en-IN"),
                    " total bookings in",
                    " ",
                    rangeLabels[dateRange].toLowerCase()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-5", children: dateRange === "90" || dateRange === "all" ? "Weekly aggregates shown" : "Daily booking volume" }),
                totalBookings === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center h-36 text-muted-foreground gap-2",
                    "data-ocid": "admin_analytics.daily_chart.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-8 h-8 opacity-30" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No bookings in this period" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1 h-36 min-w-max", children: displayedDailyData.map((d, i) => {
                    const heightPct = d.count / displayedMax * 100;
                    const label = dateRange === "7" ? new Date(d.date).toLocaleDateString("en-IN", {
                      weekday: "short"
                    }) : dateRange === "30" ? new Date(d.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short"
                    }) : new Date(d.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short"
                    });
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex flex-col items-center gap-1 group",
                        style: {
                          width: dateRange === "7" ? "60px" : dateRange === "30" ? "28px" : "40px"
                        },
                        "data-ocid": `admin_analytics.bar.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth", children: d.count }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "w-full rounded-t-sm bg-primary/70 hover:bg-primary transition-smooth relative",
                              style: { height: `${Math.max(heightPct, 3)}%` },
                              title: `${d.date}: ${d.count} bookings`
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-[10px] text-muted-foreground whitespace-nowrap",
                              style: { fontSize: "9px" },
                              children: label
                            }
                          )
                        ]
                      },
                      d.date
                    );
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-2 text-[10px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: Math.round(displayedMax / 2) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: displayedMax })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card rounded-xl border border-border overflow-hidden",
                "data-ocid": "admin_analytics.test_revenue_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-lg", children: "Test-wise Revenue" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: "Top 8 tests by partner revenue" })
                  ] }),
                  testStats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex flex-col items-center justify-center py-12 text-muted-foreground gap-2",
                      "data-ocid": "admin_analytics.test_revenue_section.empty_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-8 h-8 opacity-30" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No test data in this period" })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 space-y-3", children: testStats.map((t, i) => {
                    const pct = Math.round(
                      t.revenue / maxTestRevenue * 100
                    );
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `admin_analytics.test_row.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-sm font-medium text-foreground truncate max-w-[55%]",
                                title: t.name,
                                children: t.name
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-right shrink-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                                t.bookings,
                                " bookings"
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground tabular-nums", children: formatINR(t.revenue) })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "h-full rounded-full transition-smooth bg-primary",
                              style: {
                                width: `${pct}%`,
                                opacity: 0.6 + 0.4 * (1 - i / testStats.length)
                              }
                            }
                          ) })
                        ]
                      },
                      t.testId.toString()
                    );
                  }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card rounded-xl border border-border overflow-hidden",
                "data-ocid": "admin_analytics.partner_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-lg", children: "Partner Performance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mt-0.5", children: [
                        sortedPartners.length,
                        " collection centers"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-4 h-4 text-muted-foreground" })
                  ] }),
                  sortedPartners.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex flex-col items-center justify-center py-12 text-muted-foreground gap-2",
                      "data-ocid": "admin_analytics.partner_section.empty_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 opacity-30" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No partner data in this period" })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "th",
                        {
                          className: "table-header cursor-pointer select-none hover:text-primary",
                          onClick: () => handleSort("name"),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") handleSort("name");
                          },
                          "data-ocid": "admin_analytics.partner_table.sort_name",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                            "Partner",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SortIcon,
                              {
                                column: "name",
                                sortKey,
                                sortDir
                              }
                            )
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "th",
                        {
                          className: "table-header cursor-pointer select-none hover:text-primary text-right",
                          onClick: () => handleSort("bookings"),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") handleSort("bookings");
                          },
                          "data-ocid": "admin_analytics.partner_table.sort_bookings",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end", children: [
                            "Bookings",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SortIcon,
                              {
                                column: "bookings",
                                sortKey,
                                sortDir
                              }
                            )
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "th",
                        {
                          className: "table-header cursor-pointer select-none hover:text-primary text-right",
                          onClick: () => handleSort("revenue"),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") handleSort("revenue");
                          },
                          "data-ocid": "admin_analytics.partner_table.sort_revenue",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end", children: [
                            "Revenue",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SortIcon,
                              {
                                column: "revenue",
                                sortKey,
                                sortDir
                              }
                            )
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "th",
                        {
                          className: "table-header cursor-pointer select-none hover:text-primary text-right",
                          onClick: () => handleSort("lastBooking"),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") handleSort("lastBooking");
                          },
                          "data-ocid": "admin_analytics.partner_table.sort_last_booking",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end", children: [
                            "Last Booking",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SortIcon,
                              {
                                column: "lastBooking",
                                sortKey,
                                sortDir
                              }
                            )
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header text-right", children: "Status" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedPartners.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: "hover:bg-muted/30 transition-smooth",
                        "data-ocid": `admin_analytics.partner_row.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-primary", children: p.name.slice(0, 2).toUpperCase() }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-medium truncate max-w-[120px]",
                                title: p.name,
                                children: p.name
                              }
                            )
                          ] }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell text-right tabular-nums text-muted-foreground font-medium", children: p.bookings.toLocaleString("en-IN") }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell text-right tabular-nums font-semibold text-foreground", children: formatINR(p.revenue) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell text-right text-xs text-muted-foreground", children: p.lastBooking ? new Date(p.lastBooking).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit"
                            }
                          ) : "—" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell text-right", children: p.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-success inline-flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }),
                            " Active"
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-error inline-flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3" }),
                            " Inactive"
                          ] }) })
                        ]
                      },
                      p.centerId
                    )) })
                  ] }) })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
export {
  AdminAnalyticsPage as default
};
