import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { SampleStatus } from "../../backend.d";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { CardSkeleton } from "../../components/ui/LoadingSpinner";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type { Report } from "../../types";

interface UploadForm {
  patientId: string;
  filename: string;
  reportUrl: string;
}

interface StatusForm {
  patientId: string;
  status: SampleStatus;
}

const STATUS_OPTIONS: { value: SampleStatus; label: string }[] = [
  { value: SampleStatus.sampleCollected, label: "Sample Collected" },
  { value: SampleStatus.sampleReceived, label: "Sample Received" },
  { value: SampleStatus.processing, label: "Processing" },
  { value: SampleStatus.reportReady, label: "Report Ready" },
];

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminReportsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    patientId: "",
    filename: "",
    reportUrl: "",
  });
  const [uploadError, setUploadError] = useState("");

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusForm, setStatusForm] = useState<StatusForm>({
    patientId: "",
    status: SampleStatus.sampleCollected,
  });
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  const [selectedCenter, setSelectedCenter] = useState("all");
  const [centerSearch, setCenterSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [centerName, setCenterName] = useState("All Centers");

  const { data: centers = [] } = useQuery({
    queryKey: ["admin.centers", user?.token],
    queryFn: () => api.getCenters(user!.token),
    enabled: !!user?.token,
  });

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin.reports", user?.token, selectedCenter],
    queryFn: () =>
      selectedCenter === "all"
        ? api.getReportsByCenter(user!.token, "", null, null)
        : api.getReportsByCenter(user!.token, selectedCenter, null, null),
    enabled: !!user?.token,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token) throw new Error("Not logged in");
      if (
        !uploadForm.patientId ||
        !uploadForm.filename ||
        !uploadForm.reportUrl
      )
        throw new Error("Please fill all required fields.");
      return api.getReportsByPatient(user.token, uploadForm.patientId); // placeholder until uploadReport is in api service
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.reports"] });
      setUploadOpen(false);
      setUploadForm({ patientId: "", filename: "", reportUrl: "" });
    },
    onError: (e: Error) => setUploadError(e.message),
  });

  const statusMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token) throw new Error("Not logged in");
      if (!statusForm.patientId) throw new Error("Patient ID is required.");
      return api.updateSampleStatus(
        user.token,
        statusForm.patientId,
        statusForm.status,
      );
    },
    onSuccess: (result) => {
      if (!result) throw new Error("Patient not found.");
      setStatusSuccess(`Status updated for patient ${statusForm.patientId}`);
      setStatusForm({ patientId: "", status: SampleStatus.sampleCollected });
      setTimeout(() => {
        setStatusOpen(false);
        setStatusSuccess("");
      }, 1500);
    },
    onError: (e: Error) => setStatusError(e.message),
  });

  const filteredCenters = centers.filter(
    (c) =>
      centerSearch === "" ||
      c.name.toLowerCase().includes(centerSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(centerSearch.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Reports"
          subtitle="Manage patient reports and sample status"
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatusError("");
                  setStatusSuccess("");
                  setStatusOpen(true);
                }}
                data-ocid="admin.reports.update_status_button"
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                Update Status
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadError("");
                  setUploadOpen(true);
                }}
                data-ocid="admin.reports.upload_button"
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload Report
              </button>
            </div>
          }
        />

        {/* Center filter */}
        <div className="relative mb-4 mt-1">
          <input
            type="search"
            value={centerSearch}
            onChange={(e) => {
              setCenterSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={`Filtering: ${centerName}`}
            data-ocid="admin.reports.center_search_input"
            className="input-field w-full"
          />
          {showDropdown && (
            <div className="absolute z-20 left-0 right-0 mt-1 border border-border rounded-lg bg-card shadow-md overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setSelectedCenter("all");
                  setCenterName("All Centers");
                  setCenterSearch("");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border font-medium text-foreground"
              >
                All Centers
              </button>
              {filteredCenters.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCenter(c.id);
                    setCenterName(c.name);
                    setCenterSearch("");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border last:border-0"
                >
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {c.id}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-lg border border-border overflow-hidden bg-card shadow-md">
          <table className="w-full text-sm" data-ocid="admin.reports.table">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Patient ID
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  File Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Center
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Uploaded
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                  >
                    No reports uploaded yet.
                  </td>
                </tr>
              ) : (
                reports.map((r, i) => (
                  <tr
                    key={r.id.toString()}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                    data-ocid={`admin.reports.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {r.patientId}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground truncate max-w-[200px]">
                          {r.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {r.centerId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(r.uploadedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={r.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-ocid={`admin.reports.view_link.${i + 1}`}
                        className="inline-flex items-center gap-1 btn-secondary text-xs py-1.5 px-3"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div
          className="flex flex-col gap-2 md:hidden"
          data-ocid="admin.reports.list"
        >
          {isLoading ? (
            ["rsk1", "rsk2", "rsk3"].map((k) => <CardSkeleton key={k} />)
          ) : reports.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-7 h-7" />}
              title="No reports"
              description="No reports uploaded yet."
              data-ocid="admin.reports.empty_state"
            />
          ) : (
            (reports as Report[]).map((r, i) => (
              <div
                key={r.id.toString()}
                className="card-elevated p-4 flex items-center gap-3"
                data-ocid={`admin.reports.item.${i + 1}`}
              >
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {r.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Patient: {r.patientId} • {formatDate(r.uploadedAt)}
                  </p>
                </div>
                <a
                  href={r.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
                >
                  View
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Report Modal */}
      <Modal
        isOpen={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setUploadError("");
        }}
        title="Upload Report"
        data-ocid="admin.reports.upload_modal"
      >
        <div className="flex flex-col gap-3">
          {(
            [
              {
                id: "ur-pid",
                label: "Patient ID *",
                key: "patientId",
                placeholder: "e.g. P001",
              },
              {
                id: "ur-fname",
                label: "File Name *",
                key: "filename",
                placeholder: "e.g. report_john.pdf",
              },
              {
                id: "ur-url",
                label: "Report URL *",
                key: "reportUrl",
                placeholder: "https://...",
              },
            ] as {
              id: string;
              label: string;
              key: keyof UploadForm;
              placeholder: string;
            }[]
          ).map(({ id, label, key, placeholder }) => (
            <div key={key}>
              <label
                htmlFor={id}
                className="block text-xs font-semibold text-foreground mb-1"
              >
                {label}
              </label>
              <input
                id={id}
                type="text"
                value={uploadForm[key]}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, [key]: e.target.value })
                }
                placeholder={placeholder}
                data-ocid={`admin.reports.upload_modal.${key}_input`}
                className="input-field w-full"
              />
            </div>
          ))}
          {uploadError && (
            <p
              className="text-destructive text-xs"
              data-ocid="admin.reports.upload_modal.error_state"
            >
              {uploadError}
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                setUploadOpen(false);
                setUploadError("");
              }}
              data-ocid="admin.reports.upload_modal.cancel_button"
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => uploadMutation.mutate()}
              disabled={uploadMutation.isPending}
              data-ocid="admin.reports.upload_modal.confirm_button"
              className="btn-primary flex-1 py-2.5 disabled:opacity-60"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Sample Status Modal */}
      <Modal
        isOpen={statusOpen}
        onClose={() => {
          setStatusOpen(false);
          setStatusError("");
          setStatusSuccess("");
        }}
        title="Update Sample Status"
        data-ocid="admin.reports.status_modal"
      >
        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="ss-pid"
              className="block text-xs font-semibold text-foreground mb-1"
            >
              Patient ID *
            </label>
            <input
              id="ss-pid"
              type="text"
              value={statusForm.patientId}
              onChange={(e) =>
                setStatusForm({ ...statusForm, patientId: e.target.value })
              }
              placeholder="e.g. P001"
              data-ocid="admin.reports.status_modal.patient_input"
              className="input-field w-full"
            />
          </div>
          <div>
            <label
              htmlFor="ss-status"
              className="block text-xs font-semibold text-foreground mb-1"
            >
              New Status *
            </label>
            <select
              id="ss-status"
              value={statusForm.status}
              onChange={(e) =>
                setStatusForm({
                  ...statusForm,
                  status: e.target.value as SampleStatus,
                })
              }
              data-ocid="admin.reports.status_modal.status_select"
              className="input-field w-full"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Selected Status
            </p>
            <StatusBadge status={statusForm.status} />
          </div>
          {statusError && (
            <p
              className="text-destructive text-xs"
              data-ocid="admin.reports.status_modal.error_state"
            >
              {statusError}
            </p>
          )}
          {statusSuccess && (
            <p
              className="text-emerald-600 text-xs font-medium"
              data-ocid="admin.reports.status_modal.success_state"
            >
              {statusSuccess}
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                setStatusOpen(false);
                setStatusError("");
                setStatusSuccess("");
              }}
              data-ocid="admin.reports.status_modal.cancel_button"
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => statusMutation.mutate()}
              disabled={statusMutation.isPending}
              data-ocid="admin.reports.status_modal.confirm_button"
              className="btn-primary flex-1 py-2.5 disabled:opacity-60"
            >
              {statusMutation.isPending ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
