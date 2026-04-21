import { j as jsxRuntimeExports, S as SampleStatus, u as useAuth, b as useQueryClient, r as reactExports, e as CardSkeleton } from "./index-JOqAemMk.js";
import { c as createLucideIcon, u as useApiService, a as useQuery } from "./api-BJm7cS3U.js";
import { u as useMutation } from "./useMutation-3PZEnUl4.js";
import { A as AdminLayout } from "./AdminLayout-B-HiSuMY.js";
import { E as EmptyState } from "./EmptyState-Bs2VlqML.js";
import { M as Modal } from "./Modal-CS88njSf.js";
import { P as PageHeader } from "./PageHeader-CYQif57L.js";
import { F as FileText } from "./log-out-D-etv4XY.js";
import { E as ExternalLink } from "./external-link-BxK_00za.js";
import "./x-DzgZfkJo.js";
import "./credit-card-D3csqvbz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const STATUS_CONFIG = {
  [SampleStatus.sampleCollected]: {
    label: "Sample Collected",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-400"
  },
  [SampleStatus.sampleReceived]: {
    label: "Sample Received",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    dot: "bg-indigo-400"
  },
  [SampleStatus.processing]: {
    label: "Processing",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400"
  },
  [SampleStatus.reportReady]: {
    label: "Report Ready",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400"
  }
};
function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${config.dot}` }),
        config.label
      ]
    }
  );
}
const STATUS_OPTIONS = [
  { value: SampleStatus.sampleCollected, label: "Sample Collected" },
  { value: SampleStatus.sampleReceived, label: "Sample Received" },
  { value: SampleStatus.processing, label: "Processing" },
  { value: SampleStatus.reportReady, label: "Report Ready" }
];
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function AdminReportsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = reactExports.useState(false);
  const [uploadForm, setUploadForm] = reactExports.useState({
    patientId: "",
    filename: "",
    reportUrl: ""
  });
  const [uploadError, setUploadError] = reactExports.useState("");
  const [statusOpen, setStatusOpen] = reactExports.useState(false);
  const [statusForm, setStatusForm] = reactExports.useState({
    patientId: "",
    status: SampleStatus.sampleCollected
  });
  const [statusError, setStatusError] = reactExports.useState("");
  const [statusSuccess, setStatusSuccess] = reactExports.useState("");
  const [selectedCenter, setSelectedCenter] = reactExports.useState("all");
  const [centerSearch, setCenterSearch] = reactExports.useState("");
  const [showDropdown, setShowDropdown] = reactExports.useState(false);
  const [centerName, setCenterName] = reactExports.useState("All Centers");
  const { data: centers = [] } = useQuery({
    queryKey: ["admin.centers", user == null ? void 0 : user.token],
    queryFn: () => api.getCenters(user.token),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin.reports", user == null ? void 0 : user.token, selectedCenter],
    queryFn: () => selectedCenter === "all" ? api.getReportsByCenter(user.token, "", null, null) : api.getReportsByCenter(user.token, selectedCenter, null, null),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      if (!uploadForm.patientId || !uploadForm.filename || !uploadForm.reportUrl)
        throw new Error("Please fill all required fields.");
      return api.getReportsByPatient(user.token, uploadForm.patientId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.reports"] });
      setUploadOpen(false);
      setUploadForm({ patientId: "", filename: "", reportUrl: "" });
    },
    onError: (e) => setUploadError(e.message)
  });
  const statusMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      if (!statusForm.patientId) throw new Error("Patient ID is required.");
      return api.updateSampleStatus(
        user.token,
        statusForm.patientId,
        statusForm.status
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
    onError: (e) => setStatusError(e.message)
  });
  const filteredCenters = centers.filter(
    (c) => centerSearch === "" || c.name.toLowerCase().includes(centerSearch.toLowerCase()) || c.id.toLowerCase().includes(centerSearch.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Reports",
          subtitle: "Manage patient reports and sample status",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatusError("");
                  setStatusSuccess("");
                  setStatusOpen(true);
                },
                "data-ocid": "admin.reports.update_status_button",
                className: "btn-secondary flex items-center gap-2 text-sm",
                children: "Update Status"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUploadError("");
                  setUploadOpen(true);
                },
                "data-ocid": "admin.reports.upload_button",
                className: "btn-primary flex items-center gap-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                  "Upload Report"
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "search",
            value: centerSearch,
            onChange: (e) => {
              setCenterSearch(e.target.value);
              setShowDropdown(true);
            },
            onFocus: () => setShowDropdown(true),
            placeholder: `Filtering: ${centerName}`,
            "data-ocid": "admin.reports.center_search_input",
            className: "input-field w-full"
          }
        ),
        showDropdown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-20 left-0 right-0 mt-1 border border-border rounded-lg bg-card shadow-md overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedCenter("all");
                setCenterName("All Centers");
                setCenterSearch("");
                setShowDropdown(false);
              },
              className: "w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border font-medium text-foreground",
              children: "All Centers"
            }
          ),
          filteredCenters.slice(0, 6).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedCenter(c.id);
                setCenterName(c.name);
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
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-lg border border-border overflow-hidden bg-card shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.reports.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Patient ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "File Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Uploaded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 5,
            className: "px-4 py-8 text-center text-muted-foreground text-sm",
            children: "Loading..."
          }
        ) }) : reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 5,
            className: "px-4 py-10 text-center text-muted-foreground text-sm",
            children: "No reports uploaded yet."
          }
        ) }) : reports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-smooth",
            "data-ocid": `admin.reports.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: r.patientId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 text-primary flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[200px]", children: r.filename })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs", children: r.centerId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: formatDate(r.uploadedAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: r.reportUrl,
                  target: "_blank",
                  rel: "noreferrer",
                  "data-ocid": `admin.reports.view_link.${i + 1}`,
                  className: "inline-flex items-center gap-1 btn-secondary text-xs py-1.5 px-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                    "View"
                  ]
                }
              ) })
            ]
          },
          r.id.toString()
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-2 md:hidden",
          "data-ocid": "admin.reports.list",
          children: isLoading ? ["rsk1", "rsk2", "rsk3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}, k)) : reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-7 h-7" }),
              title: "No reports",
              description: "No reports uploaded yet.",
              "data-ocid": "admin.reports.empty_state"
            }
          ) : reports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "card-elevated p-4 flex items-center gap-3",
              "data-ocid": `admin.reports.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-primary flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: r.filename }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Patient: ",
                    r.patientId,
                    " • ",
                    formatDate(r.uploadedAt)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: r.reportUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "btn-secondary text-xs py-1.5 px-3 flex-shrink-0",
                    children: "View"
                  }
                )
              ]
            },
            r.id.toString()
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: uploadOpen,
        onClose: () => {
          setUploadOpen(false);
          setUploadError("");
        },
        title: "Upload Report",
        "data-ocid": "admin.reports.upload_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          [
            {
              id: "ur-pid",
              label: "Patient ID *",
              key: "patientId",
              placeholder: "e.g. P001"
            },
            {
              id: "ur-fname",
              label: "File Name *",
              key: "filename",
              placeholder: "e.g. report_john.pdf"
            },
            {
              id: "ur-url",
              label: "Report URL *",
              key: "reportUrl",
              placeholder: "https://..."
            }
          ].map(({ id, label, key, placeholder }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: id,
                className: "block text-xs font-semibold text-foreground mb-1",
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id,
                type: "text",
                value: uploadForm[key],
                onChange: (e) => setUploadForm({ ...uploadForm, [key]: e.target.value }),
                placeholder,
                "data-ocid": `admin.reports.upload_modal.${key}_input`,
                className: "input-field w-full"
              }
            )
          ] }, key)),
          uploadError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs",
              "data-ocid": "admin.reports.upload_modal.error_state",
              children: uploadError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUploadOpen(false);
                  setUploadError("");
                },
                "data-ocid": "admin.reports.upload_modal.cancel_button",
                className: "btn-secondary flex-1 py-2.5",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => uploadMutation.mutate(),
                disabled: uploadMutation.isPending,
                "data-ocid": "admin.reports.upload_modal.confirm_button",
                className: "btn-primary flex-1 py-2.5 disabled:opacity-60",
                children: uploadMutation.isPending ? "Uploading..." : "Upload"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: statusOpen,
        onClose: () => {
          setStatusOpen(false);
          setStatusError("");
          setStatusSuccess("");
        },
        title: "Update Sample Status",
        "data-ocid": "admin.reports.status_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ss-pid",
                className: "block text-xs font-semibold text-foreground mb-1",
                children: "Patient ID *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ss-pid",
                type: "text",
                value: statusForm.patientId,
                onChange: (e) => setStatusForm({ ...statusForm, patientId: e.target.value }),
                placeholder: "e.g. P001",
                "data-ocid": "admin.reports.status_modal.patient_input",
                className: "input-field w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ss-status",
                className: "block text-xs font-semibold text-foreground mb-1",
                children: "New Status *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "ss-status",
                value: statusForm.status,
                onChange: (e) => setStatusForm({
                  ...statusForm,
                  status: e.target.value
                }),
                "data-ocid": "admin.reports.status_modal.status_select",
                className: "input-field w-full",
                children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/50 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium mb-1", children: "Selected Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: statusForm.status })
          ] }),
          statusError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs",
              "data-ocid": "admin.reports.status_modal.error_state",
              children: statusError
            }
          ),
          statusSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-emerald-600 text-xs font-medium",
              "data-ocid": "admin.reports.status_modal.success_state",
              children: statusSuccess
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatusOpen(false);
                  setStatusError("");
                  setStatusSuccess("");
                },
                "data-ocid": "admin.reports.status_modal.cancel_button",
                className: "btn-secondary flex-1 py-2.5",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => statusMutation.mutate(),
                disabled: statusMutation.isPending,
                "data-ocid": "admin.reports.status_modal.confirm_button",
                className: "btn-primary flex-1 py-2.5 disabled:opacity-60",
                children: statusMutation.isPending ? "Updating..." : "Update Status"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminReportsPage as default
};
