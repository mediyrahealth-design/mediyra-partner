import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Edit2, Plus, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { CenterStatus } from "../../backend.d";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { CardSkeleton } from "../../components/ui/LoadingSpinner";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type { CollectionCenterPublic } from "../../types";

interface AddCenterForm {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}

interface EditCenterForm {
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
}

const emptyAddForm: AddCenterForm = {
  id: "",
  name: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  password: "",
};

const addFields: {
  id: string;
  label: string;
  key: keyof AddCenterForm;
  placeholder: string;
  type?: string;
}[] = [
  { id: "ac-id", label: "Center ID *", key: "id", placeholder: "e.g. CC001" },
  {
    id: "ac-name",
    label: "Center Name *",
    key: "name",
    placeholder: "Lab name",
  },
  {
    id: "ac-owner",
    label: "Owner Name *",
    key: "ownerName",
    placeholder: "Owner's full name",
  },
  {
    id: "ac-phone",
    label: "Phone *",
    key: "phone",
    placeholder: "Mobile number",
  },
  {
    id: "ac-email",
    label: "Email",
    key: "email",
    placeholder: "Email address",
  },
  {
    id: "ac-address",
    label: "Address",
    key: "address",
    placeholder: "Full address",
  },
  {
    id: "ac-pwd",
    label: "Password *",
    key: "password",
    placeholder: "Login password",
    type: "password",
  },
];

const editFields: {
  id: string;
  label: string;
  key: keyof EditCenterForm;
  placeholder: string;
}[] = [
  {
    id: "ec-name",
    label: "Center Name *",
    key: "name",
    placeholder: "Lab name",
  },
  {
    id: "ec-owner",
    label: "Owner Name *",
    key: "ownerName",
    placeholder: "Owner's full name",
  },
  {
    id: "ec-phone",
    label: "Phone *",
    key: "phone",
    placeholder: "Mobile number",
  },
  {
    id: "ec-email",
    label: "Email",
    key: "email",
    placeholder: "Email address",
  },
  {
    id: "ec-address",
    label: "Address",
    key: "address",
    placeholder: "Full address",
  },
];

export default function AdminCentersPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddCenterForm>(emptyAddForm);
  const [addError, setAddError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CollectionCenterPublic | null>(
    null,
  );
  const [editForm, setEditForm] = useState<EditCenterForm>({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [editError, setEditError] = useState("");

  const { data: centers = [], isLoading } = useQuery({
    queryKey: ["admin.centers", user?.token],
    queryFn: () => api.getCenters(user!.token),
    enabled: !!user?.token,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token) throw new Error("Not logged in");
      if (
        !addForm.id ||
        !addForm.name ||
        !addForm.ownerName ||
        !addForm.phone ||
        !addForm.password
      )
        throw new Error("Please fill all required fields.");
      return api.addCenter(
        user.token,
        addForm.id,
        addForm.name,
        addForm.ownerName,
        addForm.phone,
        addForm.email,
        addForm.address,
        addForm.password,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.centers"] });
      setAddOpen(false);
      setAddForm(emptyAddForm);
    },
    onError: (e: Error) => setAddError(e.message),
  });

  const editMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token || !editTarget) throw new Error("Not logged in");
      if (!editForm.name || !editForm.ownerName || !editForm.phone)
        throw new Error("Please fill all required fields.");
      return api.updateCenter(
        user.token,
        editTarget.id,
        editForm.name,
        editForm.ownerName,
        editForm.phone,
        editForm.email,
        editForm.address,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.centers"] });
      setEditOpen(false);
      setEditTarget(null);
    },
    onError: (e: Error) => setEditError(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      if (!user?.token) throw new Error("Not logged in");
      return api.setCenterStatus(user.token, id, active);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin.centers"] }),
  });

  function openEdit(center: CollectionCenterPublic) {
    setEditTarget(center);
    setEditForm({
      name: center.name,
      ownerName: center.ownerName,
      phone: center.phone,
      email: center.email,
      address: center.address,
    });
    setEditError("");
    setEditOpen(true);
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Collection Centers"
          subtitle={`${centers.length} registered centers`}
          action={
            <button
              type="button"
              onClick={() => {
                setAddError("");
                setAddOpen(true);
              }}
              data-ocid="admin.centers.add_button"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Center
            </button>
          }
        />

        {/* Desktop table */}
        <div className="hidden md:block mt-2 rounded-lg border border-border overflow-hidden bg-card shadow-md">
          <table className="w-full text-sm" data-ocid="admin.centers.table">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Center ID
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Owner
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Status
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
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : centers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                  >
                    No collection centers yet. Add your first one.
                  </td>
                </tr>
              ) : (
                centers.map((center, i) => (
                  <tr
                    key={center.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                    data-ocid={`admin.centers.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {center.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs flex-shrink-0">
                          {center.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">
                          {center.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {center.ownerName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {center.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent" : "bg-destructive"}`}
                        />
                        {center.status === CenterStatus.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleMutation.mutate({
                              id: center.id,
                              active: center.status !== CenterStatus.active,
                            })
                          }
                          data-ocid={`admin.centers.toggle.${i + 1}`}
                          className="p-1.5 rounded-lg hover:bg-muted transition-smooth"
                          aria-label={
                            center.status === CenterStatus.active
                              ? "Deactivate"
                              : "Activate"
                          }
                          title={
                            center.status === CenterStatus.active
                              ? "Deactivate"
                              : "Activate"
                          }
                        >
                          {center.status === CenterStatus.active ? (
                            <XCircle className="w-4 h-4 text-destructive" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-accent" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(center)}
                          data-ocid={`admin.centers.edit_button.${i + 1}`}
                          className="p-1.5 rounded-lg hover:bg-muted transition-smooth"
                          aria-label="Edit center"
                          title="Edit center"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
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
          className="flex flex-col gap-3 mt-2 md:hidden"
          data-ocid="admin.centers.list"
        >
          {isLoading ? (
            ["csk1", "csk2", "csk3"].map((k) => <CardSkeleton key={k} />)
          ) : centers.length === 0 ? (
            <EmptyState
              icon={<Users className="w-7 h-7" />}
              title="No centers yet"
              description="Add your first collection center partner."
              data-ocid="admin.centers.empty_state"
            />
          ) : (
            centers.map((center, i) => (
              <div
                key={center.id}
                className="card-elevated p-4 flex items-start gap-3"
                data-ocid={`admin.centers.item.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {center.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-foreground">
                      {center.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${center.status === CenterStatus.active ? "bg-accent" : "bg-destructive"}`}
                      />
                      {center.status === CenterStatus.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ID: {center.id} • {center.phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {center.ownerName} • {center.address}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      toggleMutation.mutate({
                        id: center.id,
                        active: center.status !== CenterStatus.active,
                      })
                    }
                    data-ocid={`admin.centers.toggle.${i + 1}`}
                    className="p-1.5 rounded-lg hover:bg-muted transition-smooth"
                    aria-label={
                      center.status === CenterStatus.active
                        ? "Deactivate"
                        : "Activate"
                    }
                  >
                    {center.status === CenterStatus.active ? (
                      <XCircle className="w-4 h-4 text-destructive" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-accent" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(center)}
                    data-ocid={`admin.centers.edit_button.${i + 1}`}
                    className="p-1.5 rounded-lg hover:bg-muted transition-smooth"
                    aria-label="Edit center"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setAddError("");
        }}
        title="Add Collection Center"
        data-ocid="admin.centers.add_modal"
      >
        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
          {addFields.map(({ id, label, key, placeholder, type }) => (
            <div key={key}>
              <label
                htmlFor={id}
                className="block text-xs font-semibold text-foreground mb-1"
              >
                {label}
              </label>
              <input
                id={id}
                type={type ?? "text"}
                value={addForm[key]}
                onChange={(e) =>
                  setAddForm({ ...addForm, [key]: e.target.value })
                }
                placeholder={placeholder}
                data-ocid={`admin.centers.add_modal.${key}_input`}
                className="input-field w-full"
              />
            </div>
          ))}
          {addError && (
            <p
              className="text-destructive text-xs"
              data-ocid="admin.centers.add_modal.error_state"
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
              data-ocid="admin.centers.add_modal.cancel_button"
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending}
              data-ocid="admin.centers.add_modal.confirm_button"
              className="btn-primary flex-1 py-2.5 disabled:opacity-60"
            >
              {addMutation.isPending ? "Adding..." : "Add Center"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditError("");
        }}
        title={`Edit: ${editTarget?.name ?? ""}`}
        data-ocid="admin.centers.edit_modal"
      >
        <div className="flex flex-col gap-3">
          {editFields.map(({ id, label, key, placeholder }) => (
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
                value={editForm[key]}
                onChange={(e) =>
                  setEditForm({ ...editForm, [key]: e.target.value })
                }
                placeholder={placeholder}
                data-ocid={`admin.centers.edit_modal.${key}_input`}
                className="input-field w-full"
              />
            </div>
          ))}
          {editError && (
            <p
              className="text-destructive text-xs"
              data-ocid="admin.centers.edit_modal.error_state"
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
              data-ocid="admin.centers.edit_modal.cancel_button"
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => editMutation.mutate()}
              disabled={editMutation.isPending}
              data-ocid="admin.centers.edit_modal.confirm_button"
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
