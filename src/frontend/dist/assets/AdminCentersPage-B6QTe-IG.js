import { u as useAuth, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, C as CenterStatus, e as CardSkeleton } from "./index-DC8ICoH5.js";
import { c as createLucideIcon, u as useApiService, a as useQuery } from "./api-n3_FsYjY.js";
import { u as useMutation } from "./useMutation-B2ld5fwH.js";
import { A as AdminLayout } from "./AdminLayout-d_yc4e_k.js";
import { E as EmptyState } from "./EmptyState-BedOWtud.js";
import { M as Modal } from "./Modal-ncSFHhz0.js";
import { P as PageHeader } from "./PageHeader-QEyl1Cn6.js";
import { P as Plus } from "./plus-C5zBxfHu.js";
import { C as CircleCheckBig } from "./circle-check-big-BiCm_b-S.js";
import { P as Pen } from "./pen--l4zCm6Z.js";
import { U as Users } from "./users-eJui1AXv.js";
import "./log-out-CvArZmaA.js";
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
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
const emptyAddForm = {
  id: "",
  name: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  password: ""
};
const addFields = [
  { id: "ac-id", label: "Center ID *", key: "id", placeholder: "e.g. CC001" },
  {
    id: "ac-name",
    label: "Center Name *",
    key: "name",
    placeholder: "Lab name"
  },
  {
    id: "ac-owner",
    label: "Owner Name *",
    key: "ownerName",
    placeholder: "Owner's full name"
  },
  {
    id: "ac-phone",
    label: "Phone *",
    key: "phone",
    placeholder: "Mobile number"
  },
  {
    id: "ac-email",
    label: "Email",
    key: "email",
    placeholder: "Email address"
  },
  {
    id: "ac-address",
    label: "Address",
    key: "address",
    placeholder: "Full address"
  },
  {
    id: "ac-pwd",
    label: "Password *",
    key: "password",
    placeholder: "Login password",
    type: "password"
  }
];
const editFields = [
  {
    id: "ec-name",
    label: "Center Name *",
    key: "name",
    placeholder: "Lab name"
  },
  {
    id: "ec-owner",
    label: "Owner Name *",
    key: "ownerName",
    placeholder: "Owner's full name"
  },
  {
    id: "ec-phone",
    label: "Phone *",
    key: "phone",
    placeholder: "Mobile number"
  },
  {
    id: "ec-email",
    label: "Email",
    key: "email",
    placeholder: "Email address"
  },
  {
    id: "ec-address",
    label: "Address",
    key: "address",
    placeholder: "Full address"
  }
];
function AdminCentersPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [addForm, setAddForm] = reactExports.useState(emptyAddForm);
  const [addError, setAddError] = reactExports.useState("");
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(
    null
  );
  const [editForm, setEditForm] = reactExports.useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    address: ""
  });
  const [editError, setEditError] = reactExports.useState("");
  const { data: centers = [], isLoading } = useQuery({
    queryKey: ["admin.centers", user == null ? void 0 : user.token],
    queryFn: () => api.getCenters(user.token),
    enabled: !!(user == null ? void 0 : user.token)
  });
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      if (!addForm.id || !addForm.name || !addForm.ownerName || !addForm.phone || !addForm.password)
        throw new Error("Please fill all required fields.");
      return api.addCenter(
        user.token,
        addForm.id,
        addForm.name,
        addForm.ownerName,
        addForm.phone,
        addForm.email,
        addForm.address,
        addForm.password
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.centers"] });
      setAddOpen(false);
      setAddForm(emptyAddForm);
    },
    onError: (e) => setAddError(e.message)
  });
  const editMutation = useMutation({
    mutationFn: async () => {
      if (!(user == null ? void 0 : user.token) || !editTarget) throw new Error("Not logged in");
      if (!editForm.name || !editForm.ownerName || !editForm.phone)
        throw new Error("Please fill all required fields.");
      return api.updateCenter(
        user.token,
        editTarget.id,
        editForm.name,
        editForm.ownerName,
        editForm.phone,
        editForm.email,
        editForm.address
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.centers"] });
      setEditOpen(false);
      setEditTarget(null);
    },
    onError: (e) => setEditError(e.message)
  });
  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }) => {
      if (!(user == null ? void 0 : user.token)) throw new Error("Not logged in");
      return api.setCenterStatus(user.token, id, active);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin.centers"] })
  });
  function openEdit(center) {
    setEditTarget(center);
    setEditForm({
      name: center.name,
      ownerName: center.ownerName,
      phone: center.phone,
      email: center.email,
      address: center.address
    });
    setEditError("");
    setEditOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Collection Centers",
          subtitle: `${centers.length} registered centers`,
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setAddError("");
                setAddOpen(true);
              },
              "data-ocid": "admin.centers.add_button",
              className: "btn-primary flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Add Center"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block mt-2 rounded-lg border border-border overflow-hidden bg-card shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.centers.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Center ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Owner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 6,
            className: "px-4 py-8 text-center text-muted-foreground text-sm",
            children: "Loading..."
          }
        ) }) : centers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 6,
            className: "px-4 py-10 text-center text-muted-foreground text-sm",
            children: "No collection centers yet. Add your first one."
          }
        ) }) : centers.map((center, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-smooth",
            "data-ocid": `admin.centers.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: center.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs flex-shrink-0", children: center.name.charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: center.name })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: center.ownerName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: center.phone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `w-1.5 h-1.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent" : "bg-destructive"}`
                      }
                    ),
                    center.status === CenterStatus.active ? "Active" : "Inactive"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleMutation.mutate({
                      id: center.id,
                      active: center.status !== CenterStatus.active
                    }),
                    "data-ocid": `admin.centers.toggle.${i + 1}`,
                    className: "p-1.5 rounded-lg hover:bg-muted transition-smooth",
                    "aria-label": center.status === CenterStatus.active ? "Deactivate" : "Activate",
                    title: center.status === CenterStatus.active ? "Deactivate" : "Activate",
                    children: center.status === CenterStatus.active ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-accent" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => openEdit(center),
                    "data-ocid": `admin.centers.edit_button.${i + 1}`,
                    className: "p-1.5 rounded-lg hover:bg-muted transition-smooth",
                    "aria-label": "Edit center",
                    title: "Edit center",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4 text-muted-foreground" })
                  }
                )
              ] }) })
            ]
          },
          center.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-3 mt-2 md:hidden",
          "data-ocid": "admin.centers.list",
          children: isLoading ? ["csk1", "csk2", "csk3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}, k)) : centers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-7 h-7" }),
              title: "No centers yet",
              description: "Add your first collection center partner.",
              "data-ocid": "admin.centers.empty_state"
            }
          ) : centers.map((center, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "card-elevated p-4 flex items-start gap-3",
              "data-ocid": `admin.centers.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0", children: center.name.charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground", children: center.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: `inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: `w-1.5 h-1.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent" : "bg-destructive"}`
                            }
                          ),
                          center.status === CenterStatus.active ? "Active" : "Inactive"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "ID: ",
                    center.id,
                    " • ",
                    center.phone
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    center.ownerName,
                    " • ",
                    center.address
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleMutation.mutate({
                        id: center.id,
                        active: center.status !== CenterStatus.active
                      }),
                      "data-ocid": `admin.centers.toggle.${i + 1}`,
                      className: "p-1.5 rounded-lg hover:bg-muted transition-smooth",
                      "aria-label": center.status === CenterStatus.active ? "Deactivate" : "Activate",
                      children: center.status === CenterStatus.active ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-accent" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => openEdit(center),
                      "data-ocid": `admin.centers.edit_button.${i + 1}`,
                      className: "p-1.5 rounded-lg hover:bg-muted transition-smooth",
                      "aria-label": "Edit center",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4 text-muted-foreground" })
                    }
                  )
                ] })
              ]
            },
            center.id
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
        title: "Add Collection Center",
        "data-ocid": "admin.centers.add_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1", children: [
          addFields.map(({ id, label, key, placeholder, type }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
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
                type: type ?? "text",
                value: addForm[key],
                onChange: (e) => setAddForm({ ...addForm, [key]: e.target.value }),
                placeholder,
                "data-ocid": `admin.centers.add_modal.${key}_input`,
                className: "input-field w-full"
              }
            )
          ] }, key)),
          addError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs",
              "data-ocid": "admin.centers.add_modal.error_state",
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
                "data-ocid": "admin.centers.add_modal.cancel_button",
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
                "data-ocid": "admin.centers.add_modal.confirm_button",
                className: "btn-primary flex-1 py-2.5 disabled:opacity-60",
                children: addMutation.isPending ? "Adding..." : "Add Center"
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
        "data-ocid": "admin.centers.edit_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          editFields.map(({ id, label, key, placeholder }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
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
                value: editForm[key],
                onChange: (e) => setEditForm({ ...editForm, [key]: e.target.value }),
                placeholder,
                "data-ocid": `admin.centers.edit_modal.${key}_input`,
                className: "input-field w-full"
              }
            )
          ] }, key)),
          editError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs",
              "data-ocid": "admin.centers.edit_modal.error_state",
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
                "data-ocid": "admin.centers.edit_modal.cancel_button",
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
                "data-ocid": "admin.centers.edit_modal.confirm_button",
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
  AdminCentersPage as default
};
