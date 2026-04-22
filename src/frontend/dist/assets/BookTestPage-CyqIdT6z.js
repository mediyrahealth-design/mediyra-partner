import { u as useAuth, b as useQueryClient, r as reactExports, G as Gender, j as jsxRuntimeExports, a as useNavigate, c as LoadingSpinner } from "./index-DC8ICoH5.js";
import { c as createLucideIcon, u as useApiService, a as useQuery } from "./api-n3_FsYjY.js";
import { u as useMutation } from "./useMutation-B2ld5fwH.js";
import { P as PartnerLayout } from "./PartnerLayout-CTHtkMyk.js";
import { P as PageHeader } from "./PageHeader-QEyl1Cn6.js";
import { C as ChevronRight } from "./chevron-right-HvYIwGMd.js";
import { C as CircleCheckBig } from "./circle-check-big-BiCm_b-S.js";
import { U as User } from "./user-chrMZ9cv.js";
import { S as Stethoscope } from "./stethoscope-U_LB2ucD.js";
import { C as ClipboardList } from "./clipboard-list-CYXuJmZN.js";
import { X } from "./x-Dn3CuYsv.js";
import { S as Search } from "./search-BoNK6U7a.js";
import "./log-out-CvArZmaA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
function SimpleQR({ value }) {
  const size = 12;
  const activeCells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const code = value.charCodeAt((r * size + c) % value.length);
      if (code * (r + 3) * (c + 7) % 17 < 9) {
        activeCells.push({ r, c });
      }
    }
  }
  const cellPx = 6;
  const svgSize = size * cellPx + 16;
  const finderPositions = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-2 border-primary/20 rounded-xl p-3 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: svgSize,
        height: svgSize,
        viewBox: `0 0 ${svgSize} ${svgSize}`,
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        "aria-labelledby": "qr-title",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "qr-title", children: `QR code for patient ${value}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: svgSize, height: svgSize, fill: "white", rx: "4" }),
          activeCells.map(({ r, c }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: c * cellPx + 8,
              y: r * cellPx + 8,
              width: cellPx - 1,
              height: cellPx - 1,
              fill: "#1E40AF",
              rx: "0.5"
            },
            `cell-${r * size + c}`
          )),
          finderPositions.map(([fr, fc]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x: fc * cellPx + 8,
                y: fr * cellPx + 8,
                width: 7 * cellPx - 1,
                height: 7 * cellPx - 1,
                fill: "none",
                stroke: "#1E40AF",
                strokeWidth: "2",
                rx: "1"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x: fc * cellPx + 8 + cellPx * 2,
                y: fr * cellPx + 8 + cellPx * 2,
                width: 3 * cellPx - 1,
                height: 3 * cellPx - 1,
                fill: "#1E40AF",
                rx: "1"
              }
            )
          ] }, `finder-${fr}-${fc}`))
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Scan to track sample" })
  ] });
}
const STEPS = [
  { icon: User, label: "Patient Details" },
  { icon: Stethoscope, label: "Select Tests" },
  { icon: ClipboardList, label: "Confirm" }
];
function StepIndicator({ current }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1 px-4 py-3", children: STEPS.map((step, i) => {
    const Icon = step.icon;
    const done = i < current;
    const active = i === current;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-8 h-8 rounded-full flex items-center justify-center transition-smooth
                  ${done ? "bg-accent text-accent-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
            children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-[10px] font-medium leading-tight text-center ${active ? "text-primary" : done ? "text-accent" : "text-muted-foreground"}`,
            children: step.label
          }
        )
      ] }),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-10 h-0.5 mb-3 mx-0.5 rounded-full transition-smooth ${done ? "bg-accent" : "bg-border"}`
        }
      )
    ] }, step.label);
  }) });
}
function PatientDetailsStep({
  form,
  onChange,
  errors
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: "bt-name",
          className: "block text-xs font-semibold text-foreground mb-1.5",
          children: [
            "Patient Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "bt-name",
          type: "text",
          value: form.name,
          onChange: (e) => onChange({ ...form, name: e.target.value }),
          placeholder: "Full name of patient",
          "data-ocid": "book_test.name_input",
          className: `input-field w-full text-sm ${errors.name ? "border-destructive ring-destructive/20" : ""}`
        }
      ),
      errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-destructive text-xs mt-1",
          "data-ocid": "book_test.name.field_error",
          children: errors.name
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "bt-age",
            className: "block text-xs font-semibold text-foreground mb-1.5",
            children: [
              "Age ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "bt-age",
            type: "number",
            value: form.age,
            onChange: (e) => onChange({ ...form, age: e.target.value }),
            placeholder: "e.g. 35",
            min: 1,
            max: 120,
            "data-ocid": "book_test.age_input",
            className: `input-field w-full text-sm ${errors.age ? "border-destructive" : ""}`
          }
        ),
        errors.age && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-destructive text-xs mt-1",
            "data-ocid": "book_test.age.field_error",
            children: errors.age
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "block text-xs font-semibold text-foreground mb-1.5", children: [
          "Gender ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: [
          { value: Gender.male, label: "Male" },
          { value: Gender.female, label: "Female" },
          { value: Gender.other, label: "Other" }
        ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "flex items-center gap-1.5 cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "radio",
                  name: "gender",
                  value: opt.value,
                  checked: form.gender === opt.value,
                  onChange: () => onChange({ ...form, gender: opt.value }),
                  "data-ocid": `book_test.gender_${opt.label.toLowerCase()}_radio`,
                  className: "accent-primary w-3.5 h-3.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: opt.label })
            ]
          },
          opt.label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: "bt-mobile",
          className: "block text-xs font-semibold text-foreground mb-1.5",
          children: [
            "Mobile Number ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "bt-mobile",
          type: "tel",
          value: form.mobile,
          onChange: (e) => onChange({ ...form, mobile: e.target.value.replace(/\D/g, "") }),
          placeholder: "10-digit mobile number",
          maxLength: 10,
          "data-ocid": "book_test.mobile_input",
          className: `input-field w-full text-sm ${errors.mobile ? "border-destructive" : ""}`
        }
      ),
      errors.mobile && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-destructive text-xs mt-1",
          "data-ocid": "book_test.mobile.field_error",
          children: errors.mobile
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: "bt-refdoc",
          className: "block text-xs font-semibold text-foreground mb-1.5",
          children: [
            "Referring Doctor",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "bt-refdoc",
          type: "text",
          value: form.refDoctor,
          onChange: (e) => onChange({ ...form, refDoctor: e.target.value }),
          placeholder: "Dr. Name",
          "data-ocid": "book_test.ref_doctor_input",
          className: "input-field w-full text-sm"
        }
      )
    ] })
  ] });
}
function SelectTestsStep({
  tests,
  isLoading,
  selected,
  onToggle,
  search,
  onSearch,
  error
}) {
  const selectedIds = new Set(selected.map((t) => t.id.toString()));
  const filtered = tests.filter(
    (t) => search === "" || t.name.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    selected.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-wrap gap-1.5",
        "data-ocid": "book_test.selected_tests",
        children: selected.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20",
            children: [
              t.name,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onToggle(t),
                  className: "ml-0.5 hover:text-destructive transition-smooth",
                  "aria-label": `Remove ${t.name}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                }
              )
            ]
          },
          t.id.toString()
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "search",
          value: search,
          onChange: (e) => onSearch(e.target.value),
          placeholder: "Search tests (CBC, LFT, KFT...)",
          "data-ocid": "book_test.search_tests_input",
          className: "input-field w-full pl-10 text-sm"
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm", className: "py-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "max-h-52 overflow-y-auto rounded-lg border border-border divide-y divide-border",
        "data-ocid": "book_test.test_options",
        children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-center text-muted-foreground text-sm py-6",
            "data-ocid": "book_test.tests_empty_state",
            children: "No tests found"
          }
        ) : filtered.slice(0, 30).map((t, i) => {
          const checked = selectedIds.has(t.id.toString());
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              "data-ocid": `book_test.test_option.item.${i + 1}`,
              className: `flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-smooth
                    ${checked ? "bg-primary/5" : "bg-card hover:bg-muted/40"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked,
                    onChange: () => onToggle(t),
                    className: "accent-primary w-4 h-4 rounded",
                    "aria-label": `Select ${t.name}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: t.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t.category })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-primary", children: [
                    "₹",
                    t.partnerPrice.toString()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground line-through", children: [
                    "₹",
                    t.mrpPrice.toString()
                  ] })
                ] })
              ]
            },
            t.id.toString()
          );
        })
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-destructive text-xs font-medium",
        "data-ocid": "book_test.tests.field_error",
        children: error
      }
    ),
    selected.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 rounded-xl px-4 py-3 border border-primary/15 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
        selected.length,
        " test",
        selected.length > 1 ? "s" : "",
        " selected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-primary text-base", children: [
        "₹",
        selected.reduce((s, t) => s + Number(t.partnerPrice), 0)
      ] })
    ] })
  ] });
}
function ConfirmStep({
  form,
  selected
}) {
  const genderLabel = form.gender === Gender.male ? "Male" : form.gender === Gender.female ? "Female" : "Other";
  const total = selected.reduce((s, t) => s + Number(t.partnerPrice), 0);
  const detailRows = [
    { label: "Patient Name", value: form.name },
    { label: "Age", value: `${form.age} years` },
    { label: "Gender", value: genderLabel },
    { label: "Mobile", value: form.mobile },
    { label: "Ref. Doctor", value: form.refDoctor || "—" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/8 px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-primary uppercase tracking-wide", children: "Patient Information" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: detailRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: row.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: row.value })
          ]
        },
        row.label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-accent/10 px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-semibold text-accent uppercase tracking-wide", children: [
        "Selected Tests (",
        selected.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border max-h-40 overflow-y-auto", children: selected.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2",
          "data-ocid": `book_test.confirm_test.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: t.category })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary ml-2 flex-shrink-0", children: [
              "₹",
              t.partnerPrice.toString()
            ] })
          ]
        },
        t.id.toString()
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 px-3 py-2.5 border-t border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Total Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-primary text-base", children: [
          "₹",
          total
        ] })
      ] })
    ] })
  ] });
}
function SuccessScreen({
  patientId,
  onBookAnother
}) {
  const navigate = useNavigate();
  const bookingDate = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PartnerLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center px-5 pt-4 pb-8 gap-6",
      "data-ocid": "book_test.success_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center animate-slide-up", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-9 h-9 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "Booking Confirmed!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Patient registered successfully. Share the Patient ID with the lab." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated w-full max-w-xs p-5 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1", children: "Patient ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-display font-bold text-3xl text-primary tracking-widest",
                "data-ocid": "book_test.patient_id",
                children: patientId
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleQR, { value: patientId }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Booked on: ",
            bookingDate
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 w-full max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({
                to: "/track-sample",
                search: { q: patientId }
              }),
              "data-ocid": "book_test.track_sample_button",
              className: "btn-accent w-full py-3 flex items-center justify-center gap-2 font-semibold",
              children: "Track This Sample"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onBookAnother,
              "data-ocid": "book_test.book_another_button",
              className: "btn-secondary w-full py-3 font-semibold",
              children: "Book Another Patient"
            }
          )
        ] })
      ]
    }
  ) });
}
function BookTestPage() {
  const { user } = useAuth();
  const api = useApiService();
  const queryClient = useQueryClient();
  const [step, setStep] = reactExports.useState(0);
  const [form, setForm] = reactExports.useState({
    name: "",
    age: "",
    gender: Gender.male,
    mobile: "",
    refDoctor: ""
  });
  const [selectedTests, setSelectedTests] = reactExports.useState([]);
  const [testSearch, setTestSearch] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [patientId, setPatientId] = reactExports.useState(null);
  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: () => api.getTests()
  });
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      return api.bookPatient(user.token, {
        name: form.name.trim(),
        age: BigInt(form.age),
        gender: form.gender,
        mobile: form.mobile.trim(),
        refDoctor: form.refDoctor.trim(),
        testIds: selectedTests.map((t) => t.id)
      });
    },
    onSuccess: (id) => {
      setPatientId(id);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    }
  });
  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Patient name is required";
    if (!form.age || Number.isNaN(Number(form.age)) || Number(form.age) < 1)
      errs.age = "Valid age required";
    if (!form.mobile || form.mobile.length !== 10)
      errs.mobile = "Enter a valid 10-digit mobile number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const validateStep2 = () => {
    if (selectedTests.length === 0) {
      setErrors({ tests: "Please select at least one test" });
      return false;
    }
    setErrors({});
    return true;
  };
  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    setErrors({});
    setStep((s) => s + 1);
  };
  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };
  const handleToggleTest = (t) => {
    setSelectedTests(
      (prev) => prev.find((s) => s.id === t.id) ? prev.filter((s) => s.id !== t.id) : [...prev, t]
    );
  };
  const resetAll = () => {
    setStep(0);
    setForm({
      name: "",
      age: "",
      gender: Gender.male,
      mobile: "",
      refDoctor: ""
    });
    setSelectedTests([]);
    setTestSearch("");
    setErrors({});
    setPatientId(null);
  };
  if (patientId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessScreen, { patientId, onBookAnother: resetAll });
  }
  const stepTitles = ["Patient Details", "Select Tests", "Review & Confirm"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PartnerLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Book Patient Test",
        subtitle: "Register a new patient for lab tests"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "card-elevated p-4",
          "data-ocid": `book_test.step_${step + 1}_panel`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-4 pb-3 border-b border-border", children: stepTitles[step] }),
            step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              PatientDetailsStep,
              {
                form,
                onChange: setForm,
                errors
              }
            ),
            step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTestsStep,
              {
                tests,
                isLoading: testsLoading,
                selected: selectedTests,
                onToggle: handleToggleTest,
                search: testSearch,
                onSearch: setTestSearch,
                error: errors.tests
              }
            ),
            step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmStep, { form, selected: selectedTests })
          ]
        }
      ),
      bookMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-destructive text-sm font-medium mt-3",
          "data-ocid": "book_test.error_state",
          children: bookMutation.error instanceof Error ? bookMutation.error.message : "Something went wrong. Please try again."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4", children: [
        step > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleBack,
            "data-ocid": "book_test.back_button",
            className: "btn-secondary flex-1 py-3 flex items-center justify-center gap-2 font-semibold",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              "Back"
            ]
          }
        ),
        step < 2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleNext,
            "data-ocid": "book_test.next_button",
            className: "btn-primary flex-1 py-3 flex items-center justify-center gap-2 font-semibold",
            children: [
              "Next",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => bookMutation.mutate(),
            disabled: bookMutation.isPending,
            "data-ocid": "book_test.submit_button",
            className: "btn-accent flex-1 py-3 flex items-center justify-center gap-2 font-semibold disabled:opacity-60",
            children: bookMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" }),
              "Booking..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
              "Confirm Booking"
            ] })
          }
        )
      ] })
    ] })
  ] });
}
export {
  BookTestPage as default
};
