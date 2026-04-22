import {
  Building2,
  CalendarDays,
  ChevronDown,
  Eye,
  FileText,
  FlaskConical,
  Pencil,
  Phone,
  Search,
  Stethoscope,
  UploadCloud,
  User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SampleStatus as SS } from "../../backend.d";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuthContext } from "../../context/AuthContext";
import { useApiService } from "../../services/api";
import type {
  CollectionCenterPublic,
  LabTest,
  PatientPublic,
  SampleStatus,
} from "../../types";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_OPTIONS: { value: SampleStatus; label: string }[] = [
  { value: SS.sampleCollected, label: "Sample Collected" },
  { value: SS.sampleReceived, label: "Sample Received" },
  { value: SS.processing, label: "Processing" },
  { value: SS.reportReady, label: "Report Ready" },
];

const STATUS_LABELS: Record<SampleStatus, string> = {
  [SS.sampleCollected]: "Sample Collected",
  [SS.sampleReceived]: "Sample Received",
  [SS.processing]: "Processing",
  [SS.reportReady]: "Report Ready",
};

const SKELETON_COLS = [
  "pid",
  "name",
  "center",
  "tests",
  "date",
  "status",
  "actions",
] as const;

// ─── skeleton ────────────────────────────────────────────────────────────────

function SkeletonRow({ rowIdx }: { rowIdx: number }) {
  return (
    <tr className="animate-pulse">
      {SKELETON_COLS.map((col) => (
        <td key={`sk-${rowIdx}-${col}`} className="table-cell">
          <div className="h-4 bg-muted rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

// ─── detail row ──────────────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm text-foreground font-semibold break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const { user } = useAuthContext();
  const api = useApiService();
  // Keep stable refs to avoid stale closure issues in useCallback
  const apiRef = useRef(api);
  apiRef.current = api;

  const token = user?.token ?? "";

  // Data state
  const [patients, setPatients] = useState<PatientPublic[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [centers, setCenters] = useState<CollectionCenterPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [centerFilter, setCenterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<SampleStatus | "all">("all");

  // Modal state
  const [viewPatient, setViewPatient] = useState<PatientPublic | null>(null);
  const [editPatient, setEditPatient] = useState<PatientPublic | null>(null);
  const [uploadPatient, setUploadPatient] = useState<PatientPublic | null>(
    null,
  );

  // Edit status
  const [editStatus, setEditStatus] = useState<SampleStatus>(
    SS.sampleCollected,
  );
  const [editSaving, setEditSaving] = useState(false);
  const [editFeedback, setEditFeedback] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Upload report
  const [reportFilename, setReportFilename] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [uploadSaving, setUploadSaving] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<
    "idle" | "success" | "error"
  >("idle");

  // ── load data ──────────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [p, t, c] = await Promise.all([
        apiRef.current.getAllPatients(token),
        apiRef.current.getTests(),
        apiRef.current.getCenters(token),
      ]);
      setPatients(p.sort((a, b) => Number(b.bookingDate - a.bookingDate)));
      setTests(t);
      setCenters(c);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── lookup maps ────────────────────────────────────────────────────────────

  const testMap = useMemo(
    () => new Map(tests.map((t) => [t.id.toString(), t.name])),
    [tests],
  );
  const centerMap = useMemo(
    () => new Map(centers.map((c) => [c.id, c.name])),
    [centers],
  );

  // ── filtered list ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return patients.filter((p) => {
      const centerName = (
        centerMap.get(p.centerId) ?? p.centerId
      ).toLowerCase();
      const matchSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        centerName.includes(q);
      const matchCenter = centerFilter === "all" || p.centerId === centerFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchCenter && matchStatus;
    });
  }, [patients, search, centerFilter, statusFilter, centerMap]);

  // ── helpers ────────────────────────────────────────────────────────────────

  function getTestNames(ids: bigint[]): string {
    return ids
      .map((id) => testMap.get(id.toString()) ?? `Test #${id}`)
      .join(", ");
  }
  function getCenterName(id: string): string {
    return centerMap.get(id) ?? id;
  }

  // ── edit status handler ────────────────────────────────────────────────────

  const handleUpdateStatus = async () => {
    if (!editPatient) return;
    setEditSaving(true);
    setEditFeedback("idle");
    try {
      const updated = await apiRef.current.updateSampleStatus(
        token,
        editPatient.id,
        editStatus,
      );
      if (updated) {
        setPatients((prev) =>
          prev.map((p) =>
            p.id === editPatient.id ? { ...p, status: editStatus } : p,
          ),
        );
        setEditFeedback("success");
        setTimeout(() => {
          setEditPatient(null);
          setEditFeedback("idle");
        }, 1200);
      } else {
        setEditFeedback("error");
      }
    } catch {
      setEditFeedback("error");
    } finally {
      setEditSaving(false);
    }
  };

  // ── upload report handler ──────────────────────────────────────────────────

  const handleUploadReport = async () => {
    if (!uploadPatient || !reportFilename.trim() || !reportUrl.trim()) return;
    setUploadSaving(true);
    setUploadFeedback("idle");
    try {
      await apiRef.current.uploadReport(
        token,
        uploadPatient.id,
        reportFilename.trim(),
        reportUrl.trim(),
      );
      setUploadFeedback("success");
      setReportFilename("");
      setReportUrl("");
      setTimeout(() => {
        setUploadPatient(null);
        setUploadFeedback("idle");
      }, 1400);
    } catch {
      setUploadFeedback("error");
    } finally {
      setUploadSaving(false);
    }
  };

  // ── open modal helpers ─────────────────────────────────────────────────────

  function openEdit(p: PatientPublic) {
    setEditPatient(p);
    setEditStatus(p.status);
    setEditFeedback("idle");
  }

  function openUpload(p: PatientPublic) {
    setUploadPatient(p);
    setReportFilename("");
    setReportUrl("");
    setUploadFeedback("idle");
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div
        className="p-6 max-w-7xl mx-auto space-y-6"
        data-ocid="admin_bookings.page"
      >
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Booking &amp; Sample Management
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage all patient bookings across all collection centers
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 self-start">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">
              {patients.length}
            </span>
            <span>total bookings</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3"
          data-ocid="admin_bookings.filters"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="booking-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Patient ID, name, or center..."
              data-ocid="admin_bookings.search_input"
              className="input-field w-full pl-10"
              aria-label="Search bookings"
            />
          </div>

          {/* Center filter */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              id="booking-center-filter"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              data-ocid="admin_bookings.center_filter"
              className="input-field pl-10 pr-8 appearance-none min-w-[180px]"
              aria-label="Filter by center"
            >
              <option value="all">All Centers</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              id="booking-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as SampleStatus | "all")
              }
              data-ocid="admin_bookings.status_filter"
              className="input-field pr-8 appearance-none min-w-[180px]"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-ocid="admin_bookings.table">
              <thead>
                <tr>
                  <th className="table-header">Patient ID</th>
                  <th className="table-header">Patient Name</th>
                  <th className="table-header hidden md:table-cell">
                    Partner Center
                  </th>
                  <th className="table-header hidden lg:table-cell">Tests</th>
                  <th className="table-header hidden sm:table-cell">Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [0, 1, 2, 3, 4].map((idx) => (
                    <SkeletonRow key={idx} rowIdx={idx} />
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center"
                      data-ocid="admin_bookings.empty_state"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                          <FileText className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-foreground">
                          No bookings found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {search ||
                          centerFilter !== "all" ||
                          statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "No patient bookings have been created yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((patient, i) => (
                    <tr
                      key={patient.id}
                      className={`hover:bg-primary/5 transition-smooth ${i % 2 === 1 ? "bg-muted/30" : ""}`}
                      data-ocid={`admin_bookings.row.${i + 1}`}
                    >
                      {/* Patient ID */}
                      <td className="table-cell">
                        <button
                          type="button"
                          onClick={() => setViewPatient(patient)}
                          data-ocid={`admin_bookings.patient_id_link.${i + 1}`}
                          className="font-mono text-xs font-bold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        >
                          {patient.id}
                        </button>
                      </td>

                      {/* Name */}
                      <td className="table-cell font-medium text-foreground">
                        {patient.name}
                      </td>

                      {/* Partner Center */}
                      <td className="table-cell hidden md:table-cell text-muted-foreground">
                        {getCenterName(patient.centerId)}
                      </td>

                      {/* Tests */}
                      <td className="table-cell hidden lg:table-cell text-muted-foreground max-w-[200px]">
                        <span className="line-clamp-2 text-xs">
                          {getTestNames(patient.testIds) || "—"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="table-cell hidden sm:table-cell text-muted-foreground whitespace-nowrap">
                        {formatDate(patient.bookingDate)}
                      </td>

                      {/* Status */}
                      <td className="table-cell">
                        <StatusBadge status={patient.status} />
                      </td>

                      {/* Actions */}
                      <td className="table-cell">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View Details"
                            onClick={() => setViewPatient(patient)}
                            data-ocid={`admin_bookings.view_button.${i + 1}`}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-smooth"
                            aria-label={`View details for ${patient.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Update Status"
                            onClick={() => openEdit(patient)}
                            data-ocid={`admin_bookings.edit_button.${i + 1}`}
                            className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-smooth"
                            aria-label={`Update status for ${patient.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Upload Report"
                            onClick={() => openUpload(patient)}
                            data-ocid={`admin_bookings.upload_button.${i + 1}`}
                            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-smooth"
                            aria-label={`Upload report for ${patient.name}`}
                          >
                            <UploadCloud className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {!isLoading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {patients.length}
                </span>{" "}
                bookings
              </span>
              {(search || centerFilter !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCenterFilter("all");
                    setStatusFilter("all");
                  }}
                  data-ocid="admin_bookings.clear_filters"
                  className="text-primary hover:underline font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── View Details Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={!!viewPatient}
        onClose={() => setViewPatient(null)}
        title="Patient Details"
        data-ocid="admin_bookings.view_dialog"
      >
        {viewPatient && (
          <div className="space-y-4">
            {/* ID + Status banner */}
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/15">
              <span className="font-mono text-sm font-bold text-primary">
                {viewPatient.id}
              </span>
              <StatusBadge status={viewPatient.status} />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 gap-3">
              <DetailRow
                icon={User}
                label="Patient Name"
                value={viewPatient.name}
              />
              <div className="grid grid-cols-2 gap-3">
                <DetailRow
                  icon={CalendarDays}
                  label="Age"
                  value={`${viewPatient.age} years`}
                />
                <DetailRow
                  icon={User}
                  label="Gender"
                  value={
                    viewPatient.gender === "male"
                      ? "Male"
                      : viewPatient.gender === "female"
                        ? "Female"
                        : "Other"
                  }
                />
              </div>
              <DetailRow
                icon={Phone}
                label="Mobile"
                value={viewPatient.mobile}
              />
              {viewPatient.refDoctor && (
                <DetailRow
                  icon={Stethoscope}
                  label="Referring Doctor"
                  value={viewPatient.refDoctor}
                />
              )}
              <DetailRow
                icon={Building2}
                label="Booked by"
                value={getCenterName(viewPatient.centerId)}
              />
              <DetailRow
                icon={CalendarDays}
                label="Booking Date"
                value={formatDate(viewPatient.bookingDate)}
              />
            </div>

            {/* Tests */}
            {viewPatient.testIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Tests Ordered
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewPatient.testIds.map((id) => (
                    <span
                      key={id.toString()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                    >
                      <FlaskConical className="w-3 h-3" />
                      {testMap.get(id.toString()) ?? `Test #${id}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setViewPatient(null)}
              data-ocid="admin_bookings.view_close_button"
              className="btn-secondary w-full mt-2"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* ── Update Status Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={!!editPatient}
        onClose={() => {
          setEditPatient(null);
          setEditFeedback("idle");
        }}
        title="Update Sample Status"
        data-ocid="admin_bookings.edit_dialog"
      >
        {editPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Patient</p>
                <p className="text-sm font-semibold truncate">
                  {editPatient.name}{" "}
                  <span className="font-mono text-xs text-primary">
                    ({editPatient.id})
                  </span>
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-status-select"
                className="block text-sm font-semibold text-foreground mb-1.5"
              >
                New Status
              </label>
              <div className="relative">
                <select
                  id="edit-status-select"
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as SampleStatus)
                  }
                  data-ocid="admin_bookings.status_select"
                  className="input-field w-full pr-8 appearance-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {editFeedback === "success" && (
              <div
                className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center font-medium"
                data-ocid="admin_bookings.status_success_state"
              >
                ✓ Status updated to &ldquo;{STATUS_LABELS[editStatus]}&rdquo;
              </div>
            )}
            {editFeedback === "error" && (
              <div
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-center font-medium"
                data-ocid="admin_bookings.status_error_state"
              >
                Failed to update status. Please try again.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditPatient(null);
                  setEditFeedback("idle");
                }}
                data-ocid="admin_bookings.edit_cancel_button"
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={editSaving || editFeedback === "success"}
                data-ocid="admin_bookings.edit_save_button"
                className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {editSaving ? "Saving…" : "Save Status"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Upload Report Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={!!uploadPatient}
        onClose={() => {
          setUploadPatient(null);
          setUploadFeedback("idle");
        }}
        title="Upload Report"
        data-ocid="admin_bookings.upload_dialog"
      >
        {uploadPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Patient</p>
                <p className="text-sm font-semibold truncate">
                  {uploadPatient.name}{" "}
                  <span className="font-mono text-xs text-primary">
                    ({uploadPatient.id})
                  </span>
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="upload-patient-id"
                className="block text-sm font-semibold text-foreground mb-1.5"
              >
                Patient ID
              </label>
              <input
                id="upload-patient-id"
                type="text"
                readOnly
                value={uploadPatient.id}
                data-ocid="admin_bookings.upload_patient_id_input"
                className="input-field w-full bg-muted/40 text-muted-foreground cursor-not-allowed font-mono text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="upload-filename"
                className="block text-sm font-semibold text-foreground mb-1.5"
              >
                Report Filename
              </label>
              <input
                id="upload-filename"
                type="text"
                value={reportFilename}
                onChange={(e) => setReportFilename(e.target.value)}
                placeholder="e.g. CBC_Report_Apr2026.pdf"
                data-ocid="admin_bookings.upload_filename_input"
                className="input-field w-full"
              />
            </div>

            <div>
              <label
                htmlFor="upload-url"
                className="block text-sm font-semibold text-foreground mb-1.5"
              >
                Report PDF URL
              </label>
              <input
                id="upload-url"
                type="url"
                value={reportUrl}
                onChange={(e) => setReportUrl(e.target.value)}
                placeholder="https://storage.example.com/report.pdf"
                data-ocid="admin_bookings.upload_url_input"
                className="input-field w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the publicly accessible URL of the uploaded PDF
              </p>
            </div>

            {uploadFeedback === "success" && (
              <div
                className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center font-medium"
                data-ocid="admin_bookings.upload_success_state"
              >
                ✓ Report uploaded and attached to patient
              </div>
            )}
            {uploadFeedback === "error" && (
              <div
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-center font-medium"
                data-ocid="admin_bookings.upload_error_state"
              >
                Upload failed. Please check the URL and try again.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setUploadPatient(null);
                  setUploadFeedback("idle");
                }}
                data-ocid="admin_bookings.upload_cancel_button"
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadReport}
                disabled={
                  uploadSaving ||
                  !reportFilename.trim() ||
                  !reportUrl.trim() ||
                  uploadFeedback === "success"
                }
                data-ocid="admin_bookings.upload_submit_button"
                className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploadSaving ? "Uploading…" : "Upload Report"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
