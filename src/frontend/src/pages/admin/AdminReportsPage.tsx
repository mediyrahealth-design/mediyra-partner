import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  Filter,
  Search,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SampleStatus } from "../../backend.d";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type { CollectionCenterPublic, Report } from "../../types";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(ts: bigint) {
  return new Date(Number(ts)).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dateStringToTimestamp(dateStr: string): bigint | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return BigInt(d.getTime());
}

// ─── skeleton ────────────────────────────────────────────────────────────────

const SKELETON_ROWS = [
  { id: "a", widths: [140, 180, 120, 130, 80] },
  { id: "b", widths: [110, 160, 130, 90, 80] },
  { id: "c", widths: [150, 140, 100, 150, 80] },
  { id: "d", widths: [120, 170, 110, 120, 80] },
  { id: "e", widths: [100, 150, 140, 80, 80] },
];
const SKELETON_CELL_IDS = ["p", "c", "d", "f", "a"];

function TableSkeleton() {
  return (
    <>
      {SKELETON_ROWS.map((row) => (
        <tr key={row.id} className="border-b border-border last:border-0">
          {row.widths.map((w, ci) => (
            <td key={SKELETON_CELL_IDS[ci]} className="px-4 py-3.5">
              <div
                className="h-3.5 rounded bg-muted animate-pulse"
                style={{ width: `${w}px`, maxWidth: "100%" }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function MobileCardSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-4 flex gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-muted animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-muted animate-pulse rounded w-2/3" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
          <div className="w-16 h-8 bg-muted animate-pulse rounded-lg flex-shrink-0" />
        </div>
      ))}
    </>
  );
}

// ─── form types ──────────────────────────────────────────────────────────────

interface UploadForm {
  patientId: string;
  filename: string;
  reportUrl: string;
  markReportReady: boolean;
}

// ─── main component ──────────────────────────────────────────────────────────

export default function AdminReportsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();

  // ── filters ────────────────────────────────────────────────────────────────
  const [selectedCenter, setSelectedCenter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [centerSearchInput, setCenterSearchInput] = useState("");

  // ── upload modal ───────────────────────────────────────────────────────────
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    patientId: "",
    filename: "",
    reportUrl: "",
    markReportReady: true,
  });
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ── queries ────────────────────────────────────────────────────────────────
  const { data: centers = [] } = useQuery<CollectionCenterPublic[]>({
    queryKey: ["admin.centers", user?.token],
    queryFn: () => api.getCenters(user!.token),
    enabled: !!user?.token,
  });

  const tsFrom = useMemo(() => dateStringToTimestamp(dateFrom), [dateFrom]);
  const tsTo = useMemo(() => dateStringToTimestamp(dateTo), [dateTo]);

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["admin.reports", user?.token, selectedCenter, tsFrom, tsTo],
    queryFn: () =>
      api.getReportsByCenter(
        user!.token,
        selectedCenter === "all" ? "" : selectedCenter,
        tsFrom,
        tsTo,
      ),
    enabled: !!user?.token,
  });

  // ── derived data ───────────────────────────────────────────────────────────
  const centerMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of centers) m[c.id] = c.name;
    return m;
  }, [centers]);

  const filteredReports = useMemo(() => {
    if (!patientSearch.trim()) return reports;
    const q = patientSearch.trim().toLowerCase();
    return reports.filter((r) => r.patientId.toLowerCase().includes(q));
  }, [reports, patientSearch]);

  const filteredCenterOptions = useMemo(() => {
    if (!centerSearchInput) return centers;
    const q = centerSearchInput.toLowerCase();
    return centers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [centers, centerSearchInput]);

  const selectedCenterName =
    selectedCenter === "all"
      ? "All Centers"
      : (centerMap[selectedCenter] ?? selectedCenter);

  // ── upload mutation ────────────────────────────────────────────────────────
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token) throw new Error("Not logged in.");
      const { patientId, filename, reportUrl, markReportReady } = uploadForm;
      if (!patientId.trim()) throw new Error("Patient ID is required.");
      if (!filename.trim()) throw new Error("Filename is required.");
      if (!reportUrl.trim()) throw new Error("Report URL is required.");
      try {
        new URL(reportUrl);
      } catch {
        throw new Error("Please enter a valid URL (starting with https://).");
      }

      await api.uploadReport(
        user.token,
        patientId.trim(),
        filename.trim(),
        reportUrl.trim(),
      );

      if (markReportReady) {
        await api.updateSampleStatus(
          user.token,
          patientId.trim(),
          SampleStatus.reportReady,
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.reports"] });
      setUploadSuccess(true);
    },
    onError: (e: Error) => setUploadError(e.message),
  });

  function openUploadModal() {
    setUploadForm({
      patientId: "",
      filename: "",
      reportUrl: "",
      markReportReady: true,
    });
    setUploadError("");
    setUploadSuccess(false);
    setUploadOpen(true);
  }

  function closeUploadModal() {
    setUploadOpen(false);
    setUploadError("");
    setUploadSuccess(false);
  }

  function handleUploadField(key: keyof UploadForm, value: string | boolean) {
    setUploadForm((prev) => ({ ...prev, [key]: value }));
    setUploadError("");
  }

  function handleUploadSubmit() {
    setUploadError("");
    uploadMutation.mutate();
  }

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-5">
        {/* Page header */}
        <PageHeader
          title="Report Management"
          subtitle="Upload and manage patient lab reports"
          action={
            <button
              type="button"
              onClick={openUploadModal}
              data-ocid="admin.reports.upload_button"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Report
            </button>
          }
        />

        {/* ── Filter bar ─────────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Patient ID search */}
            <div className="flex-1 min-w-[180px]">
              <label
                htmlFor="filter-patient-id"
                className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide"
              >
                Patient ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="filter-patient-id"
                  type="search"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="e.g. PT-2024-001"
                  data-ocid="admin.reports.patient_search_input"
                  className="input-field w-full pl-9"
                />
              </div>
            </div>

            {/* Center filter */}
            <div className="flex-1 min-w-[180px] relative">
              <label
                htmlFor="filter-center-btn"
                className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide"
              >
                Collection Center
              </label>
              <button
                id="filter-center-btn"
                type="button"
                onClick={() => setCenterDropdownOpen((v) => !v)}
                data-ocid="admin.reports.center_filter_select"
                className="input-field w-full flex items-center gap-2 text-left"
              >
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 truncate text-sm">
                  {selectedCenterName}
                </span>
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-muted-foreground flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {centerDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <input
                      type="search"
                      value={centerSearchInput}
                      onChange={(e) => setCenterSearchInput(e.target.value)}
                      placeholder="Search centers..."
                      data-ocid="admin.reports.center_search_input"
                      className="input-field w-full text-sm"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCenter("all");
                        setCenterDropdownOpen(false);
                        setCenterSearchInput("");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm font-semibold text-foreground border-b border-border"
                    >
                      All Centers
                    </button>
                    {filteredCenterOptions.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCenter(c.id);
                          setCenterDropdownOpen(false);
                          setCenterSearchInput("");
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border last:border-0"
                      >
                        <span className="font-medium text-foreground">
                          {c.name}
                        </span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {c.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date from */}
            <div className="min-w-[150px]">
              <label
                htmlFor="filter-date-from"
                className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide"
              >
                From Date
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="filter-date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  data-ocid="admin.reports.date_from_input"
                  className="input-field pl-9 w-full"
                />
              </div>
            </div>

            {/* Date to */}
            <div className="min-w-[150px]">
              <label
                htmlFor="filter-date-to"
                className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide"
              >
                To Date
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="filter-date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  data-ocid="admin.reports.date_to_input"
                  className="input-field pl-9 w-full"
                />
              </div>
            </div>

            {/* Clear filters */}
            {(patientSearch ||
              selectedCenter !== "all" ||
              dateFrom ||
              dateTo) && (
              <button
                type="button"
                onClick={() => {
                  setPatientSearch("");
                  setSelectedCenter("all");
                  setDateFrom("");
                  setDateTo("");
                }}
                data-ocid="admin.reports.clear_filters_button"
                className="btn-secondary text-sm h-10 px-4 self-end"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {(selectedCenter !== "all" || dateFrom || dateTo) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
              {selectedCenter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Filter className="w-3 h-3" />
                  {selectedCenterName}
                </span>
              )}
              {dateFrom && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  From: {dateFrom}
                </span>
              )}
              {dateTo && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  To: {dateTo}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Results summary ─────────────────────────────────────────────── */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {filteredReports.length === 0
              ? "No reports found"
              : `Showing ${filteredReports.length} report${filteredReports.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {/* ── Desktop table ────────────────────────────────────────────────── */}
        <div className="hidden md:block rounded-xl border border-border overflow-hidden bg-card shadow-sm">
          <table className="w-full text-sm" data-ocid="admin.reports.table">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Patient ID
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Collection Center
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Upload Date
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Filename
                </th>
                <th className="text-right px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <FileSearch className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          No reports found
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          No reports found for the selected filters
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openUploadModal}
                        data-ocid="admin.reports.empty_state.upload_button"
                        className="btn-primary text-sm mt-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload First Report
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((r, i) => (
                  <tr
                    key={r.id.toString()}
                    className={`border-b border-border last:border-0 hover:bg-muted/20 transition-smooth ${i % 2 === 1 ? "bg-muted/10" : ""}`}
                    data-ocid={`admin.reports.item.${i + 1}`}
                  >
                    {/* Patient ID */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md font-semibold">
                        {r.patientId}
                      </span>
                    </td>
                    {/* Center */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {centerMap[r.centerId] ?? r.centerId}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {r.centerId}
                        </p>
                      </div>
                    </td>
                    {/* Upload date */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-foreground text-sm">
                          {formatDate(r.uploadedAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(r.uploadedAt)).toLocaleTimeString(
                            "en-IN",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </td>
                    {/* Filename */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 max-w-[220px]">
                        <div className="w-7 h-7 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-rose-500" />
                        </div>
                        <span className="font-medium text-foreground text-sm truncate">
                          {r.filename}
                        </span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={r.reportUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-ocid={`admin.reports.view_link.${i + 1}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground bg-card hover:bg-muted transition-smooth text-xs font-medium"
                          title="View report"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </a>
                        <a
                          href={r.reportUrl}
                          download={r.filename}
                          target="_blank"
                          rel="noreferrer"
                          data-ocid={`admin.reports.download_link.${i + 1}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth text-xs font-medium"
                          title="Download report"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile card list ──────────────────────────────────────────────── */}
        <div
          className="flex flex-col gap-3 md:hidden"
          data-ocid="admin.reports.list"
        >
          {isLoading ? (
            <MobileCardSkeleton />
          ) : filteredReports.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-12 text-center"
              data-ocid="admin.reports.empty_state"
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <FileSearch className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  No reports found
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  No reports found for the selected filters
                </p>
              </div>
              <button
                type="button"
                onClick={openUploadModal}
                data-ocid="admin.reports.empty_state.upload_button"
                className="btn-primary text-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Report
              </button>
            </div>
          ) : (
            filteredReports.map((r, i) => (
              <div
                key={r.id.toString()}
                className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                data-ocid={`admin.reports.item.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {r.filename}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Patient:{" "}
                    <span className="font-mono font-medium text-primary">
                      {r.patientId}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {centerMap[r.centerId] ?? r.centerId} ·{" "}
                    {formatDateTime(r.uploadedAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <a
                    href={r.reportUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-ocid={`admin.reports.view_link.${i + 1}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground bg-card hover:bg-muted transition-smooth"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                  <a
                    href={r.reportUrl}
                    download={r.filename}
                    target="_blank"
                    rel="noreferrer"
                    data-ocid={`admin.reports.download_link.${i + 1}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-smooth"
                  >
                    <Download className="w-3 h-3" />
                    Save
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Upload Report Modal ──────────────────────────────────────────────── */}
      <Modal
        isOpen={uploadOpen}
        onClose={closeUploadModal}
        title="Upload Report"
        data-ocid="admin.reports.upload_modal"
      >
        {uploadSuccess ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-base">
                Report Uploaded!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Report for patient{" "}
                <span className="font-mono font-bold text-primary">
                  {uploadForm.patientId}
                </span>{" "}
                has been successfully uploaded.
                {uploadForm.markReportReady && (
                  <span className="block mt-0.5">
                    Sample status marked as Report Ready.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setUploadSuccess(false);
                  setUploadForm({
                    patientId: "",
                    filename: "",
                    reportUrl: "",
                    markReportReady: true,
                  });
                }}
                data-ocid="admin.reports.upload_modal.upload_another_button"
                className="btn-secondary flex-1 py-2.5"
              >
                Upload Another
              </button>
              <button
                type="button"
                onClick={closeUploadModal}
                data-ocid="admin.reports.upload_modal.close_button"
                className="btn-primary flex-1 py-2.5"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Patient ID */}
            <div>
              <label
                htmlFor="ur-pid"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Patient ID <span className="text-destructive">*</span>
              </label>
              <input
                id="ur-pid"
                type="text"
                value={uploadForm.patientId}
                onChange={(e) => handleUploadField("patientId", e.target.value)}
                placeholder="e.g. PT-2024-001"
                data-ocid="admin.reports.upload_modal.patientId_input"
                className="input-field w-full"
              />
            </div>

            {/* Filename */}
            <div>
              <label
                htmlFor="ur-fname"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Report Filename <span className="text-destructive">*</span>
              </label>
              <input
                id="ur-fname"
                type="text"
                value={uploadForm.filename}
                onChange={(e) => handleUploadField("filename", e.target.value)}
                placeholder="e.g. CBC_report_john.pdf"
                data-ocid="admin.reports.upload_modal.filename_input"
                className="input-field w-full"
              />
            </div>

            {/* Report URL */}
            <div>
              <label
                htmlFor="ur-url"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Report URL <span className="text-destructive">*</span>
              </label>
              <input
                id="ur-url"
                type="url"
                value={uploadForm.reportUrl}
                onChange={(e) => handleUploadField("reportUrl", e.target.value)}
                placeholder="https://storage.example.com/report.pdf"
                data-ocid="admin.reports.upload_modal.reportUrl_input"
                className="input-field w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the public PDF URL from your storage service.
              </p>
            </div>

            {/* Mark as Report Ready checkbox */}
            <label
              htmlFor="ur-status"
              className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 transition-smooth"
              data-ocid="admin.reports.upload_modal.mark_ready_checkbox"
            >
              <input
                id="ur-status"
                type="checkbox"
                checked={uploadForm.markReportReady}
                onChange={(e) =>
                  handleUploadField("markReportReady", e.target.checked)
                }
                className="mt-0.5 accent-primary w-4 h-4 flex-shrink-0 cursor-pointer"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Also mark sample as Report Ready
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Updates the sample status to "Report Ready" so the collection
                  center can notify the patient.
                </p>
              </div>
            </label>

            {/* Error */}
            {uploadError && (
              <div
                className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5"
                data-ocid="admin.reports.upload_modal.error_state"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {uploadError}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={closeUploadModal}
                data-ocid="admin.reports.upload_modal.cancel_button"
                className="btn-secondary flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={uploadMutation.isPending}
                data-ocid="admin.reports.upload_modal.confirm_button"
                className="btn-primary flex-1 py-2.5 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Report
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
