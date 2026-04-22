import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  CreditCard,
  FileText,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { PaymentStatus } from "../../backend.d";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { CardSkeleton } from "../../components/ui/LoadingSpinner";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useApiService } from "../../services/api";
import type {
  BillingStats,
  CollectionCenterPublic,
  PaymentPublic,
} from "../../types";

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

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === PaymentStatus.paid) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
        <CheckCircle className="w-3 h-3" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning bg-warning/10 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />
      Pending
    </span>
  );
}

// ── Invoice generation ────────────────────────────────────────────────────────

function generateInvoiceHTML(
  payment: PaymentPublic,
  centerName: string,
): string {
  const dateStr = formatDate(payment.date);
  const amount = Number(payment.amount).toLocaleString("en-IN");
  const status = payment.status === PaymentStatus.paid ? "PAID" : "PENDING";
  const statusColor =
    payment.status === PaymentStatus.paid ? "#16a34a" : "#d97706";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${payment.invoiceNumber} – Mediyra Lab</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Figtree:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Figtree', sans-serif; background: #fff; color: #1e293b; font-size: 14px; }
    .page { max-width: 700px; margin: 0 auto; padding: 40px 48px; }
    .header { background: #1d4ed8; color: #fff; border-radius: 12px 12px 0 0; padding: 28px 36px; display: flex; justify-content: space-between; align-items: center; }
    .header-brand { display: flex; align-items: center; gap: 12px; }
    .header-logo { width: 42px; height: 42px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .header-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header-subtitle { font-size: 12px; opacity: 0.75; margin-top: 2px; }
    .header-inv { text-align: right; }
    .header-inv .inv-label { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
    .header-inv .inv-num { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; margin-top: 2px; }
    .body { border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 32px 36px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }
    .meta-item .label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 4px; }
    .meta-item .value { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; color: #1e293b; }
    .charges-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .charges-table thead tr { background: #f8fafc; }
    .charges-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
    .charges-table th:last-child { text-align: right; }
    .charges-table td { padding: 14px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9; }
    .charges-table td:last-child { text-align: right; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #1e293b; }
    .total-row { display: flex; justify-content: flex-end; margin-top: 4px; }
    .total-box { background: #1d4ed8; color: #fff; border-radius: 10px; padding: 16px 24px; min-width: 200px; text-align: right; }
    .total-box .t-label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.8px; }
    .total-box .t-amount { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; margin-top: 2px; }
    .status-stamp { display: inline-flex; align-items: center; gap: 6px; border: 2px solid ${statusColor}; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: ${statusColor}; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 20px; }
    .notes-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
    .notes-section .n-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 6px; }
    .notes-section .n-text { font-size: 13px; color: #475569; line-height: 1.6; }
    .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.7; }
    @media print {
      body { background: #fff; }
      .no-print { display: none !important; }
      .page { padding: 20px 30px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-brand">
        <div class="header-logo">🧪</div>
        <div>
          <div class="header-title">Mediyra Lab</div>
          <div class="header-subtitle">Pathology &amp; Diagnostics</div>
        </div>
      </div>
      <div class="header-inv">
        <div class="inv-label">Invoice</div>
        <div class="inv-num">#${payment.invoiceNumber}</div>
      </div>
    </div>
    <div class="body">
      <div class="meta-grid">
        <div class="meta-item">
          <div class="label">Bill To</div>
          <div class="value">${centerName}</div>
          <div style="font-size:12px;color:#64748b;margin-top:2px;">Center ID: ${payment.centerId}</div>
        </div>
        <div class="meta-item">
          <div class="label">Invoice Date</div>
          <div class="value">${dateStr}</div>
        </div>
        <div class="meta-item">
          <div class="label">Invoice Number</div>
          <div class="value">#${payment.invoiceNumber}</div>
        </div>
        <div class="meta-item">
          <div class="label">Payment Status</div>
          <div class="status-stamp">${status}</div>
        </div>
      </div>

      <table class="charges-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <div style="font-weight:600;color:#1e293b;">Lab Services Commission</div>
              <div style="font-size:12px;color:#64748b;margin-top:2px;">Collection Center: ${centerName}</div>
            </td>
            <td>₹${amount}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-row">
        <div class="total-box">
          <div class="t-label">Total Amount</div>
          <div class="t-amount">₹${amount}</div>
        </div>
      </div>

      ${payment.notes ? `<div class="notes-section"><div class="n-label">Notes</div><div class="n-text">${payment.notes}</div></div>` : ""}

      <div class="footer">
        <strong>Mediyra Lab</strong> · Pathology &amp; Diagnostics<br/>
        This is a computer-generated invoice. No signature required.<br/>
        For queries, contact accounts@mediyralab.com
      </div>
    </div>

    <div class="no-print" style="margin-top:24px;text-align:center;">
      <button onclick="window.print()" style="background:#1d4ed8;color:#fff;border:none;border-radius:8px;padding:12px 32px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;">
        🖨️ Print / Save as PDF
      </button>
      <button onclick="window.close()" style="background:#f1f5f9;color:#475569;border:none;border-radius:8px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;margin-left:12px;">
        Close
      </button>
    </div>
  </div>
</body>
</html>`;
}

function openInvoice(payment: PaymentPublic, centerName: string) {
  const html = generateInvoiceHTML(payment, centerName);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// ── Stat mini-card ─────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`card-elevated p-4 flex items-start gap-3 ${accent ? "border-l-4 border-primary" : ""}`}
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium truncate">
          {label}
        </p>
        <p className="font-display font-bold text-lg text-foreground mt-0.5 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Confirm dialog ─────────────────────────────────────────────────────────────

function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  invoiceNum,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  invoiceNum: string;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
      data-ocid="admin.payments.confirm_dialog"
    >
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-up">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
          <CheckCircle className="w-6 h-6 text-accent" />
        </div>
        <h3 className="font-display font-semibold text-center text-foreground text-base mb-1">
          Mark Invoice as Paid?
        </h3>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Invoice <strong className="text-foreground">#{invoiceNum}</strong>{" "}
          will be marked as paid. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            data-ocid="admin.payments.confirm_dialog.cancel_button"
            className="btn-secondary flex-1 py-2.5 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-ocid="admin.payments.confirm_dialog.confirm_button"
            className="btn-primary flex-1 py-2.5 text-sm bg-accent border-accent hover:bg-accent/90"
          >
            Confirm Paid
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

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
  const [centerSearch, setCenterSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Confirm dialog state
  const [confirmPaymentId, setConfirmPaymentId] = useState<bigint | null>(null);
  const [confirmInvoiceNum, setConfirmInvoiceNum] = useState("");

  const { data: centers = [] } = useQuery<CollectionCenterPublic[]>({
    queryKey: ["admin.centers", user?.token],
    queryFn: () => api.getCenters(user!.token),
    enabled: !!user?.token,
  });

  const selectedCenterName =
    selectedCenter === "all"
      ? "All Centers"
      : (centers.find((c) => c.id === selectedCenter)?.name ?? selectedCenter);

  const { data: payments = [], isLoading } = useQuery<PaymentPublic[]>({
    queryKey: ["admin.payments", user?.token, selectedCenter],
    queryFn: async () => {
      if (!user?.token) return [];
      if (selectedCenter === "all") {
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

  const { data: billingStats } = useQuery<BillingStats>({
    queryKey: ["admin.billingStats", user?.token, selectedCenter],
    queryFn: () =>
      selectedCenter !== "all"
        ? api.getBillingStats(user!.token, selectedCenter)
        : Promise.resolve<BillingStats>({
            totalTests: BigInt(0),
            totalCommission: BigInt(0),
            lastPayment: undefined,
          }),
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
      qc.invalidateQueries({ queryKey: ["admin.billingStats"] });
      setAddOpen(false);
      setForm({ centerId: "", amount: "", invoiceNumber: "", notes: "" });
      setFormError("");
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const markPaidMutation = useMutation({
    mutationFn: async (paymentId: bigint) => {
      if (!user?.token) throw new Error("Not logged in");
      return api.markPaymentPaid(user.token, paymentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin.payments"] });
      qc.invalidateQueries({ queryKey: ["admin.billingStats"] });
      setConfirmPaymentId(null);
    },
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

  function getCenterNameById(id: string) {
    return centers.find((c) => c.id === id)?.name ?? id;
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Payment Management"
          subtitle="View partner earnings, add payments, and generate invoices"
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

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1 mb-5">
          <StatCard
            icon={<Wallet className="w-4 h-4 text-warning" />}
            label="Pending"
            value={formatCurrency(totalPending)}
          />
          <StatCard
            icon={<CheckCircle className="w-4 h-4 text-accent" />}
            label="Paid Out"
            value={formatCurrency(totalPaid)}
            accent
          />
          {selectedCenter !== "all" && billingStats ? (
            <>
              <StatCard
                icon={<TrendingUp className="w-4 h-4 text-primary" />}
                label="Total Tests"
                value={Number(billingStats.totalTests).toLocaleString("en-IN")}
              />
              <StatCard
                icon={<CreditCard className="w-4 h-4 text-primary" />}
                label="Total Commission"
                value={formatCurrency(Number(billingStats.totalCommission))}
              />
            </>
          ) : (
            <>
              <StatCard
                icon={<FileText className="w-4 h-4 text-primary" />}
                label="Total Records"
                value={payments.length.toString()}
              />
              <StatCard
                icon={<CreditCard className="w-4 h-4 text-primary" />}
                label="Pending Count"
                value={payments
                  .filter((p) => p.status === PaymentStatus.pending)
                  .length.toString()}
              />
            </>
          )}
        </div>

        {/* Center filter dropdown */}
        <div className="relative mb-5" data-ocid="admin.payments.center_filter">
          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            data-ocid="admin.payments.center_select"
            className="input-field w-full text-left flex items-center justify-between"
          >
            <span
              className={
                selectedCenter === "all"
                  ? "text-muted-foreground"
                  : "text-foreground font-medium"
              }
            >
              {selectedCenter === "all"
                ? "Filter by Collection Center"
                : selectedCenterName}
            </span>
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDropdown && (
            <div
              className="absolute z-20 left-0 right-0 mt-1 border border-border rounded-xl bg-card shadow-lg overflow-hidden"
              onBlur={() => setShowDropdown(false)}
            >
              <div className="p-2 border-b border-border">
                <input
                  type="search"
                  value={centerSearch}
                  onChange={(e) => setCenterSearch(e.target.value)}
                  placeholder="Search centers..."
                  data-ocid="admin.payments.center_search_input"
                  className="input-field w-full text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-56 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCenter("all");
                    setCenterSearch("");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border font-medium text-foreground"
                >
                  All Centers
                </button>
                {filteredCenters.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCenter(c.id);
                      setCenterSearch("");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted transition-smooth text-sm border-b border-border last:border-0"
                  >
                    <span className="font-medium text-foreground">
                      {c.name}
                    </span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {c.id}
                    </span>
                  </button>
                ))}
                {filteredCenters.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No centers found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-xl border border-border overflow-hidden bg-card shadow-md">
          <table className="w-full text-sm" data-ocid="admin.payments.table">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {[
                  "Invoice #",
                  "Collection Center",
                  "Amount",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide ${i === 2 ? "text-right" : i === 4 ? "text-center" : i === 5 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                    data-ocid="admin.payments.loading_state"
                  >
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center"
                    data-ocid="admin.payments.empty_state"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="w-8 h-8 text-muted-foreground/40" />
                      <p className="text-muted-foreground text-sm font-medium">
                        No payment records found
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Add a payment entry to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((pay, i) => (
                  <tr
                    key={pay.id.toString()}
                    className={`border-b border-border last:border-0 hover:bg-muted/20 transition-smooth ${i % 2 === 1 ? "bg-muted/10" : ""}`}
                    data-ocid={`admin.payments.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                      #{pay.invoiceNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground text-sm">
                        {getCenterNameById(pay.centerId)}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {pay.centerId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-display font-bold text-foreground">
                        ₹{Number(pay.amount).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">
                      {formatDate(pay.date)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PaymentStatusBadge status={pay.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {/* Generate Invoice */}
                        <button
                          type="button"
                          onClick={() =>
                            openInvoice(pay, getCenterNameById(pay.centerId))
                          }
                          data-ocid={`admin.payments.invoice_button.${i + 1}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-smooth"
                        >
                          <FileText className="w-3 h-3" />
                          Invoice
                        </button>
                        {/* Mark Paid */}
                        {pay.status === PaymentStatus.pending ? (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmPaymentId(pay.id);
                              setConfirmInvoiceNum(pay.invoiceNumber);
                            }}
                            data-ocid={`admin.payments.mark_paid_button.${i + 1}`}
                            disabled={markPaidMutation.isPending}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-lg transition-smooth disabled:opacity-50"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground px-2">
                            —
                          </span>
                        )}
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
            payments.map((pay, i) => (
              <div
                key={pay.id.toString()}
                className="card-elevated p-4"
                data-ocid={`admin.payments.item.${i + 1}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${pay.status === PaymentStatus.paid ? "bg-accent/10" : "bg-warning/10"}`}
                  >
                    <CreditCard
                      className={`w-4 h-4 ${pay.status === PaymentStatus.paid ? "text-accent" : "text-warning"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-primary font-mono">
                        #{pay.invoiceNumber}
                      </p>
                      <PaymentStatusBadge status={pay.status} />
                    </div>
                    <p className="font-medium text-sm text-foreground mt-0.5">
                      {getCenterNameById(pay.centerId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(pay.date)}
                    </p>
                    {pay.notes && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {pay.notes}
                      </p>
                    )}
                  </div>
                  <span className="font-display font-bold text-sm text-foreground flex-shrink-0">
                    ₹{Number(pay.amount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border">
                  <button
                    type="button"
                    onClick={() =>
                      openInvoice(pay, getCenterNameById(pay.centerId))
                    }
                    data-ocid={`admin.payments.invoice_button.${i + 1}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-smooth"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Generate Invoice
                  </button>
                  {pay.status === PaymentStatus.pending && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmPaymentId(pay.id);
                        setConfirmInvoiceNum(pay.invoiceNumber);
                      }}
                      data-ocid={`admin.payments.mark_paid_button.${i + 1}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-smooth"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirm Mark Paid Dialog */}
      <ConfirmDialog
        isOpen={confirmPaymentId !== null}
        invoiceNum={confirmInvoiceNum}
        onConfirm={() => {
          if (confirmPaymentId !== null)
            markPaidMutation.mutate(confirmPaymentId);
        }}
        onCancel={() => setConfirmPaymentId(null)}
      />

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
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="ap-center"
              className="block text-xs font-semibold text-foreground mb-1.5"
            >
              Collection Center *
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

          <div>
            <label
              htmlFor="ap-inv"
              className="block text-xs font-semibold text-foreground mb-1.5"
            >
              Invoice Number *
            </label>
            <input
              id="ap-inv"
              type="text"
              value={form.invoiceNumber}
              onChange={(e) =>
                setForm({ ...form, invoiceNumber: e.target.value })
              }
              placeholder="e.g. INV-2024-001"
              data-ocid="admin.payments.add_modal.invoiceNumber_input"
              className="input-field w-full"
            />
          </div>

          <div>
            <label
              htmlFor="ap-amt"
              className="block text-xs font-semibold text-foreground mb-1.5"
            >
              Amount (₹) *
            </label>
            <input
              id="ap-amt"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 5000"
              data-ocid="admin.payments.add_modal.amount_input"
              className="input-field w-full"
              min="0"
            />
          </div>

          <div>
            <label
              htmlFor="ap-notes"
              className="block text-xs font-semibold text-foreground mb-1.5"
            >
              Notes
            </label>
            <textarea
              id="ap-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional payment details..."
              data-ocid="admin.payments.add_modal.notes_input"
              className="input-field w-full resize-none"
              rows={3}
            />
          </div>

          {formError && (
            <p
              className="text-destructive text-xs bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2"
              data-ocid="admin.payments.add_modal.error_state"
            >
              {formError}
            </p>
          )}

          <div className="flex gap-2 pt-1">
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
              data-ocid="admin.payments.add_modal.submit_button"
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
