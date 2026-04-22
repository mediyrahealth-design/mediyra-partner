import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FileWarning,
  IndianRupee,
  LayoutGrid,
  Loader2,
  TestTube,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type { DashboardStats, PatientPublic } from "../../types";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatBookingDate(ts: bigint) {
  // bookingDate is stored as nanoseconds on IC
  const ms = Number(ts) > 1e15 ? Number(ts) / 1_000_000 : Number(ts);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── status badge ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  sampleCollected: "Collected",
  sampleReceived: "Received",
  processing: "Processing",
  reportReady: "Report Ready",
};

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABEL[status] ?? status;
  if (status === "reportReady")
    return <span className="badge-success">{label}</span>;
  if (status === "processing")
    return (
      <span className="inline-flex items-center rounded-full bg-warning/15 px-2 py-1 text-xs font-semibold text-warning">
        {label}
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
      {label}
    </span>
  );
}

// ─── skeleton ────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="stat-card animate-pulse" aria-hidden>
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="w-10 h-10 rounded-xl bg-muted" />
      </div>
      <div className="h-8 w-20 rounded bg-muted mb-1" />
    </div>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: string;
  highlight?: boolean;
  ocid: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  highlight,
  ocid,
}: StatCardProps) {
  return (
    <div
      className={`stat-card group ${highlight ? "bg-primary border-primary/80 shadow-lg" : ""}`}
      data-ocid={ocid}
    >
      <div className="flex items-start justify-between mb-3">
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            highlight ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            highlight ? "bg-primary-foreground/15" : iconBg
          }`}
        >
          <Icon
            className={`w-5 h-5 ${highlight ? "text-primary-foreground" : iconColor}`}
          />
        </div>
      </div>

      <div className="flex items-end gap-2 mt-1">
        <span
          className={`text-3xl font-bold font-display leading-none ${
            highlight ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold mb-0.5 flex items-center gap-0.5 ${
              highlight ? "text-primary-foreground/80" : "text-accent"
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── quick action card ───────────────────────────────────────────────────────

interface QuickActionProps {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  ocid: string;
}

function QuickAction({
  title,
  desc,
  href,
  icon: Icon,
  ocid,
}: QuickActionProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-smooth group"
      data-ocid={ocid}
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-smooth">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm font-display truncate">
          {title}
        </p>
        <p className="text-muted-foreground text-xs mt-0.5 truncate">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-smooth flex-shrink-0" />
    </a>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const api = useApiService();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<PatientPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const token = user.token;

    const getDashboardStats = api.getDashboardStats;
    const getAllPatients = api.getAllPatients;

    async function load() {
      try {
        const [s, p] = await Promise.all([
          getDashboardStats(token),
          getAllPatients(token),
        ]);
        if (cancelled) return;
        setStats(s);
        const sorted = [...p]
          .sort((a, b) => Number(b.bookingDate) - Number(a.bookingDate))
          .slice(0, 5);
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

  const today = formatDate(new Date());

  const statCards: StatCardProps[] = [
    {
      label: "Total Bookings",
      value:
        error || !stats ? "--" : stats.totalBookings.toLocaleString("en-IN"),
      icon: ClipboardList,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      ocid: "admin_dashboard.stat_card.1",
    },
    {
      label: "Today's Samples",
      value:
        error || !stats ? "--" : stats.todaysSamples.toLocaleString("en-IN"),
      icon: TestTube,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      ocid: "admin_dashboard.stat_card.2",
    },
    {
      label: "Reports Pending",
      value:
        error || !stats ? "--" : stats.pendingReports.toLocaleString("en-IN"),
      icon: FileWarning,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      ocid: "admin_dashboard.stat_card.3",
    },
    {
      label: "Monthly Revenue",
      value: error || !stats ? "--" : formatCurrency(stats.thisMonthRevenue),
      icon: IndianRupee,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      highlight: true,
      ocid: "admin_dashboard.stat_card.4",
    },
  ];

  const quickActions: QuickActionProps[] = [
    {
      title: "Manage Bookings",
      desc: "View, update status & upload reports",
      href: "/admin/bookings",
      icon: ClipboardList,
      ocid: "admin_dashboard.quick_action.bookings",
    },
    {
      title: "Manage Centers",
      desc: "Add and configure partner collection centers",
      href: "/admin/centers",
      icon: Users,
      ocid: "admin_dashboard.quick_action.centers",
    },
    {
      title: "View Analytics",
      desc: "Daily bookings, revenue & partner performance",
      href: "/admin/analytics",
      icon: LayoutGrid,
      ocid: "admin_dashboard.quick_action.analytics",
    },
  ];

  return (
    <AdminLayout>
      <div
        className="p-6 max-w-7xl mx-auto space-y-7"
        data-ocid="admin_dashboard.page"
      >
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground leading-tight">
              Welcome back, {user?.userId ?? "Admin"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {today}
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-lg bg-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading data…
            </div>
          )}
        </div>

        {/* ── Stat Cards ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="admin_dashboard.stats_section"
        >
          {loading
            ? ["s1", "s2", "s3", "s4"].map((k) => <StatSkeleton key={k} />)
            : statCards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>

        {/* ── Quick Actions ── */}
        <section data-ocid="admin_dashboard.quick_actions_section">
          <h2 className="font-display font-semibold text-foreground text-base mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((qa) => (
              <QuickAction key={qa.title} {...qa} />
            ))}
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section
          className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          data-ocid="admin_dashboard.recent_activity_section"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="font-display font-semibold text-foreground text-base">
                Recent Bookings
              </h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Latest patient test bookings across all centers
              </p>
            </div>
            <a
              href="/admin/bookings"
              className="text-primary text-sm font-semibold hover:underline transition-smooth flex items-center gap-1"
              data-ocid="admin_dashboard.view_all_bookings_link"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading bookings…
              </div>
            ) : patients.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm"
                data-ocid="admin_dashboard.bookings_empty_state"
              >
                <ClipboardList className="w-8 h-8 mb-2 opacity-40" />
                No bookings yet
              </div>
            ) : (
              <table
                className="w-full"
                data-ocid="admin_dashboard.bookings_table"
              >
                <thead>
                  <tr className="bg-muted/40">
                    <th className="table-header">Patient ID</th>
                    <th className="table-header">Name</th>
                    <th className="table-header hidden md:table-cell">
                      Center
                    </th>
                    <th className="table-header hidden lg:table-cell text-right">
                      Tests
                    </th>
                    <th className="table-header hidden sm:table-cell">Date</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-muted/30 transition-smooth ${i % 2 === 1 ? "bg-muted/10" : ""}`}
                      data-ocid={`admin_dashboard.booking_row.${i + 1}`}
                    >
                      <td className="table-cell font-mono text-xs font-semibold text-primary">
                        {p.id}
                      </td>
                      <td className="table-cell font-medium truncate max-w-[140px]">
                        {p.name}
                      </td>
                      <td className="table-cell hidden md:table-cell text-muted-foreground truncate max-w-[120px]">
                        {p.centerId}
                      </td>
                      <td className="table-cell hidden lg:table-cell text-right text-muted-foreground">
                        {p.testIds.length}
                      </td>
                      <td className="table-cell hidden sm:table-cell text-muted-foreground">
                        {formatBookingDate(p.bookingDate)}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={String(p.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
