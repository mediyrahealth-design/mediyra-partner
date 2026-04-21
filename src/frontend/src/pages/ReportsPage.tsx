import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  Search,
  Share2,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PartnerLayout } from "../components/layouts/PartnerLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useApiService } from "../services/api";
import type { Report } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateLabel(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateKey(ts: bigint): string {
  const d = new Date(Number(ts));
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateInputValue(ts: bigint): string {
  const d = new Date(Number(ts));
  return d.toISOString().split("T")[0];
}

function groupByDate(
  reports: Report[],
): Map<string, { label: string; items: Report[] }> {
  const map = new Map<string, { label: string; items: Report[] }>();
  for (const r of reports) {
    const key = formatDateKey(r.uploadedAt);
    if (!map.has(key)) {
      map.set(key, { label: formatDateLabel(r.uploadedAt), items: [] });
    }
    map.get(key)!.items.push(r);
  }
  return map;
}

// ─── Share handler ────────────────────────────────────────────────────────────

async function handleShare(report: Report): Promise<void> {
  const title = `Report for Patient ${report.patientId}`;
  const url = report.reportUrl;
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        url,
        text: `Lab report: ${report.filename}`,
      });
    } catch {
      // user cancelled — no-op
    }
  } else {
    await navigator.clipboard.writeText(url);
    toast.success("Report link copied to clipboard");
  }
}

// ─── Report Card ─────────────────────────────────────────────────────────────

function ReportCard({
  report,
  index,
}: {
  report: Report;
  index: number;
}) {
  const [shared, setShared] = useState(false);

  const onShare = useCallback(async () => {
    await handleShare(report);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }, [report]);

  return (
    <div
      className="card-elevated p-4 flex items-start gap-3 animate-fade-in"
      data-ocid={`reports.item.${index}`}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <FileText className="w-5 h-5 text-primary" />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate leading-snug">
          {report.filename}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
          <span className="text-xs font-mono text-primary font-medium bg-primary/8 px-1.5 py-0.5 rounded">
            {report.patientId}
          </span>
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatTime(report.uploadedAt)}
          </span>
        </div>

        {/* Status badge */}
        <div className="mt-2">
          <span className="badge-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Report Ready
          </span>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 mt-3">
          <a
            href={report.reportUrl}
            target="_blank"
            rel="noreferrer"
            data-ocid={`reports.view_button.${index}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-smooth"
            aria-label="View report"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View
          </a>
          <a
            href={report.reportUrl}
            download={report.filename}
            data-ocid={`reports.download_button.${index}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent-foreground bg-accent rounded-lg px-3 py-1.5 hover:opacity-90 transition-smooth"
            aria-label="Download report"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
          <button
            type="button"
            onClick={onShare}
            data-ocid={`reports.share_button.${index}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-secondary-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-smooth"
            aria-label="Share report"
          >
            {shared ? (
              <>
                <ClipboardCopy className="w-3.5 h-3.5 text-accent" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Date Group ───────────────────────────────────────────────────────────────

function DateGroup({
  label,
  items,
  startIndex,
}: {
  label: string;
  items: Report[];
  startIndex: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      {items.map((r, i) => (
        <ReportCard
          key={r.id.toString()}
          report={r}
          index={startIndex + i + 1}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { user } = useAuth();
  const api = useApiService();

  const [patientId, setPatientId] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState<{
    patientId: string;
    date: string;
  } | null>(null);

  // Fetch all reports for center on mount; specific patient on search
  const { data: allReports = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["reports", user?.token, user?.userId],
    queryFn: () =>
      api.getReportsByCenter(user!.token, user!.userId, null, null),
    enabled: !!user?.token && !hasSearched,
  });

  const { data: patientReports = [], isLoading: isLoadingPatient } = useQuery({
    queryKey: ["reports-patient", user?.token, searchQuery?.patientId],
    queryFn: () => api.getReportsByPatient(user!.token, searchQuery!.patientId),
    enabled: !!user?.token && !!searchQuery?.patientId,
  });

  const isLoading = hasSearched ? isLoadingPatient : isLoadingAll;

  // Merge results
  const baseReports =
    hasSearched && searchQuery?.patientId ? patientReports : allReports;

  // Apply date filter client-side
  const filtered = dateFilter
    ? baseReports.filter((r) => toDateInputValue(r.uploadedAt) === dateFilter)
    : baseReports;

  const grouped = groupByDate(
    [...filtered].sort((a, b) => Number(b.uploadedAt - a.uploadedAt)),
  );

  const handleSearch = () => {
    setHasSearched(true);
    setSearchQuery({ patientId: patientId.trim(), date: dateFilter });
  };

  const handleClear = () => {
    setPatientId("");
    setDateFilter("");
    setHasSearched(false);
    setSearchQuery(null);
  };

  const hasFilters = patientId.trim() !== "" || dateFilter !== "";

  // Flat counter for deterministic data-ocid indices
  let itemCounter = 0;

  return (
    <PartnerLayout>
      <PageHeader
        title="Download Reports"
        subtitle="Search and access patient reports"
      />

      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Search Panel */}
        <div
          className="card-elevated p-4 flex flex-col gap-3"
          data-ocid="reports.search_panel"
        >
          {/* Patient ID */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reports-patient-id"
              className="text-xs font-semibold text-foreground"
            >
              Patient ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="reports-patient-id"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="PT-2024-001"
                data-ocid="reports.search_input"
                className="input-field w-full pl-10 pr-10 text-sm"
                aria-label="Patient ID"
              />
              {patientId && (
                <button
                  type="button"
                  onClick={() => setPatientId("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label="Clear patient ID"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Date picker */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reports-date"
              className="text-xs font-semibold text-foreground"
            >
              Date (dd-mm-yyyy)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="reports-date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                data-ocid="reports.date_input"
                className="input-field w-full pl-10 text-sm"
                aria-label="Filter by date"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              disabled={!hasFilters}
              data-ocid="reports.search_button"
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              Search Reports
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClear}
                data-ocid="reports.clear_button"
                className="btn-secondary px-4 text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filters summary */}
        {hasSearched && (searchQuery?.patientId || dateFilter) && (
          <div className="flex flex-wrap gap-2">
            {searchQuery?.patientId && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
                <FileText className="w-3 h-3" />
                ID: {searchQuery.patientId}
              </span>
            )}
            {dateFilter && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-accent/10 text-accent font-medium px-2.5 py-1 rounded-full">
                <Calendar className="w-3 h-3" />
                {new Date(dateFilter).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            <span className="text-xs text-muted-foreground self-center">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Results */}
        <div className="flex flex-col gap-4" data-ocid="reports.list">
          {isLoading ? (
            ["s1", "s2", "s3"].map((k) => <CardSkeleton key={k} />)
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={
                hasSearched ? (
                  <FileSearch className="w-7 h-7" />
                ) : (
                  <FileText className="w-7 h-7" />
                )
              }
              title={hasSearched ? "No reports available" : "No reports yet"}
              description={
                hasSearched
                  ? "Try a different Patient ID or date range"
                  : "Reports uploaded by the lab will appear here."
              }
              data-ocid="reports.empty_state"
            />
          ) : (
            Array.from(grouped.entries()).map(([key, group]) => {
              const startIndex = itemCounter;
              itemCounter += group.items.length;
              return (
                <DateGroup
                  key={key}
                  label={group.label}
                  items={group.items}
                  startIndex={startIndex}
                />
              );
            })
          )}
        </div>
      </div>
    </PartnerLayout>
  );
}
