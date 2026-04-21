import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import { PaymentStatus } from "../../backend.d";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { CardSkeleton } from "../../components/ui/LoadingSpinner";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type { PaymentPublic } from "../../types";

interface PaymentForm {
  centerId: string;
  amount: string;
  invoiceNumber: string;
  notes: string;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === PaymentStatus.paid) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
        <CheckCircle className="w-3 h-3" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-full">
      Pending
    </span>
  );
}

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const api = useApiService();
  const qc = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<PaymentForm>({
    centerId: "",
    amount: "",
    invoiceNumber: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");

  const [selectedCenter, setSelectedCenter] = useState("all");
  const [centerName, setCenterName] = useState("All Centers");
  const [centerSearch, setCenterSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: centers = [] } = useQuery({
    queryKey: ["admin.centers", user?.token],
    queryFn: () => api.getCenters(user!.token),
    enabled: !!user?.token,
  });

  // Load all payments from first center for "all" view, or specific center
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin.payments", user?.token, selectedCenter],
    queryFn: async () => {
      if (!user?.token) return [];
      if (selectedCenter === "all") {
        // Load payments from all centers concurrently
        const allResults = await Promise.all(
          centers.map((c) => api.getPaymentsByCenter(user.token, c.id)),
        );
        return allResults
          .flat()
          .sort((a, b) => Number(b.date) - Number(a.date));
      }
      return api.getPaymentsByCenter(user.token, selectedCenter);
    },
    enabled: !!user?.token,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token) throw new Error("Not logged in");
      if (!form.centerId || !form.amount || !form.invoiceNumber)
        throw new Error("Please fill all required fields.");
      return api.addPayment(
        user.token,
        form.centerId,
        BigInt(Math.round(Number(form.amount))),
        form.invoiceNumber,
        form.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.payments"] });
      setAddOpen(false);
      setForm({ centerId: "", amount: "", invoiceNumber: "", notes: "" });
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const markPaidMutation = useMutation({
    mutationFn: async (paymentId: bigint) => {
      if (!user?.token) throw new Error("Not logged in");
      return api.markPaymentPaid(user.token, paymentId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin.payments"] }),
  });

  const filteredCenters = centers.filter(
    (c) =>
      centerSearch === "" ||
      c.name.toLowerCase().includes(centerSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(centerSearch.toLowerCase()),
  );

  const totalPending = payments
    .filter((p) => p.status === PaymentStatus.pending)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPaid = payments
    .filter((p) => p.status === PaymentStatus.paid)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Payments"
          subtitle="Manage center commissions and billing"
          action={
            <button
              type="button"
              onClick={() => {
                setFormError("");
                setAddOpen(true);
              }}
              data-ocid="admin.payments.add_button"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          }
        />

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mt-1 mb-4">
          <div className="card-elevated p-4">
            <p className="text-xs text-muted-foreground font-medium">Pending</p>
            <p className="font-display font-bold text-xl text-warning mt-0.5">
              ₹{totalPending.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-xs text-muted-foreground font-medium">
              Paid Out
            </p>
            <p className="font-display font-bold text-xl text-accent mt-0.5">
              ₹{totalPaid.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Center filter */}
        <div className="relative mb-4">
          <input
            type="search"
            value={centerSearch}
            onChange={(e) => {
              setCenterSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={`Filtering: ${centerName}`}
            data-ocid="admin.payments.center_search_input"
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
          <table className="w-full text-sm" data-ocid="admin.payments.table">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Invoice #
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Center
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Notes
                </th>
                <th className="text-center px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
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
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                  >
                    No payment records found.
                  </td>
                </tr>
              ) : (
                (payments as PaymentPublic[]).map((pay, i) => (
                  <tr
                    key={pay.id.toString()}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                    data-ocid={`admin.payments.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{pay.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {pay.centerId}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">
                      ₹{Number(pay.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(pay.date)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[160px]">
                      {pay.notes || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PaymentStatusBadge status={pay.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {pay.status === PaymentStatus.pending ? (
                        <button
                          type="button"
                          onClick={() => markPaidMutation.mutate(pay.id)}
                          data-ocid={`admin.payments.mark_paid_button.${i + 1}`}
                          disabled={markPaidMutation.isPending}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-lg transition-smooth disabled:opacity-50"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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
          data-ocid="admin.payments.list"
        >
          {isLoading ? (
            ["psk1", "psk2", "psk3"].map((k) => <CardSkeleton key={k} />)
          ) : payments.length === 0 ? (
            <EmptyState
              icon={<CreditCard className="w-7 h-7" />}
              title="No payments"
              description="No payment records found."
              data-ocid="admin.payments.empty_state"
            />
          ) : (
            (payments as PaymentPublic[]).map((pay, i) => (
              <div
                key={pay.id.toString()}
                className="card-elevated p-4 flex items-center gap-3"
                data-ocid={`admin.payments.item.${i + 1}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${pay.status === PaymentStatus.paid ? "bg-accent/10" : "bg-warning/10"}`}
                >
                  <CreditCard
                    className={`w-4 h-4 ${pay.status === PaymentStatus.paid ? "text-accent" : "text-warning"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">
                    Invoice #{pay.invoiceNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(pay.date)} • {pay.centerId}
                  </p>
                  {pay.notes && (
                    <p className="text-xs text-muted-foreground truncate">
                      {pay.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-bold text-sm text-foreground">
                    ₹{Number(pay.amount).toLocaleString("en-IN")}
                  </span>
                  <PaymentStatusBadge status={pay.status} />
                  {pay.status === PaymentStatus.pending && (
                    <button
                      type="button"
                      onClick={() => markPaidMutation.mutate(pay.id)}
                      data-ocid={`admin.payments.mark_paid_button.${i + 1}`}
                      className="flex items-center gap-1 text-[10px] font-semibold text-accent hover:underline mt-0.5"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Payment Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setFormError("");
        }}
        title="Add Payment"
        data-ocid="admin.payments.add_modal"
      >
        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="ap-center"
              className="block text-xs font-semibold text-foreground mb-1"
            >
              Center *
            </label>
            <select
              id="ap-center"
              value={form.centerId}
              onChange={(e) => setForm({ ...form, centerId: e.target.value })}
              data-ocid="admin.payments.add_modal.center_select"
              className="input-field w-full"
            >
              <option value="">Select center...</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
          </div>
          {(
            [
              {
                id: "ap-inv",
                label: "Invoice Number *",
                key: "invoiceNumber",
                placeholder: "INV-001",
              },
              {
                id: "ap-amt",
                label: "Amount (₹) *",
                key: "amount",
                placeholder: "e.g. 5000",
                type: "number",
              },
              {
                id: "ap-notes",
                label: "Notes",
                key: "notes",
                placeholder: "Payment details",
              },
            ] as {
              id: string;
              label: string;
              key: keyof PaymentForm;
              placeholder: string;
              type?: string;
            }[]
          ).map(({ id, label, key, placeholder, type }) => (
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
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                data-ocid={`admin.payments.add_modal.${key}_input`}
                className="input-field w-full"
              />
            </div>
          ))}
          {formError && (
            <p
              className="text-destructive text-xs"
              data-ocid="admin.payments.add_modal.error_state"
            >
              {formError}
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                setAddOpen(false);
                setFormError("");
              }}
              data-ocid="admin.payments.add_modal.cancel_button"
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending}
              data-ocid="admin.payments.add_modal.confirm_button"
              className="btn-primary flex-1 py-2.5 disabled:opacity-60"
            >
              {addMutation.isPending ? "Adding..." : "Add Payment"}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
