import { j as jsxRuntimeExports, S as SampleStatus, f as useAuthContext, r as reactExports } from "./index-DC8ICoH5.js";
import { A as AdminLayout } from "./AdminLayout-d_yc4e_k.js";
import { M as Modal } from "./Modal-ncSFHhz0.js";
import { c as createLucideIcon, u as useApiService } from "./api-n3_FsYjY.js";
import { F as FileText, a as FlaskConical } from "./log-out-CvArZmaA.js";
import { S as Search } from "./search-BoNK6U7a.js";
import { B as Building2 } from "./building-2-wGjg_aWl.js";
import { C as ChevronDown } from "./chevron-down-CQGfTeUJ.js";
import { E as Eye } from "./eye-Bm17uRdv.js";
import { U as User } from "./user-chrMZ9cv.js";
import { C as CalendarDays } from "./calendar-days-WP3s6UCc.js";
import { P as Phone } from "./phone-TuPSgN-P.js";
import { S as Stethoscope } from "./stethoscope-U_LB2ucD.js";
import "./x-Dn3CuYsv.js";
import "./credit-card-BSgX7_ct.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }]
];
const CloudUpload = createLucideIcon("cloud-upload", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
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
function formatDate(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
const STATUS_OPTIONS = [
  { value: SampleStatus.sampleCollected, label: "Sample Collected" },
  { value: SampleStatus.sampleReceived, label: "Sample Received" },
  { value: SampleStatus.processing, label: "Processing" },
  { value: SampleStatus.reportReady, label: "Report Ready" }
];
const STATUS_LABELS = {
  [SampleStatus.sampleCollected]: "Sample Collected",
  [SampleStatus.sampleReceived]: "Sample Received",
  [SampleStatus.processing]: "Processing",
  [SampleStatus.reportReady]: "Report Ready"
};
const SKELETON_COLS = [
  "pid",
  "name",
  "center",
  "tests",
  "date",
  "status",
  "actions"
];
function SkeletonRow({ rowIdx }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "animate-pulse", children: SKELETON_COLS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-full" }) }, `sk-${rowIdx}-${col}`)) });
}
function DetailRow({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-semibold break-words", children: value })
    ] })
  ] });
}
function AdminBookingsPage() {
  const { user } = useAuthContext();
  const api = useApiService();
  const apiRef = reactExports.useRef(api);
  apiRef.current = api;
  const token = (user == null ? void 0 : user.token) ?? "";
  const [patients, setPatients] = reactExports.useState([]);
  const [tests, setTests] = reactExports.useState([]);
  const [centers, setCenters] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [centerFilter, setCenterFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [viewPatient, setViewPatient] = reactExports.useState(null);
  const [editPatient, setEditPatient] = reactExports.useState(null);
  const [uploadPatient, setUploadPatient] = reactExports.useState(
    null
  );
  const [editStatus, setEditStatus] = reactExports.useState(
    SampleStatus.sampleCollected
  );
  const [editSaving, setEditSaving] = reactExports.useState(false);
  const [editFeedback, setEditFeedback] = reactExports.useState("idle");
  const [reportFilename, setReportFilename] = reactExports.useState("");
  const [reportUrl, setReportUrl] = reactExports.useState("");
  const [uploadSaving, setUploadSaving] = reactExports.useState(false);
  const [uploadFeedback, setUploadFeedback] = reactExports.useState("idle");
  const loadAll = reactExports.useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [p, t, c] = await Promise.all([
        apiRef.current.getAllPatients(token),
        apiRef.current.getTests(),
        apiRef.current.getCenters(token)
      ]);
      setPatients(p.sort((a, b) => Number(b.bookingDate - a.bookingDate)));
      setTests(t);
      setCenters(c);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  reactExports.useEffect(() => {
    loadAll();
  }, [loadAll]);
  const testMap = reactExports.useMemo(
    () => new Map(tests.map((t) => [t.id.toString(), t.name])),
    [tests]
  );
  const centerMap = reactExports.useMemo(
    () => new Map(centers.map((c) => [c.id, c.name])),
    [centers]
  );
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase().trim();
    return patients.filter((p) => {
      const centerName = (centerMap.get(p.centerId) ?? p.centerId).toLowerCase();
      const matchSearch = !q || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || centerName.includes(q);
      const matchCenter = centerFilter === "all" || p.centerId === centerFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchCenter && matchStatus;
    });
  }, [patients, search, centerFilter, statusFilter, centerMap]);
  function getTestNames(ids) {
    return ids.map((id) => testMap.get(id.toString()) ?? `Test #${id}`).join(", ");
  }
  function getCenterName(id) {
    return centerMap.get(id) ?? id;
  }
  const handleUpdateStatus = async () => {
    if (!editPatient) return;
    setEditSaving(true);
    setEditFeedback("idle");
    try {
      const updated = await apiRef.current.updateSampleStatus(
        token,
        editPatient.id,
        editStatus
      );
      if (updated) {
        setPatients(
          (prev) => prev.map(
            (p) => p.id === editPatient.id ? { ...p, status: editStatus } : p
          )
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
  const handleUploadReport = async () => {
    if (!uploadPatient || !reportFilename.trim() || !reportUrl.trim()) return;
    setUploadSaving(true);
    setUploadFeedback("idle");
    try {
      await apiRef.current.uploadReport(
        token,
        uploadPatient.id,
        reportFilename.trim(),
        reportUrl.trim()
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
  function openEdit(p) {
    setEditPatient(p);
    setEditStatus(p.status);
    setEditFeedback("idle");
  }
  function openUpload(p) {
    setUploadPatient(p);
    setReportFilename("");
    setReportUrl("");
    setUploadFeedback("idle");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-6 max-w-7xl mx-auto space-y-6",
        "data-ocid": "admin_bookings.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Booking & Sample Management" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Manage all patient bookings across all collection centers" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 self-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: patients.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "total bookings" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3",
              "data-ocid": "admin_bookings.filters",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "booking-search",
                      type: "text",
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search by Patient ID, name, or center...",
                      "data-ocid": "admin_bookings.search_input",
                      className: "input-field w-full pl-10",
                      "aria-label": "Search bookings"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "booking-center-filter",
                      value: centerFilter,
                      onChange: (e) => setCenterFilter(e.target.value),
                      "data-ocid": "admin_bookings.center_filter",
                      className: "input-field pl-10 pr-8 appearance-none min-w-[180px]",
                      "aria-label": "Filter by center",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Centers" }),
                        centers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "booking-status-filter",
                      value: statusFilter,
                      onChange: (e) => setStatusFilter(e.target.value),
                      "data-ocid": "admin_bookings.status_filter",
                      className: "input-field pr-8 appearance-none min-w-[180px]",
                      "aria-label": "Filter by status",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Statuses" }),
                        STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.label }, s.value))
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", "data-ocid": "admin_bookings.table", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header", children: "Patient ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header", children: "Patient Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header hidden md:table-cell", children: "Partner Center" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header hidden lg:table-cell", children: "Tests" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header hidden sm:table-cell", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "table-header text-right", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? [0, 1, 2, 3, 4].map((idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, { rowIdx: idx }, idx)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  colSpan: 7,
                  className: "py-20 text-center",
                  "data-ocid": "admin_bookings.empty_state",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-7 h-7 text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No bookings found" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: search || centerFilter !== "all" || statusFilter !== "all" ? "Try adjusting your search or filter criteria" : "No patient bookings have been created yet" })
                  ] })
                }
              ) }) : filtered.map((patient, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: `hover:bg-primary/5 transition-smooth ${i % 2 === 1 ? "bg-muted/30" : ""}`,
                  "data-ocid": `admin_bookings.row.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setViewPatient(patient),
                        "data-ocid": `admin_bookings.patient_id_link.${i + 1}`,
                        className: "font-mono text-xs font-bold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
                        children: patient.id
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell font-medium text-foreground", children: patient.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell hidden md:table-cell text-muted-foreground", children: getCenterName(patient.centerId) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell hidden lg:table-cell text-muted-foreground max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2 text-xs", children: getTestNames(patient.testIds) || "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell hidden sm:table-cell text-muted-foreground whitespace-nowrap", children: formatDate(patient.bookingDate) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: patient.status }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          title: "View Details",
                          onClick: () => setViewPatient(patient),
                          "data-ocid": `admin_bookings.view_button.${i + 1}`,
                          className: "p-2 rounded-lg hover:bg-primary/10 text-primary transition-smooth",
                          "aria-label": `View details for ${patient.name}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          title: "Update Status",
                          onClick: () => openEdit(patient),
                          "data-ocid": `admin_bookings.edit_button.${i + 1}`,
                          className: "p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-smooth",
                          "aria-label": `Update status for ${patient.name}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          title: "Upload Report",
                          onClick: () => openUpload(patient),
                          "data-ocid": `admin_bookings.upload_button.${i + 1}`,
                          className: "p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-smooth",
                          "aria-label": `Upload report for ${patient.name}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-4 h-4" })
                        }
                      )
                    ] }) })
                  ]
                },
                patient.id
              )) })
            ] }) }),
            !isLoading && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Showing",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: filtered.length }),
                " ",
                "of",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: patients.length }),
                " ",
                "bookings"
              ] }),
              (search || centerFilter !== "all" || statusFilter !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setSearch("");
                    setCenterFilter("all");
                    setStatusFilter("all");
                  },
                  "data-ocid": "admin_bookings.clear_filters",
                  className: "text-primary hover:underline font-medium",
                  children: "Clear filters"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: !!viewPatient,
        onClose: () => setViewPatient(null),
        title: "Patient Details",
        "data-ocid": "admin_bookings.view_dialog",
        children: viewPatient && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/15", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-primary", children: viewPatient.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: viewPatient.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                icon: User,
                label: "Patient Name",
                value: viewPatient.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DetailRow,
                {
                  icon: CalendarDays,
                  label: "Age",
                  value: `${viewPatient.age} years`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DetailRow,
                {
                  icon: User,
                  label: "Gender",
                  value: viewPatient.gender === "male" ? "Male" : viewPatient.gender === "female" ? "Female" : "Other"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                icon: Phone,
                label: "Mobile",
                value: viewPatient.mobile
              }
            ),
            viewPatient.refDoctor && /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                icon: Stethoscope,
                label: "Referring Doctor",
                value: viewPatient.refDoctor
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                icon: Building2,
                label: "Booked by",
                value: getCenterName(viewPatient.centerId)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                icon: CalendarDays,
                label: "Booking Date",
                value: formatDate(viewPatient.bookingDate)
              }
            )
          ] }),
          viewPatient.testIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Tests Ordered" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: viewPatient.testIds.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-3 h-3" }),
                  testMap.get(id.toString()) ?? `Test #${id}`
                ]
              },
              id.toString()
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewPatient(null),
              "data-ocid": "admin_bookings.view_close_button",
              className: "btn-secondary w-full mt-2",
              children: "Close"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: !!editPatient,
        onClose: () => {
          setEditPatient(null);
          setEditFeedback("idle");
        },
        title: "Update Sample Status",
        "data-ocid": "admin_bookings.edit_dialog",
        children: editPatient && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted/40 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Patient" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold truncate", children: [
                editPatient.name,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-primary", children: [
                  "(",
                  editPatient.id,
                  ")"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "edit-status-select",
                className: "block text-sm font-semibold text-foreground mb-1.5",
                children: "New Status"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "edit-status-select",
                  value: editStatus,
                  onChange: (e) => setEditStatus(e.target.value),
                  "data-ocid": "admin_bookings.status_select",
                  className: "input-field w-full pr-8 appearance-none",
                  children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.label }, s.value))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" })
            ] })
          ] }),
          editFeedback === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center font-medium",
              "data-ocid": "admin_bookings.status_success_state",
              children: [
                "✓ Status updated to “",
                STATUS_LABELS[editStatus],
                "”"
              ]
            }
          ),
          editFeedback === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-center font-medium",
              "data-ocid": "admin_bookings.status_error_state",
              children: "Failed to update status. Please try again."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setEditPatient(null);
                  setEditFeedback("idle");
                },
                "data-ocid": "admin_bookings.edit_cancel_button",
                className: "btn-secondary flex-1",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleUpdateStatus,
                disabled: editSaving || editFeedback === "success",
                "data-ocid": "admin_bookings.edit_save_button",
                className: "btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed",
                children: editSaving ? "Saving…" : "Save Status"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: !!uploadPatient,
        onClose: () => {
          setUploadPatient(null);
          setUploadFeedback("idle");
        },
        title: "Upload Report",
        "data-ocid": "admin_bookings.upload_dialog",
        children: uploadPatient && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted/40 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Patient" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold truncate", children: [
                uploadPatient.name,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-primary", children: [
                  "(",
                  uploadPatient.id,
                  ")"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "upload-patient-id",
                className: "block text-sm font-semibold text-foreground mb-1.5",
                children: "Patient ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "upload-patient-id",
                type: "text",
                readOnly: true,
                value: uploadPatient.id,
                "data-ocid": "admin_bookings.upload_patient_id_input",
                className: "input-field w-full bg-muted/40 text-muted-foreground cursor-not-allowed font-mono text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "upload-filename",
                className: "block text-sm font-semibold text-foreground mb-1.5",
                children: "Report Filename"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "upload-filename",
                type: "text",
                value: reportFilename,
                onChange: (e) => setReportFilename(e.target.value),
                placeholder: "e.g. CBC_Report_Apr2026.pdf",
                "data-ocid": "admin_bookings.upload_filename_input",
                className: "input-field w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "upload-url",
                className: "block text-sm font-semibold text-foreground mb-1.5",
                children: "Report PDF URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "upload-url",
                type: "url",
                value: reportUrl,
                onChange: (e) => setReportUrl(e.target.value),
                placeholder: "https://storage.example.com/report.pdf",
                "data-ocid": "admin_bookings.upload_url_input",
                className: "input-field w-full"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Paste the publicly accessible URL of the uploaded PDF" })
          ] }),
          uploadFeedback === "success" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center font-medium",
              "data-ocid": "admin_bookings.upload_success_state",
              children: "✓ Report uploaded and attached to patient"
            }
          ),
          uploadFeedback === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-center font-medium",
              "data-ocid": "admin_bookings.upload_error_state",
              children: "Upload failed. Please check the URL and try again."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUploadPatient(null);
                  setUploadFeedback("idle");
                },
                "data-ocid": "admin_bookings.upload_cancel_button",
                className: "btn-secondary flex-1",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleUploadReport,
                disabled: uploadSaving || !reportFilename.trim() || !reportUrl.trim() || uploadFeedback === "success",
                "data-ocid": "admin_bookings.upload_submit_button",
                className: "btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed",
                children: uploadSaving ? "Uploading…" : "Upload Report"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminBookingsPage as default
};
