import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock4,
  IndianRupee,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { PaymentStatus } from "../backend.d";
import { PartnerLayout } from "../components/layouts/PartnerLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useApiService } from "../services/api";
import type { PaymentPublic } from "../types";

function formatINR(amount: bigint): string {
  return Number(amount).toLocaleString("en-IN");
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getMonthYear(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function getMonthKey(ts: bigint): string {
  const d = new Date(Number(ts));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub?: string;
  ocid: string;
}

function StatCard({ icon, iconBg, label, value, sub, ocid }: StatCardProps) {
  return (
    <div className="card-elevated p-4 flex flex-col gap-3" data-ocid={ocid}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium leading-tight">
          {label}
        </p>
        <p className="font-display font-bold text-2xl text-foreground mt-0.5 leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
        )}
      </div>
    </div>
  );
}

interface PaymentRowProps {
  payment: PaymentPublic;
  index: number;
}

function PaymentRow({ payment, index }: PaymentRowProps) {
  const isPaid = payment.status === PaymentStatus.paid;
  return (
    <div
      className="card-elevated p-4 flex items-center gap-3"
      data-ocid={`billing.payment.item.${index}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isPaid ? "bg-accent/10" : "bg-warning/10"
        }`}
      >
        {isPaid ? (
          <CheckCircle2 className="w-5 h-5 text-accent" />
        ) : (
          <Clock4 className="w-5 h-5 text-warning" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          Invoice #{payment.invoiceNumber}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(payment.date)}
        </p>
        {payment.notes && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {payment.notes}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="font-display font-bold text-base text-foreground">
          ₹{formatINR(payment.amount)}
        </span>
        <span
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full leading-tight ${
            isPaid ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
          }`}
          data-ocid={`billing.payment.status.${index}`}
        >
          {isPaid ? "Paid" : "Pending"}
        </span>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const { user } = useAuth();
  const api = useApiService();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["billingStats", user?.token, user?.userId],
    queryFn: () => api.getBillingStats(user!.token, user!.userId),
    enabled: !!user?.token,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", user?.token, user?.userId],
    queryFn: () => api.getPaymentsByCenter(user!.token, user!.userId),
    enabled: !!user?.token,
  });

  // Build unique month options from payments
  const monthOptions = Array.from(
    new Map(
      payments.map((p) => [getMonthKey(p.date), getMonthYear(p.date)]),
    ).entries(),
  ).sort((a, b) => b[0].localeCompare(a[0]));

  const filteredPayments =
    selectedMonth === "all"
      ? payments
      : payments.filter((p) => getMonthKey(p.date) === selectedMonth);

  const lastPaymentSub = stats?.lastPayment
    ? `${formatDate(stats.lastPayment.date)} · ₹${formatINR(stats.lastPayment.amount)}`
    : "No payments yet";

  const selectedLabel =
    selectedMonth === "all"
      ? "All Time"
      : (monthOptions.find(([k]) => k === selectedMonth)?.[1] ?? "All Time");

  return (
    <PartnerLayout>
      <PageHeader
        title="Billing & Earnings"
        subtitle="Commission summary and payment records"
      />

      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Stats Row */}
        {statsLoading ? (
          <div className="grid grid-cols-2 gap-3">
            <CardSkeleton />
            <CardSkeleton />
            <div className="col-span-2">
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <div data-ocid="billing.stats_section">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <StatCard
                icon={<TrendingUp className="w-5 h-5 text-primary" />}
                iconBg="bg-primary/10"
                label="Total Tests Sent"
                value={stats?.totalTests.toString() ?? "0"}
                ocid="billing.stat.total_tests"
              />
              <StatCard
                icon={<IndianRupee className="w-5 h-5 text-accent" />}
                iconBg="bg-accent/10"
                label="Total Commission"
                value={`₹${formatINR(stats?.totalCommission ?? BigInt(0))}`}
                ocid="billing.stat.total_commission"
              />
            </div>
            <StatCard
              icon={<CalendarDays className="w-5 h-5 text-warning" />}
              iconBg="bg-warning/10"
              label="Last Payment"
              value={
                stats?.lastPayment
                  ? `₹${formatINR(stats.lastPayment.amount)}`
                  : "—"
              }
              sub={lastPaymentSub}
              ocid="billing.stat.last_payment"
            />
          </div>
        )}

        {/* Payment History Header + Filter */}
        <div className="flex items-center justify-between mt-1">
          <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            Payment History
          </h3>

          {/* Month Filter */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full transition-smooth hover:bg-primary/15 active:bg-primary/20"
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              aria-expanded={filterOpen}
              data-ocid="billing.month_filter.toggle"
            >
              {selectedLabel}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {filterOpen && (
              <div
                className="absolute right-0 top-8 z-20 w-44 card-elevated py-1 shadow-lg"
                data-ocid="billing.month_filter.dropdown"
              >
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-smooth hover:bg-muted ${
                    selectedMonth === "all"
                      ? "text-primary font-semibold"
                      : "text-foreground"
                  }`}
                  onClick={() => {
                    setSelectedMonth("all");
                    setFilterOpen(false);
                  }}
                  data-ocid="billing.month_filter.option.all"
                >
                  All Time
                </button>
                {monthOptions.map(([key, label], idx) => (
                  <button
                    key={key}
                    type="button"
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-smooth hover:bg-muted ${
                      selectedMonth === key
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }`}
                    onClick={() => {
                      setSelectedMonth(key);
                      setFilterOpen(false);
                    }}
                    data-ocid={`billing.month_filter.option.${idx + 1}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment List */}
        <div
          className="flex flex-col gap-2.5"
          data-ocid="billing.payments_list"
        >
          {paymentsLoading ? (
            ["psk1", "psk2", "psk3"].map((k) => <CardSkeleton key={k} />)
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              icon={<Receipt className="w-7 h-7" />}
              title="No payments yet"
              description={
                selectedMonth === "all"
                  ? "Your payment history will appear here once the lab processes a payment."
                  : "No payments found for the selected month."
              }
              data-ocid="billing.empty_state"
            />
          ) : (
            filteredPayments.map((pay, i) => (
              <PaymentRow key={pay.id.toString()} payment={pay} index={i + 1} />
            ))
          )}
        </div>
      </div>
    </PartnerLayout>
  );
}
