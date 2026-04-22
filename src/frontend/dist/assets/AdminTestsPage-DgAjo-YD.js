import { u as useAuth, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, e as CardSkeleton } from "./index-DC8ICoH5.js";
import { c as createLucideIcon, u as useApiService, a as useQuery } from "./api-n3_FsYjY.js";
import { u as useMutation } from "./useMutation-B2ld5fwH.js";
import { A as AdminLayout } from "./AdminLayout-d_yc4e_k.js";
import { E as EmptyState } from "./EmptyState-BedOWtud.js";
import { M as Modal } from "./Modal-ncSFHhz0.js";
import { P as PageHeader } from "./PageHeader-QEyl1Cn6.js";
import { P as Plus } from "./plus-C5zBxfHu.js";
import { S as Search } from "./search-BoNK6U7a.js";
import { a as FlaskConical } from "./log-out-CvArZmaA.js";
import { P as Pen } from "./pen--l4zCm6Z.js";
import "./x-Dn3CuYsv.js";
import "./building-2-wGjg_aWl.js";
import "./credit-card-BSgX7_ct.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const emptyTestForm = {
  name: "",
  category: "",
  sampleType: "",
  tubeType: "",
  fastingRequired: false,
  reportTime: "",
  mrpPrice: "",
  partnerPrice: ""
};
const textFields = [
  { id: "tf-name", label: "Test Name *", key: "name", placeholder: "e.g. CBC" },
  {
    id: "tf-cat",
    label: "Category *",
    key: "category",
    placeholder: "e.g. Haematology"
  },
  {
    id: "tf-sample",
    label: "Sample Type *",
    key: "sampleType",
    placeholder: "e.g. Blood"
  },
  {
    id: "tf-tube",
    label: "Tube Type",
    key: "tubeType",
    placeholder: "e.g. EDTA"
  },
  {
    id: "tf-time",
    label: "Report Time",
    key: "reportTime",
    placeholder: "e.g. 6 hours"
  },
  {
    id: "tf-mrp",
    label: "MRP Price (₹) *",
    key: "mrpPrice",
    placeholder: "e.g. 500",
    type: "number"
  },
  {
    id: "tf-partner",
    label: "Partner Price (₹) *",
    key: "partnerPrice",
    placeholder: "e.g. 350",
    type: "number"
  }
];
function TestFormFields({
  form,
  setForm,
  prefix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    textFields.map(({ id, label, key, placeholder, type }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: `${prefix}-${id}`,
          className: "block text-xs font-semibold text-foreground mb-1",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: `${prefix}-${id}`,
          type: type ?? "text",
          value: form[key],
          onChange: (e) => setForm({ ...form, [key]: e.target.value }),
          placeholder,
          className: "input-field w-full"
        }
      )
    ] }, key)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: `${prefix}-fasting`,
          type: "checkbox",
          checked: form.fastingRequired,
          onChange: (e) => setForm({ ...form, fastingRequired: e.target.checked }),
          className: "w-4 h-4 accent-primary",
          "data-ocid": `${prefix}.fasting_checkbox`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: `${prefix}-fasting`,
          className: "text-sm text-foreground font-medium",
          children: "Fasting Required"
        }
      )
    ] })
  ] });
}
function AdminTestsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [addForm, setAddForm] = reactExports.useState(emptyTestForm);
  const [addError, setAddError] = reactExports.useState("");
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [editForm, setEditForm] = reactExports.useState(emptyTestForm);
  const [editError, setEditError] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: () => api.getTests()
  });
  const filtered = tests.filter(
    (t) => search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
  );
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      if (!addForm.name || !addForm.category || !addForm.sampleType || !addForm.mrpPrice || !addForm.partnerPrice)
        throw new Error("Please fill all required fields.");
      return api.addTest(
        user.token,
        addForm.name,
        addForm.category,
        addForm.sampleType,
        addForm.tubeType,
        addForm.fastingRequired,
        addForm.reportTime,
        BigInt(Math.round(Number(addForm.mrpPrice))),
        BigInt(Math.round(Number(addForm.partnerPrice)))
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
      setAddOpen(false);
      setAddForm(emptyTestForm);
    },
    onError: (e) => setAddError(e.message)
  });
  const editMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token) || !editTarget) throw new Error("Not logged in");
      if (!editForm.name || !editForm.category || !editForm.sampleType || !editForm.mrpPrice || !editForm.partnerPrice)
        throw new Error("Please fill all required fields.");
      return api.updateTest(user.token, {
        id: editTarget.id,
        name: editForm.name,
        category: editForm.category,
        sampleType: editForm.sampleType,
        tubeType: editForm.tubeType,
        fastingRequired: editForm.fastingRequired,
        reportTime: editForm.reportTime,
        mrpPrice: BigInt(Math.round(Number(editForm.mrpPrice))),
        partnerPrice: BigInt(Math.round(Number(editForm.partnerPrice)))
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
      setEditOpen(false);
      setEditTarget(null);
    },
    onError: (e) => setEditError(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      return api.deleteTest(user.token, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tests"] })
  });
  function openEdit(test) {
    setEditTarget(test);
    setEditForm({
      name: test.name,
      category: test.category,
      sampleType: test.sampleType,
      tubeType: test.tubeType,
      fastingRequired: test.fastingRequired,
      reportTime: test.reportTime,
      mrpPrice: test.mrpPrice.toString(),
      partnerPrice: test.partnerPrice.toString()
    });
    setEditError("");
    setEditOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Lab Tests",
          subtitle: `${tests.length} tests in catalog`,
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setAddError("");
                setAddOpen(true);
              },
              "data-ocid": "admin.tests.add_button",
              className: "btn-primary flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Add Test"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "search",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search by name or category...",
            "data-ocid": "admin.tests.search_input",
            className: "input-field w-full pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-lg border border-border overflow-hidden bg-card shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.tests.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Test Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Sample" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "MRP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Partner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Fasting" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Report Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 8,
            className: "px-4 py-8 text-center text-muted-foreground text-sm",
            children: "Loading..."
          }
        ) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 8,
            className: "px-4 py-10 text-center text-muted-foreground text-sm",
            children: "No tests found."
          }
        ) }) : filtered.map((test, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-smooth",
            "data-ocid": `admin.tests.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-3.5 h-3.5 text-primary flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: test.name })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium", children: test.category }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: test.sampleType }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right text-muted-foreground line-through", children: [
                "₹",
                test.mrpPrice.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-bold text-primary", children: [
                "₹",
                test.partnerPrice.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-block w-2 h-2 rounded-full ${test.fastingRequired ? "bg-warning" : "bg-muted-foreground/30"}`,
                  "aria-label": test.fastingRequired ? "Yes" : "No"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: test.reportTime }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => openEdit(test),
                    "data-ocid": `admin.tests.edit_button.${i + 1}`,
                    className: "p-1.5 rounded-lg hover:bg-muted transition-smooth",
                    "aria-label": "Edit test",
                    title: "Edit test",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 text-muted-foreground" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteMutation.mutate(test.id),
                    "data-ocid": `admin.tests.delete_button.${i + 1}`,
                    className: "p-1.5 rounded-lg hover:bg-destructive/10 transition-smooth text-muted-foreground hover:text-destructive",
                    "aria-label": "Delete test",
                    title: "Delete test",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          test.id.toString()
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-2 md:hidden",
          "data-ocid": "admin.tests.list",
          children: isLoading ? ["tsk1", "tsk2", "tsk3", "tsk4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}, k)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-7 h-7" }),
              title: "No tests found",
              description: "Add your first lab test to the catalog.",
              "data-ocid": "admin.tests.empty_state"
            }
          ) : filtered.map((test, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "card-elevated p-4 flex items-center gap-3",
              "data-ocid": `admin.tests.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground", children: test.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium", children: test.category }),
                    test.fastingRequired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded font-medium", children: "Fasting" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    test.sampleType,
                    " • ",
                    test.reportTime
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-0.5 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm text-primary", children: [
                    "₹",
                    test.partnerPrice.toString()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground line-through", children: [
                    "₹",
                    test.mrpPrice.toString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 ml-1 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => openEdit(test),
                      "data-ocid": `admin.tests.edit_button.${i + 1}`,
                      className: "p-1.5 rounded-lg hover:bg-muted transition-smooth",
                      "aria-label": "Edit test",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4 text-muted-foreground" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => deleteMutation.mutate(test.id),
                      "data-ocid": `admin.tests.delete_button.${i + 1}`,
                      className: "p-1.5 rounded-lg hover:bg-destructive/10 transition-smooth text-muted-foreground hover:text-destructive",
                      "aria-label": "Delete test",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ]
            },
            test.id.toString()
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: addOpen,
        onClose: () => {
          setAddOpen(false);
          setAddError("");
        },
        title: "Add Lab Test",
        "data-ocid": "admin.tests.add_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TestFormFields, { form: addForm, setForm: setAddForm, prefix: "add" }),
          addError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs",
              "data-ocid": "admin.tests.add_modal.error_state",
              children: addError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setAddOpen(false);
                  setAddError("");
                },
                "data-ocid": "admin.tests.add_modal.cancel_button",
                className: "btn-secondary flex-1 py-2.5",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => addMutation.mutate(),
                disabled: addMutation.isPending,
                "data-ocid": "admin.tests.add_modal.confirm_button",
                className: "btn-primary flex-1 py-2.5 disabled:opacity-60",
                children: addMutation.isPending ? "Adding..." : "Add Test"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: editOpen,
        onClose: () => {
          setEditOpen(false);
          setEditError("");
        },
        title: `Edit: ${(editTarget == null ? void 0 : editTarget.name) ?? ""}`,
        "data-ocid": "admin.tests.edit_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TestFormFields, { form: editForm, setForm: setEditForm, prefix: "edit" }),
          editError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs",
              "data-ocid": "admin.tests.edit_modal.error_state",
              children: editError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setEditOpen(false);
                  setEditError("");
                },
                "data-ocid": "admin.tests.edit_modal.cancel_button",
                className: "btn-secondary flex-1 py-2.5",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => editMutation.mutate(),
                disabled: editMutation.isPending,
                "data-ocid": "admin.tests.edit_modal.confirm_button",
                className: "btn-primary flex-1 py-2.5 disabled:opacity-60",
                children: editMutation.isPending ? "Saving..." : "Save Changes"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminTestsPage as default
};
