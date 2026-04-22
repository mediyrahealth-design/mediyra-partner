import {
  ArrowUpDown,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  Loader2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type {
  CollectionCenterPublic,
  LabTest,
  PatientPublic,
} from "../../types";

// ─── Types ──────────────────────────────────────────────────────────────────
type DateRange = "7" | "30" | "90" | "all";
type SortKey = "name" | "bookings" | "revenue" | "lastBooking";
type SortDir = "asc" | "desc";

interface DailyEntry {
  date: string; // YYYY-MM-DD
  count: number;
  revenue: number;
}

interface TestStat {
  testId: bigint;
  name: string;
  bookings: number;
  revenue: number;
}

interface PartnerStat {
  centerId: string;
  name: string;
  bookings: number;
  revenue: number;
  lastBooking: string;
  active: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toDateStr(nanos: bigint): string {
  return new Date(Number(nanos / 1_000_000n)).toISOString().slice(0, 10);
}

function formatINR(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function cutoffDate(range: DateRange): Date | null {
  if (range === "all") return null;
  const d = new Date();
  d.setDate(d.getDate() - Number.parseInt(range, 10));
  d.setHours(0, 0, 0, 0);
  return d;
}

function SortIcon({
  column,
  sortKey,
  sortDir,
}: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey)
    return (
      <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50 ml-1 inline" />
    );
  return sortDir === "asc" ? (
    <ChevronUp className="w-3.5 h-3.5 ml-1 inline text-primary" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 ml-1 inline text-primary" />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const token = user?.token ?? "";
  const api = useApiService();

  const [patients, setPatients] = useState<PatientPublic[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [centers, setCenters] = useState<CollectionCenterPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("30");
  const [sortKey, setSortKey] = useState<SortKey>("bookings");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    if (!token) return;
    const getAllPatients = api.getAllPatients;
    const getTests = api.getTests;
    const getCenters = api.getCenters;
    setLoading(true);
    Promise.all([getAllPatients(token), getTests(), getCenters(token)])
      .then(([p, t, c]) => {
        setPatients(p);
        setTests(t);
        setCenters(c);
      })
      .finally(() => setLoading(false));
  }, [token, api.getAllPatients, api.getTests, api.getCenters]);

  // Test lookup map
  const testMap = useMemo(
    () => new Map(tests.map((t) => [t.id.toString(), t])),
    [tests],
  );

  // Center lookup map
  const centerMap = useMemo(
    () => new Map(centers.map((c) => [c.id, c])),
    [centers],
  );

  // Filter patients by date range
  const filteredPatients = useMemo(() => {
    const cutoff = cutoffDate(dateRange);
    if (!cutoff) return patients;
    return patients.filter((p) => new Date(toDateStr(p.bookingDate)) >= cutoff);
  }, [patients, dateRange]);

  // ─── Daily bookings ───────────────────────────────────────────────────────
  const dailyData = useMemo((): DailyEntry[] => {
    const map: Record<string, { count: number; revenue: number }> = {};

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

    // Build a continuous list of dates within the range
    const days = dateRange === "all" ? 90 : Number.parseInt(dateRange, 10);
    const entries: DailyEntry[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      entries.push({
        date: key,
        count: map[key]?.count ?? 0,
        revenue: map[key]?.revenue ?? 0,
      });
    }
    return entries;
  }, [filteredPatients, testMap, dateRange]);

  const _maxDailyCount = 0; // replaced by displayedMax below

  // ─── Test-wise revenue ────────────────────────────────────────────────────
  const testStats = useMemo((): TestStat[] => {
    const map: Record<
      string,
      { name: string; bookings: number; revenue: number }
    > = {};

    for (const p of filteredPatients) {
      for (const testId of p.testIds) {
        const key = testId.toString();
        const t = testMap.get(key);
        if (!map[key])
          map[key] = {
            name: t?.name ?? `Test #${key}`,
            bookings: 0,
            revenue: 0,
          };
        map[key].bookings += 1;
        map[key].revenue += t ? Number(t.partnerPrice) : 0;
      }
    }

    return Object.entries(map)
      .map(([id, v]) => ({ testId: BigInt(id), ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredPatients, testMap]);

  const maxTestRevenue = useMemo(
    () => Math.max(1, ...testStats.map((t) => t.revenue)),
    [testStats],
  );

  // ─── Partner performance ──────────────────────────────────────────────────
  const partnerStats = useMemo((): PartnerStat[] => {
    const map: Record<
      string,
      { bookings: number; revenue: number; lastBooking: string }
    > = {};

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
      if (
        !map[p.centerId].lastBooking ||
        dateStr > map[p.centerId].lastBooking
      ) {
        map[p.centerId].lastBooking = dateStr;
      }
    }

    return Object.entries(map).map(([centerId, v]) => {
      const center = centerMap.get(centerId);
      return {
        centerId,
        name: center?.name ?? centerId,
        bookings: v.bookings,
        revenue: v.revenue,
        lastBooking: v.lastBooking,
        active: center?.status === "active",
      };
    });
  }, [filteredPatients, testMap, centerMap]);

  const sortedPartners = useMemo(() => {
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

  // ─── Summary stats ────────────────────────────────────────────────────────
  const totalBookings = filteredPatients.length;
  const totalRevenue = useMemo(
    () =>
      filteredPatients.reduce(
        (sum, p) =>
          sum +
          p.testIds.reduce((s, id) => {
            const t = testMap.get(id.toString());
            return s + (t ? Number(t.partnerPrice) : 0);
          }, 0),
        0,
      ),
    [filteredPatients, testMap],
  );
  const activeCenters = centers.filter((c) => c.status === "active").length;
  const avgBookingsPerDay =
    dailyData.length > 0
      ? (
          totalBookings /
          Math.max(1, dailyData.filter((d) => d.count > 0).length)
        ).toFixed(1)
      : "0";

  // ─── Sort handler ─────────────────────────────────────────────────────────
  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else {
        setSortKey(key);
        setSortDir("desc");
      }
    },
    [sortKey],
  );

  // ─── CSV Export ───────────────────────────────────────────────────────────
  const exportCSV = useCallback(() => {
    const lines: string[] = [];

    // Daily bookings section
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
        `"${p.name}",${p.bookings},${p.revenue},${p.lastBooking},${p.active ? "Active" : "Inactive"}`,
      );
    }

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dailyData, testStats, sortedPartners]);

  // ─── Range label ─────────────────────────────────────────────────────────
  const rangeLabels: Record<DateRange, string> = {
    "7": "Last 7 Days",
    "30": "Last 30 Days",
    "90": "Last 90 Days",
    all: "All Time",
  };

  // ─── Render daily chart (show max 30 bars to avoid clutter) ───────────────
  const displayedDailyData = useMemo(() => {
    if (dateRange === "7") return dailyData;
    if (dateRange === "30") return dailyData;
    if (dateRange === "90") {
      // Show weekly aggregates
      const weekly: DailyEntry[] = [];
      for (let i = 0; i < dailyData.length; i += 7) {
        const slice = dailyData.slice(i, i + 7);
        weekly.push({
          date: slice[0].date,
          count: slice.reduce((s, d) => s + d.count, 0),
          revenue: slice.reduce((s, d) => s + d.revenue, 0),
        });
      }
      return weekly;
    }
    // All time: bin the last 90 days weekly too
    return dailyData;
  }, [dailyData, dateRange]);

  const displayedMax = useMemo(
    () => Math.max(1, ...displayedDailyData.map((d) => d.count)),
    [displayedDailyData],
  );

  return (
    <AdminLayout>
      <div
        className="p-6 max-w-7xl mx-auto space-y-6"
        data-ocid="admin_analytics.page"
      >
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Analytics &amp; Insights
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Performance data across bookings, tests, and partners
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Date range selector */}
            <div
              className="flex items-center gap-1 bg-card border border-border rounded-lg p-1"
              data-ocid="admin_analytics.date_range_filter"
            >
              <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
              {(["7", "30", "90", "all"] as DateRange[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setDateRange(r)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setDateRange(r);
                  }}
                  data-ocid={`admin_analytics.range_${r}.tab`}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-smooth ${
                    dateRange === r
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {r === "7"
                    ? "7D"
                    : r === "30"
                      ? "30D"
                      : r === "90"
                        ? "90D"
                        : "All"}
                </button>
              ))}
            </div>

            {/* CSV Export */}
            <button
              type="button"
              onClick={exportCSV}
              disabled={loading}
              data-ocid="admin_analytics.export_csv_button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-smooth disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Loading overlay ── */}
        {loading && (
          <div
            className="flex items-center justify-center py-16 text-muted-foreground gap-2"
            data-ocid="admin_analytics.loading_state"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading analytics…</span>
          </div>
        )}

        {!loading && (
          <>
            {/* ── Summary Stats ── */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              data-ocid="admin_analytics.summary_section"
            >
              {[
                {
                  label: "Total Bookings",
                  value: totalBookings.toLocaleString("en-IN"),
                  sub: `${rangeLabels[dateRange]}`,
                  icon: BarChart3,
                  up: true,
                },
                {
                  label: "Total Revenue",
                  value: formatINR(totalRevenue),
                  sub: "Partner price basis",
                  icon: TrendingUp,
                  up: true,
                },
                {
                  label: "Active Centers",
                  value: String(activeCenters),
                  sub: `of ${centers.length} total`,
                  icon: Users,
                  up: true,
                },
                {
                  label: "Avg Bookings/Day",
                  value: avgBookingsPerDay,
                  sub: "Active days only",
                  icon: Calendar,
                  up: Number.parseFloat(avgBookingsPerDay) >= 5,
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="stat-card"
                  data-ocid={`admin_analytics.stat.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="stat-label">{stat.label}</p>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="font-display font-bold text-2xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Section 1: Daily Bookings ── */}
            <div
              className="bg-card rounded-xl border border-border p-6"
              data-ocid="admin_analytics.daily_chart"
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-semibold text-foreground text-lg">
                  Daily Bookings
                </h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {totalBookings.toLocaleString("en-IN")} total bookings in{" "}
                  {rangeLabels[dateRange].toLowerCase()}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mb-5">
                {dateRange === "90" || dateRange === "all"
                  ? "Weekly aggregates shown"
                  : "Daily booking volume"}
              </p>

              {totalBookings === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-36 text-muted-foreground gap-2"
                  data-ocid="admin_analytics.daily_chart.empty_state"
                >
                  <BarChart3 className="w-8 h-8 opacity-30" />
                  <p className="text-sm">No bookings in this period</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex items-end gap-1 h-36 min-w-max">
                    {displayedDailyData.map((d, i) => {
                      const heightPct = (d.count / displayedMax) * 100;
                      const label =
                        dateRange === "7"
                          ? new Date(d.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                            })
                          : dateRange === "30"
                            ? new Date(d.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })
                            : new Date(d.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              });
                      return (
                        <div
                          key={d.date}
                          className="flex flex-col items-center gap-1 group"
                          style={{
                            width:
                              dateRange === "7"
                                ? "60px"
                                : dateRange === "30"
                                  ? "28px"
                                  : "40px",
                          }}
                          data-ocid={`admin_analytics.bar.${i + 1}`}
                        >
                          <span className="text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth">
                            {d.count}
                          </span>
                          <div
                            className="w-full rounded-t-sm bg-primary/70 hover:bg-primary transition-smooth relative"
                            style={{ height: `${Math.max(heightPct, 3)}%` }}
                            title={`${d.date}: ${d.count} bookings`}
                          />
                          <span
                            className="text-[10px] text-muted-foreground whitespace-nowrap"
                            style={{ fontSize: "9px" }}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Y-axis reference lines */}
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>0</span>
                    <span>{Math.round(displayedMax / 2)}</span>
                    <span>{displayedMax}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Section 2 + 3: Test Revenue + Partner Performance ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Test-wise Revenue */}
              <div
                className="bg-card rounded-xl border border-border overflow-hidden"
                data-ocid="admin_analytics.test_revenue_section"
              >
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-display font-semibold text-foreground text-lg">
                    Test-wise Revenue
                  </h2>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Top 8 tests by partner revenue
                  </p>
                </div>

                {testStats.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2"
                    data-ocid="admin_analytics.test_revenue_section.empty_state"
                  >
                    <BarChart3 className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No test data in this period</p>
                  </div>
                ) : (
                  <div className="px-6 py-4 space-y-3">
                    {testStats.map((t, i) => {
                      const pct = Math.round(
                        (t.revenue / maxTestRevenue) * 100,
                      );
                      return (
                        <div
                          key={t.testId.toString()}
                          data-ocid={`admin_analytics.test_row.${i + 1}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="text-sm font-medium text-foreground truncate max-w-[55%]"
                              title={t.name}
                            >
                              {t.name}
                            </span>
                            <div className="flex items-center gap-3 text-right shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {t.bookings} bookings
                              </span>
                              <span className="text-sm font-semibold text-foreground tabular-nums">
                                {formatINR(t.revenue)}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-smooth bg-primary"
                              style={{
                                width: `${pct}%`,
                                opacity: 0.6 + 0.4 * (1 - i / testStats.length),
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Partner Performance Table */}
              <div
                className="bg-card rounded-xl border border-border overflow-hidden"
                data-ocid="admin_analytics.partner_section"
              >
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-semibold text-foreground text-lg">
                      Partner Performance
                    </h2>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {sortedPartners.length} collection centers
                    </p>
                  </div>
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                </div>

                {sortedPartners.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2"
                    data-ocid="admin_analytics.partner_section.empty_state"
                  >
                    <Users className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No partner data in this period</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/40">
                          <th
                            className="table-header cursor-pointer select-none hover:text-primary"
                            onClick={() => handleSort("name")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSort("name");
                            }}
                            data-ocid="admin_analytics.partner_table.sort_name"
                          >
                            <div className="flex items-center">
                              Partner
                              <SortIcon
                                column="name"
                                sortKey={sortKey}
                                sortDir={sortDir}
                              />
                            </div>
                          </th>
                          <th
                            className="table-header cursor-pointer select-none hover:text-primary text-right"
                            onClick={() => handleSort("bookings")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSort("bookings");
                            }}
                            data-ocid="admin_analytics.partner_table.sort_bookings"
                          >
                            <div className="flex items-center justify-end">
                              Bookings
                              <SortIcon
                                column="bookings"
                                sortKey={sortKey}
                                sortDir={sortDir}
                              />
                            </div>
                          </th>
                          <th
                            className="table-header cursor-pointer select-none hover:text-primary text-right"
                            onClick={() => handleSort("revenue")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSort("revenue");
                            }}
                            data-ocid="admin_analytics.partner_table.sort_revenue"
                          >
                            <div className="flex items-center justify-end">
                              Revenue
                              <SortIcon
                                column="revenue"
                                sortKey={sortKey}
                                sortDir={sortDir}
                              />
                            </div>
                          </th>
                          <th
                            className="table-header cursor-pointer select-none hover:text-primary text-right"
                            onClick={() => handleSort("lastBooking")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSort("lastBooking");
                            }}
                            data-ocid="admin_analytics.partner_table.sort_last_booking"
                          >
                            <div className="flex items-center justify-end">
                              Last Booking
                              <SortIcon
                                column="lastBooking"
                                sortKey={sortKey}
                                sortDir={sortDir}
                              />
                            </div>
                          </th>
                          <th className="table-header text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPartners.map((p, i) => (
                          <tr
                            key={p.centerId}
                            className="hover:bg-muted/30 transition-smooth"
                            data-ocid={`admin_analytics.partner_row.${i + 1}`}
                          >
                            <td className="table-cell">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-[10px] font-bold text-primary">
                                    {p.name.slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                                <span
                                  className="font-medium truncate max-w-[120px]"
                                  title={p.name}
                                >
                                  {p.name}
                                </span>
                              </div>
                            </td>
                            <td className="table-cell text-right tabular-nums text-muted-foreground font-medium">
                              {p.bookings.toLocaleString("en-IN")}
                            </td>
                            <td className="table-cell text-right tabular-nums font-semibold text-foreground">
                              {formatINR(p.revenue)}
                            </td>
                            <td className="table-cell text-right text-xs text-muted-foreground">
                              {p.lastBooking
                                ? new Date(p.lastBooking).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "2-digit",
                                    },
                                  )
                                : "—"}
                            </td>
                            <td className="table-cell text-right">
                              {p.active ? (
                                <span className="badge-success inline-flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" /> Active
                                </span>
                              ) : (
                                <span className="badge-error inline-flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" /> Inactive
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
