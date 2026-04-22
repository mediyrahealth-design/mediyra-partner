import { u as useAuth, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, S as SampleStatus } from "./index-DC8ICoH5.js";
import { c as createLucideIcon, u as useApiService, a as useQuery } from "./api-n3_FsYjY.js";
import { u as useMutation } from "./useMutation-B2ld5fwH.js";
import { A as AdminLayout } from "./AdminLayout-d_yc4e_k.js";
import { M as Modal } from "./Modal-ncSFHhz0.js";
import { P as PageHeader } from "./PageHeader-QEyl1Cn6.js";
import { S as Search } from "./search-BoNK6U7a.js";
import { C as CalendarDays } from "./calendar-days-WP3s6UCc.js";
import { F as FileSearch, E as ExternalLink } from "./file-search-D8BlfQrP.js";
import { F as FileText } from "./log-out-CvArZmaA.js";
import { D as Download } from "./download-44AthqLy.js";
import { C as CircleCheck } from "./circle-check-D37CQIOC.js";
import "./x-Dn3CuYsv.js";
import "./building-2-wGjg_aWl.js";
import "./credit-card-BSgX7_ct.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
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
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatDateTime(ts) {
  return new Date(Number(ts)).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function dateStringToTimestamp(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return BigInt(d.getTime());
}
const SKELETON_ROWS = [
  { id: "a", widths: [140, 180, 120, 130, 80] },
  { id: "b", widths: [110, 160, 130, 90, 80] },
  { id: "c", widths: [150, 140, 100, 150, 80] },
  { id: "d", widths: [120, 170, 110, 120, 80] },
  { id: "e", widths: [100, 150, 140, 80, 80] }
];
const SKELETON_CELL_IDS = ["p", "c", "d", "f", "a"];
function TableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: SKELETON_ROWS.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border last:border-0", children: row.widths.map((w, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-3.5 rounded bg-muted animate-pulse",
      style: { width: `${w}px`, maxWidth: "100%" }
    }
  ) }, SKELETON_CELL_IDS[ci])) }, row.id)) });
}
function MobileCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card rounded-xl border border-border p-4 flex gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-muted animate-pulse flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 bg-muted animate-pulse rounded w-2/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted animate-pulse rounded w-1/2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-8 bg-muted animate-pulse rounded-lg flex-shrink-0" })
      ]
    },
    i
  )) });
}
function AdminReportsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();
  const [selectedCenter, setSelectedCenter] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [patientSearch, setPatientSearch] = reactExports.useState("");
  const [centerDropdownOpen, setCenterDropdownOpen] = reactExports.useState(false);
  const [centerSearchInput, setCenterSearchInput] = reactExports.useState("");
  const [uploadOpen, setUploadOpen] = reactExports.useState(false);
  const [uploadForm, setUploadForm] = reactExports.useState({
    patientId: "",
    filename: "",
    reportUrl: "",
    markReportReady: true
  });
  const [uploadError, setUploadError] = reactExports.useState("");
  const [uploadSuccess, setUploadSuccess] = reactExports.useState(false);
  const { data: centers = [] } = useQuery({
    queryKey: ["admin.centers", user == null ? void 0 : user.token],
    queryFn: () => api.getCenters(user.token),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const tsFrom = reactExports.useMemo(() => dateStringToTimestamp(dateFrom), [dateFrom]);
  const tsTo = reactExports.useMemo(() => dateStringToTimestamp(dateTo), [dateTo]);
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin.reports", user == null ? void 0 : user.token, selectedCenter, tsFrom, tsTo],
    queryFn: () => api.getReportsByCenter(
      user.token,
      selectedCenter === "all" ? "" : selectedCenter,
      tsFrom,
      tsTo
    ),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const centerMap = reactExports.useMemo(() => {
    const m = {};
    for (const c of centers) m[c.id] = c.name;
    return m;
  }, [centers]);
  const filteredReports = reactExports.useMemo(() => {
    if (!patientSearch.trim()) return reports;
    const q = patientSearch.trim().toLowerCase();
    return reports.filter((r) => r.patientId.toLowerCase().includes(q));
  }, [reports, patientSearch]);
  const filteredCenterOptions = reactExports.useMemo(() => {
    if (!centerSearchInput) return centers;
    const q = centerSearchInput.toLowerCase();
    return centers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
  }, [centers, centerSearchInput]);
  const selectedCenterName = selectedCenter === "all" ? "All Centers" : centerMap[selectedCenter] ?? selectedCenter;
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in.");
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
        reportUrl.trim()
      );
      if (markReportReady) {
        await api.updateSampleStatus(
          user.token,
          patientId.trim(),
          SampleStatus.reportReady
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.reports"] });
      setUploadSuccess(true);
    },
    onError: (e) => setUploadError(e.message)
  });
  function openUploadModal() {
    setUploadForm({
      patientId: "",
      filename: "",
      reportUrl: "",
      markReportReady: true
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
  function handleUploadField(key, value) {
    setUploadForm((prev) => ({ ...prev, [key]: value }));
    setUploadError("");
  }
  function handleUploadSubmit() {
    setUploadError("");
    uploadMutation.mutate();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Report Management",
          subtitle: "Upload and manage patient lab reports",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: openUploadModal,
              "data-ocid": "admin.reports.upload_button",
              className: "btn-primary flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                "Upload Report"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[180px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-patient-id",
                className: "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide",
                children: "Patient ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "filter-patient-id",
                  type: "search",
                  value: patientSearch,
                  onChange: (e) => setPatientSearch(e.target.value),
                  placeholder: "e.g. PT-2024-001",
                  "data-ocid": "admin.reports.patient_search_input",
                  className: "input-field w-full pl-9"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[180px] relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-center-btn",
                className: "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide",
                children: "Collection Center"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                id: "filter-center-btn",
                type: "button",
                onClick: () => setCenterDropdownOpen((v) => !v),
                "data-ocid": "admin.reports.center_filter_select",
                className: "input-field w-full flex items-center gap-2 text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-sm", children: selectedCenterName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      "aria-hidden": "true",
                      className: "w-4 h-4 text-muted-foreground flex-shrink-0",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M19 9l-7 7-7-7"
                        }
                      )
                    }
                  )
                ]
              }
            ),
            centerDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-30 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "search",
                  value: centerSearchInput,
                  onChange: (e) => setCenterSearchInput(e.target.value),
                  placeholder: "Search centers...",
                  "data-ocid": "admin.reports.center_search_input",
                  className: "input-field w-full text-sm"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-48 overflow-y-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedCenter("all");
                      setCenterDropdownOpen(false);
                      setCenterSearchInput("");
                    },
                    className: "w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm font-semibold text-foreground border-b border-border",
                    children: "All Centers"
                  }
                ),
                filteredCenterOptions.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedCenter(c.id);
                      setCenterDropdownOpen(false);
                      setCenterSearchInput("");
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
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[150px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-date-from",
                className: "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide",
                children: "From Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "filter-date-from",
                  type: "date",
                  value: dateFrom,
                  onChange: (e) => setDateFrom(e.target.value),
                  "data-ocid": "admin.reports.date_from_input",
                  className: "input-field pl-9 w-full"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[150px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-date-to",
                className: "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide",
                children: "To Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "filter-date-to",
                  type: "date",
                  value: dateTo,
                  onChange: (e) => setDateTo(e.target.value),
                  "data-ocid": "admin.reports.date_to_input",
                  className: "input-field pl-9 w-full"
                }
              )
            ] })
          ] }),
          (patientSearch || selectedCenter !== "all" || dateFrom || dateTo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setPatientSearch("");
                setSelectedCenter("all");
                setDateFrom("");
                setDateTo("");
              },
              "data-ocid": "admin.reports.clear_filters_button",
              className: "btn-secondary text-sm h-10 px-4 self-end",
              children: "Clear"
            }
          )
        ] }),
        (selectedCenter !== "all" || dateFrom || dateTo) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-3 pt-3 border-t border-border", children: [
          selectedCenter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3 h-3" }),
            selectedCenterName
          ] }),
          dateFrom && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium", children: [
            "From: ",
            dateFrom
          ] }),
          dateTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium", children: [
            "To: ",
            dateTo
          ] })
        ] })
      ] }),
      !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: filteredReports.length === 0 ? "No reports found" : `Showing ${filteredReports.length} report${filteredReports.length !== 1 ? "s" : ""}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-xl border border-border overflow-hidden bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.reports.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Patient ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Collection Center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Upload Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Filename" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3.5 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : filteredReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-6 h-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No reports found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "No reports found for the selected filters" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: openUploadModal,
              "data-ocid": "admin.reports.empty_state.upload_button",
              className: "btn-primary text-sm mt-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
                "Upload First Report"
              ]
            }
          )
        ] }) }) }) : filteredReports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: `border-b border-border last:border-0 hover:bg-muted/20 transition-smooth ${i % 2 === 1 ? "bg-muted/10" : ""}`,
            "data-ocid": `admin.reports.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 font-mono text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md font-semibold", children: r.patientId }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: centerMap[r.centerId] ?? r.centerId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: r.centerId })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm", children: formatDate(r.uploadedAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(Number(r.uploadedAt)).toLocaleTimeString(
                  "en-IN",
                  { hour: "2-digit", minute: "2-digit" }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 max-w-[220px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 text-rose-500" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm truncate", children: r.filename })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: r.reportUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    "data-ocid": `admin.reports.view_link.${i + 1}`,
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground bg-card hover:bg-muted transition-smooth text-xs font-medium",
                    title: "View report",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                      "View"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: r.reportUrl,
                    download: r.filename,
                    target: "_blank",
                    rel: "noreferrer",
                    "data-ocid": `admin.reports.download_link.${i + 1}`,
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth text-xs font-medium",
                    title: "Download report",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                      "Download"
                    ]
                  }
                )
              ] }) })
            ]
          },
          r.id.toString()
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-3 md:hidden",
          "data-ocid": "admin.reports.list",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(MobileCardSkeleton, {}) : filteredReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-3 py-12 text-center",
              "data-ocid": "admin.reports.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-7 h-7 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No reports found" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "No reports found for the selected filters" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: openUploadModal,
                    "data-ocid": "admin.reports.empty_state.upload_button",
                    className: "btn-primary text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
                      "Upload Report"
                    ]
                  }
                )
              ]
            }
          ) : filteredReports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-4 shadow-sm flex items-start gap-3",
              "data-ocid": `admin.reports.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-rose-500" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: r.filename }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Patient:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-primary", children: r.patientId })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    centerMap[r.centerId] ?? r.centerId,
                    " ·",
                    " ",
                    formatDateTime(r.uploadedAt)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: r.reportUrl,
                      target: "_blank",
                      rel: "noreferrer",
                      "data-ocid": `admin.reports.view_link.${i + 1}`,
                      className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground bg-card hover:bg-muted transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                        "View"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: r.reportUrl,
                      download: r.filename,
                      target: "_blank",
                      rel: "noreferrer",
                      "data-ocid": `admin.reports.download_link.${i + 1}`,
                      className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                        "Save"
                      ]
                    }
                  )
                ] })
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
        onClose: closeUploadModal,
        title: "Upload Report",
        "data-ocid": "admin.reports.upload_modal",
        children: uploadSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 py-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-7 h-7 text-emerald-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-base", children: "Report Uploaded!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              "Report for patient",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary", children: uploadForm.patientId }),
              " ",
              "has been successfully uploaded.",
              uploadForm.markReportReady && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block mt-0.5", children: "Sample status marked as Report Ready." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUploadSuccess(false);
                  setUploadForm({
                    patientId: "",
                    filename: "",
                    reportUrl: "",
                    markReportReady: true
                  });
                },
                "data-ocid": "admin.reports.upload_modal.upload_another_button",
                className: "btn-secondary flex-1 py-2.5",
                children: "Upload Another"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: closeUploadModal,
                "data-ocid": "admin.reports.upload_modal.close_button",
                className: "btn-primary flex-1 py-2.5",
                children: "Done"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "ur-pid",
                className: "block text-xs font-semibold text-foreground mb-1.5",
                children: [
                  "Patient ID ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ur-pid",
                type: "text",
                value: uploadForm.patientId,
                onChange: (e) => handleUploadField("patientId", e.target.value),
                placeholder: "e.g. PT-2024-001",
                "data-ocid": "admin.reports.upload_modal.patientId_input",
                className: "input-field w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "ur-fname",
                className: "block text-xs font-semibold text-foreground mb-1.5",
                children: [
                  "Report Filename ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ur-fname",
                type: "text",
                value: uploadForm.filename,
                onChange: (e) => handleUploadField("filename", e.target.value),
                placeholder: "e.g. CBC_report_john.pdf",
                "data-ocid": "admin.reports.upload_modal.filename_input",
                className: "input-field w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "ur-url",
                className: "block text-xs font-semibold text-foreground mb-1.5",
                children: [
                  "Report URL ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ur-url",
                type: "url",
                value: uploadForm.reportUrl,
                onChange: (e) => handleUploadField("reportUrl", e.target.value),
                placeholder: "https://storage.example.com/report.pdf",
                "data-ocid": "admin.reports.upload_modal.reportUrl_input",
                className: "input-field w-full"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Paste the public PDF URL from your storage service." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "ur-status",
              className: "flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 transition-smooth",
              "data-ocid": "admin.reports.upload_modal.mark_ready_checkbox",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ur-status",
                    type: "checkbox",
                    checked: uploadForm.markReportReady,
                    onChange: (e) => handleUploadField("markReportReady", e.target.checked),
                    className: "mt-0.5 accent-primary w-4 h-4 flex-shrink-0 cursor-pointer"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Also mark sample as Report Ready" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: 'Updates the sample status to "Report Ready" so the collection center can notify the patient.' })
                ] })
              ]
            }
          ),
          uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5",
              "data-ocid": "admin.reports.upload_modal.error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "svg",
                  {
                    "aria-hidden": "true",
                    className: "w-4 h-4 flex-shrink-0",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      }
                    )
                  }
                ),
                uploadError
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: closeUploadModal,
                "data-ocid": "admin.reports.upload_modal.cancel_button",
                className: "btn-secondary flex-1 py-2.5",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleUploadSubmit,
                disabled: uploadMutation.isPending,
                "data-ocid": "admin.reports.upload_modal.confirm_button",
                className: "btn-primary flex-1 py-2.5 disabled:opacity-60 flex items-center justify-center gap-2",
                children: uploadMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "svg",
                    {
                      "aria-hidden": "true",
                      className: "w-4 h-4 animate-spin",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "circle",
                          {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          }
                        )
                      ]
                    }
                  ),
                  "Uploading..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                  "Upload Report"
                ] })
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
