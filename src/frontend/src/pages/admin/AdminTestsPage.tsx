import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, FlaskConical, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { CardSkeleton } from "../../components/ui/LoadingSpinner";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type { LabTest } from "../../types";

interface TestForm {
  name: string;
  category: string;
  sampleType: string;
  tubeType: string;
  fastingRequired: boolean;
  reportTime: string;
  mrpPrice: string;
  partnerPrice: string;
}

const emptyTestForm: TestForm = {
  name: "",
  category: "",
  sampleType: "",
  tubeType: "",
  fastingRequired: false,
  reportTime: "",
  mrpPrice: "",
  partnerPrice: "",
};

const textFields: {
  id: string;
  label: string;
  key: keyof TestForm;
  placeholder: string;
  type?: string;
}[] = [
  { id: "tf-name", label: "Test Name *", key: "name", placeholder: "e.g. CBC" },
  {
    id: "tf-cat",
    label: "Category *",
    key: "category",
    placeholder: "e.g. Haematology",
  },
  {
    id: "tf-sample",
    label: "Sample Type *",
    key: "sampleType",
    placeholder: "e.g. Blood",
  },
  {
    id: "tf-tube",
    label: "Tube Type",
    key: "tubeType",
    placeholder: "e.g. EDTA",
  },
  {
    id: "tf-time",
    label: "Report Time",
    key: "reportTime",
    placeholder: "e.g. 6 hours",
  },
  {
    id: "tf-mrp",
    label: "MRP Price (₹) *",
    key: "mrpPrice",
    placeholder: "e.g. 500",
    type: "number",
  },
  {
    id: "tf-partner",
    label: "Partner Price (₹) *",
    key: "partnerPrice",
    placeholder: "e.g. 350",
    type: "number",
  },
];

function TestFormFields({
  form,
  setForm,
  prefix,
}: {
  form: TestForm;
  setForm: (f: TestForm) => void;
  prefix: string;
}) {
  return (
    <>
      {textFields.map(({ id, label, key, placeholder, type }) => (
        <div key={key}>
          <label
            htmlFor={`${prefix}-${id}`}
            className="block text-xs font-semibold text-foreground mb-1"
          >
            {label}
          </label>
          <input
            id={`${prefix}-${id}`}
            type={type ?? "text"}
            value={form[key] as string}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className="input-field w-full"
          />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <input
          id={`${prefix}-fasting`}
          type="checkbox"
          checked={form.fastingRequired}
          onChange={(e) =>
            setForm({ ...form, fastingRequired: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
          data-ocid={`${prefix}.fasting_checkbox`}
        />
        <label
          htmlFor={`${prefix}-fasting`}
          className="text-sm text-foreground font-medium"
        >
          Fasting Required
        </label>
      </div>
    </>
  );
}

export default function AdminTestsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<TestForm>(emptyTestForm);
  const [addError, setAddError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<LabTest | null>(null);
  const [editForm, setEditForm] = useState<TestForm>(emptyTestForm);
  const [editError, setEditError] = useState("");

  const [search, setSearch] = useState("");

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: () => api.getTests(),
  });

  const filtered = tests.filter(
    (t) =>
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()),
  );

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token) throw new Error("Not logged in");
      if (
        !addForm.name ||
        !addForm.category ||
        !addForm.sampleType ||
        !addForm.mrpPrice ||
        !addForm.partnerPrice
      )
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
        BigInt(Math.round(Number(addForm.partnerPrice))),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
      setAddOpen(false);
      setAddForm(emptyTestForm);
    },
    onError: (e: Error) => setAddError(e.message),
  });

  const editMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token || !editTarget) throw new Error("Not logged in");
      if (
        !editForm.name ||
        !editForm.category ||
        !editForm.sampleType ||
        !editForm.mrpPrice ||
        !editForm.partnerPrice
      )
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
        partnerPrice: BigInt(Math.round(Number(editForm.partnerPrice))),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
      setEditOpen(false);
      setEditTarget(null);
    },
    onError: (e: Error) => setEditError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!user?.token) throw new Error("Not logged in");
      return api.deleteTest(user.token, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tests"] }),
  });

  function openEdit(test: LabTest) {
    setEditTarget(test);
    setEditForm({
      name: test.name,
      category: test.category,
      sampleType: test.sampleType,
      tubeType: test.tubeType,
      fastingRequired: test.fastingRequired,
      reportTime: test.reportTime,
      mrpPrice: test.mrpPrice.toString(),
      partnerPrice: test.partnerPrice.toString(),
    });
    setEditError("");
    setEditOpen(true);
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Lab Tests"
          subtitle={`${tests.length} tests in catalog`}
          action={
            <button
              type="button"
              onClick={() => {
                setAddError("");
                setAddOpen(true);
              }}
              data-ocid="admin.tests.add_button"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Test
            </button>
          }
        />

        <div className="relative mb-4 mt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            data-ocid="admin.tests.search_input"
            className="input-field w-full pl-9"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-lg border border-border overflow-hidden bg-card shadow-md">
          <table className="w-full text-sm" data-ocid="admin.tests.table">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Test Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Sample
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  MRP
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Partner
                </th>
                <th className="text-center px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Fasting
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Report Time
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
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                  >
                    No tests found.
                  </td>
                </tr>
              ) : (
                filtered.map((test, i) => (
                  <tr
                    key={test.id.toString()}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                    data-ocid={`admin.tests.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground">
                          {test.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                        {test.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {test.sampleType}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground line-through">
                      ₹{test.mrpPrice.toString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-primary">
                      ₹{test.partnerPrice.toString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${test.fastingRequired ? "bg-warning" : "bg-muted-foreground/30"}`}
                        aria-label={test.fastingRequired ? "Yes" : "No"}
                      />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {test.reportTime}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(test)}
                          data-ocid={`admin.tests.edit_button.${i + 1}`}
                          className="p-1.5 rounded-lg hover:bg-muted transition-smooth"
                          aria-label="Edit test"
                          title="Edit test"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(test.id)}
                          data-ocid={`admin.tests.delete_button.${i + 1}`}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-smooth text-muted-foreground hover:text-destructive"
                          aria-label="Delete test"
                          title="Delete test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
          data-ocid="admin.tests.list"
        >
          {isLoading ? (
            ["tsk1", "tsk2", "tsk3", "tsk4"].map((k) => (
              <CardSkeleton key={k} />
            ))
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FlaskConical className="w-7 h-7" />}
              title="No tests found"
              description="Add your first lab test to the catalog."
              data-ocid="admin.tests.empty_state"
            />
          ) : (
            filtered.map((test, i) => (
              <div
                key={test.id.toString()}
                className="card-elevated p-4 flex items-center gap-3"
                data-ocid={`admin.tests.item.${i + 1}`}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">
                      {test.name}
                    </h3>
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                      {test.category}
                    </span>
                    {test.fastingRequired && (
                      <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded font-medium">
                        Fasting
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {test.sampleType} • {test.reportTime}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="font-bold text-sm text-primary">
                    ₹{test.partnerPrice.toString()}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{test.mrpPrice.toString()}
                  </span>
                </div>
                <div className="flex gap-1 ml-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(test)}
                    data-ocid={`admin.tests.edit_button.${i + 1}`}
                    className="p-1.5 rounded-lg hover:bg-muted transition-smooth"
                    aria-label="Edit test"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(test.id)}
                    data-ocid={`admin.tests.delete_button.${i + 1}`}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-smooth text-muted-foreground hover:text-destructive"
                    aria-label="Delete test"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Test Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setAddError("");
        }}
        title="Add Lab Test"
        data-ocid="admin.tests.add_modal"
      >
        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
          <TestFormFields form={addForm} setForm={setAddForm} prefix="add" />
          {addError && (
            <p
              className="text-destructive text-xs"
              data-ocid="admin.tests.add_modal.error_state"
            >
              {addError}
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                setAddOpen(false);
                setAddError("");
              }}
              data-ocid="admin.tests.add_modal.cancel_button"
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending}
              data-ocid="admin.tests.add_modal.confirm_button"
              className="btn-primary flex-1 py-2.5 disabled:opacity-60"
            >
              {addMutation.isPending ? "Adding..." : "Add Test"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Test Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditError("");
        }}
        title={`Edit: ${editTarget?.name ?? ""}`}
        data-ocid="admin.tests.edit_modal"
      >
        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
          <TestFormFields form={editForm} setForm={setEditForm} prefix="edit" />
          {editError && (
            <p
              className="text-destructive text-xs"
              data-ocid="admin.tests.edit_modal.error_state"
            >
              {editError}
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                setEditOpen(false);
                setEditError("");
              }}
              data-ocid="admin.tests.edit_modal.cancel_button"
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => editMutation.mutate()}
              disabled={editMutation.isPending}
              data-ocid="admin.tests.edit_modal.confirm_button"
              className="btn-primary flex-1 py-2.5 disabled:opacity-60"
            >
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
