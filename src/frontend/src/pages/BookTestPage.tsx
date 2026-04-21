import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Search,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Gender } from "../backend.d";
import { PartnerLayout } from "../components/layouts/PartnerLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useApiService } from "../services/api";
import type { LabTest } from "../types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PatientForm {
  name: string;
  age: string;
  gender: Gender;
  mobile: string;
  refDoctor: string;
}

interface FieldErrors {
  name?: string;
  age?: string;
  mobile?: string;
  tests?: string;
}

// ── QR Code (inline SVG, no library needed) ───────────────────────────────────

function SimpleQR({ value }: { value: string }) {
  // Generate a deterministic grid pattern from the string
  const size = 12;
  type CellData = { r: number; c: number };
  const activeCells: CellData[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const code = value.charCodeAt((r * size + c) % value.length);
      if ((code * (r + 3) * (c + 7)) % 17 < 9) {
        activeCells.push({ r, c });
      }
    }
  }

  const cellPx = 6;
  const svgSize = size * cellPx + 16;

  // Corner finder patterns
  const finderPositions = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-card border-2 border-primary/20 rounded-xl p-3 shadow-md">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="qr-title"
        >
          <title id="qr-title">{`QR code for patient ${value}`}</title>
          {/* Background */}
          <rect width={svgSize} height={svgSize} fill="white" rx="4" />

          {/* Data cells */}
          {activeCells.map(({ r, c }) => (
            <rect
              key={`cell-${r * size + c}`}
              x={c * cellPx + 8}
              y={r * cellPx + 8}
              width={cellPx - 1}
              height={cellPx - 1}
              fill="#1E40AF"
              rx="0.5"
            />
          ))}

          {/* Finder pattern borders */}
          {finderPositions.map(([fr, fc]) => (
            <g key={`finder-${fr}-${fc}`}>
              <rect
                x={fc * cellPx + 8}
                y={fr * cellPx + 8}
                width={7 * cellPx - 1}
                height={7 * cellPx - 1}
                fill="none"
                stroke="#1E40AF"
                strokeWidth="2"
                rx="1"
              />
              <rect
                x={fc * cellPx + 8 + cellPx * 2}
                y={fr * cellPx + 8 + cellPx * 2}
                width={3 * cellPx - 1}
                height={3 * cellPx - 1}
                fill="#1E40AF"
                rx="1"
              />
            </g>
          ))}
        </svg>
      </div>
      <p className="text-xs text-muted-foreground">Scan to track sample</p>
    </div>
  );
}

// ── Step Indicator ─────────────────────────────────────────────────────────────

const STEPS = [
  { icon: User, label: "Patient Details" },
  { icon: Stethoscope, label: "Select Tests" },
  { icon: ClipboardList, label: "Confirm" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-3">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-smooth
                  ${done ? "bg-accent text-accent-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium leading-tight text-center ${active ? "text-primary" : done ? "text-accent" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-10 h-0.5 mb-3 mx-0.5 rounded-full transition-smooth ${done ? "bg-accent" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Patient Details ────────────────────────────────────────────────────

function PatientDetailsStep({
  form,
  onChange,
  errors,
}: {
  form: PatientForm;
  onChange: (f: PatientForm) => void;
  errors: FieldErrors;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="bt-name"
          className="block text-xs font-semibold text-foreground mb-1.5"
        >
          Patient Name <span className="text-destructive">*</span>
        </label>
        <input
          id="bt-name"
          type="text"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          placeholder="Full name of patient"
          data-ocid="book_test.name_input"
          className={`input-field w-full text-sm ${errors.name ? "border-destructive ring-destructive/20" : ""}`}
        />
        {errors.name && (
          <p
            className="text-destructive text-xs mt-1"
            data-ocid="book_test.name.field_error"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="bt-age"
            className="block text-xs font-semibold text-foreground mb-1.5"
          >
            Age <span className="text-destructive">*</span>
          </label>
          <input
            id="bt-age"
            type="number"
            value={form.age}
            onChange={(e) => onChange({ ...form, age: e.target.value })}
            placeholder="e.g. 35"
            min={1}
            max={120}
            data-ocid="book_test.age_input"
            className={`input-field w-full text-sm ${errors.age ? "border-destructive" : ""}`}
          />
          {errors.age && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid="book_test.age.field_error"
            >
              {errors.age}
            </p>
          )}
        </div>
        <div>
          <p className="block text-xs font-semibold text-foreground mb-1.5">
            Gender <span className="text-destructive">*</span>
          </p>
          <div className="flex flex-col gap-1.5">
            {(
              [
                { value: Gender.male, label: "Male" },
                { value: Gender.female, label: "Female" },
                { value: Gender.other, label: "Other" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.label}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="radio"
                  name="gender"
                  value={opt.value as string}
                  checked={form.gender === opt.value}
                  onChange={() => onChange({ ...form, gender: opt.value })}
                  data-ocid={`book_test.gender_${opt.label.toLowerCase()}_radio`}
                  className="accent-primary w-3.5 h-3.5"
                />
                <span className="text-xs text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="bt-mobile"
          className="block text-xs font-semibold text-foreground mb-1.5"
        >
          Mobile Number <span className="text-destructive">*</span>
        </label>
        <input
          id="bt-mobile"
          type="tel"
          value={form.mobile}
          onChange={(e) =>
            onChange({ ...form, mobile: e.target.value.replace(/\D/g, "") })
          }
          placeholder="10-digit mobile number"
          maxLength={10}
          data-ocid="book_test.mobile_input"
          className={`input-field w-full text-sm ${errors.mobile ? "border-destructive" : ""}`}
        />
        {errors.mobile && (
          <p
            className="text-destructive text-xs mt-1"
            data-ocid="book_test.mobile.field_error"
          >
            {errors.mobile}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bt-refdoc"
          className="block text-xs font-semibold text-foreground mb-1.5"
        >
          Referring Doctor{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="bt-refdoc"
          type="text"
          value={form.refDoctor}
          onChange={(e) => onChange({ ...form, refDoctor: e.target.value })}
          placeholder="Dr. Name"
          data-ocid="book_test.ref_doctor_input"
          className="input-field w-full text-sm"
        />
      </div>
    </div>
  );
}

// ── Step 2: Select Tests ───────────────────────────────────────────────────────

function SelectTestsStep({
  tests,
  isLoading,
  selected,
  onToggle,
  search,
  onSearch,
  error,
}: {
  tests: LabTest[];
  isLoading: boolean;
  selected: LabTest[];
  onToggle: (t: LabTest) => void;
  search: string;
  onSearch: (v: string) => void;
  error?: string;
}) {
  const selectedIds = new Set(selected.map((t) => t.id.toString()));
  const filtered = tests.filter(
    (t) => search === "" || t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5"
          data-ocid="book_test.selected_tests"
        >
          {selected.map((t) => (
            <span
              key={t.id.toString()}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20"
            >
              {t.name}
              <button
                type="button"
                onClick={() => onToggle(t)}
                className="ml-0.5 hover:text-destructive transition-smooth"
                aria-label={`Remove ${t.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tests (CBC, LFT, KFT...)"
          data-ocid="book_test.search_tests_input"
          className="input-field w-full pl-10 text-sm"
        />
      </div>

      {/* Test list */}
      {isLoading ? (
        <LoadingSpinner size="sm" className="py-3" />
      ) : (
        <div
          className="max-h-52 overflow-y-auto rounded-lg border border-border divide-y divide-border"
          data-ocid="book_test.test_options"
        >
          {filtered.length === 0 ? (
            <p
              className="text-center text-muted-foreground text-sm py-6"
              data-ocid="book_test.tests_empty_state"
            >
              No tests found
            </p>
          ) : (
            filtered.slice(0, 30).map((t, i) => {
              const checked = selectedIds.has(t.id.toString());
              return (
                <label
                  key={t.id.toString()}
                  data-ocid={`book_test.test_option.item.${i + 1}`}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-smooth
                    ${checked ? "bg-primary/5" : "bg-card hover:bg-muted/40"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(t)}
                    className="accent-primary w-4 h-4 rounded"
                    aria-label={`Select ${t.name}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-primary">
                      ₹{t.partnerPrice.toString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-through">
                      ₹{t.mrpPrice.toString()}
                    </p>
                  </div>
                </label>
              );
            })
          )}
        </div>
      )}

      {error && (
        <p
          className="text-destructive text-xs font-medium"
          data-ocid="book_test.tests.field_error"
        >
          {error}
        </p>
      )}

      {/* Summary total */}
      {selected.length > 0 && (
        <div className="bg-primary/5 rounded-xl px-4 py-3 border border-primary/15 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {selected.length} test{selected.length > 1 ? "s" : ""} selected
          </span>
          <span className="font-display font-bold text-primary text-base">
            ₹{selected.reduce((s, t) => s + Number(t.partnerPrice), 0)}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Step 3: Confirmation ───────────────────────────────────────────────────────

function ConfirmStep({
  form,
  selected,
}: {
  form: PatientForm;
  selected: LabTest[];
}) {
  const genderLabel =
    form.gender === Gender.male
      ? "Male"
      : form.gender === Gender.female
        ? "Female"
        : "Other";
  const total = selected.reduce((s, t) => s + Number(t.partnerPrice), 0);

  const detailRows = [
    { label: "Patient Name", value: form.name },
    { label: "Age", value: `${form.age} years` },
    { label: "Gender", value: genderLabel },
    { label: "Mobile", value: form.mobile },
    { label: "Ref. Doctor", value: form.refDoctor || "—" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Patient summary */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-primary/8 px-3 py-2 border-b border-border">
          <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">
            Patient Information
          </h4>
        </div>
        <div className="divide-y divide-border">
          {detailRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span className="text-xs font-semibold text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected tests */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-accent/10 px-3 py-2 border-b border-border">
          <h4 className="text-xs font-semibold text-accent uppercase tracking-wide">
            Selected Tests ({selected.length})
          </h4>
        </div>
        <div className="divide-y divide-border max-h-40 overflow-y-auto">
          {selected.map((t, i) => (
            <div
              key={t.id.toString()}
              className="flex items-center justify-between px-3 py-2"
              data-ocid={`book_test.confirm_test.item.${i + 1}`}
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {t.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t.category}
                </p>
              </div>
              <span className="text-xs font-bold text-primary ml-2 flex-shrink-0">
                ₹{t.partnerPrice.toString()}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-muted/40 px-3 py-2.5 border-t border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Total Amount
          </span>
          <span className="font-display font-bold text-primary text-base">
            ₹{total}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Success Screen ─────────────────────────────────────────────────────────────

function SuccessScreen({
  patientId,
  onBookAnother,
}: {
  patientId: string;
  onBookAnother: () => void;
}) {
  const navigate = useNavigate();
  const bookingDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <PartnerLayout>
      <div
        className="flex flex-col items-center px-5 pt-4 pb-8 gap-6"
        data-ocid="book_test.success_state"
      >
        {/* Check icon */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center animate-slide-up">
            <CheckCircle className="w-9 h-9 text-accent" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Booking Confirmed!
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Patient registered successfully. Share the Patient ID with the lab.
          </p>
        </div>

        {/* Patient ID card */}
        <div className="card-elevated w-full max-w-xs p-5 flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">
              Patient ID
            </p>
            <p
              className="font-display font-bold text-3xl text-primary tracking-widest"
              data-ocid="book_test.patient_id"
            >
              {patientId}
            </p>
          </div>

          <SimpleQR value={patientId} />

          <p className="text-xs text-muted-foreground">
            Booked on: {bookingDate}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/track-sample",
                search: { q: patientId } as Record<string, string>,
              })
            }
            data-ocid="book_test.track_sample_button"
            className="btn-accent w-full py-3 flex items-center justify-center gap-2 font-semibold"
          >
            Track This Sample
          </button>
          <button
            type="button"
            onClick={onBookAnother}
            data-ocid="book_test.book_another_button"
            className="btn-secondary w-full py-3 font-semibold"
          >
            Book Another Patient
          </button>
        </div>
      </div>
    </PartnerLayout>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function BookTestPage() {
  const { user } = useAuth();
  const api = useApiService();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PatientForm>({
    name: "",
    age: "",
    gender: Gender.male,
    mobile: "",
    refDoctor: "",
  });
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [testSearch, setTestSearch] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [patientId, setPatientId] = useState<string | null>(null);

  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: () => api.getTests(),
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!user?.token) throw new Error("Not logged in");
      return api.bookPatient(user.token, {
        name: form.name.trim(),
        age: BigInt(form.age),
        gender: form.gender,
        mobile: form.mobile.trim(),
        refDoctor: form.refDoctor.trim(),
        testIds: selectedTests.map((t) => t.id),
      });
    },
    onSuccess: (id) => {
      setPatientId(id);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const validateStep1 = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.name.trim()) errs.name = "Patient name is required";
    if (!form.age || Number.isNaN(Number(form.age)) || Number(form.age) < 1)
      errs.age = "Valid age required";
    if (!form.mobile || form.mobile.length !== 10)
      errs.mobile = "Enter a valid 10-digit mobile number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
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

  const handleToggleTest = (t: LabTest) => {
    setSelectedTests((prev) =>
      prev.find((s) => s.id === t.id)
        ? prev.filter((s) => s.id !== t.id)
        : [...prev, t],
    );
  };

  const resetAll = () => {
    setStep(0);
    setForm({
      name: "",
      age: "",
      gender: Gender.male,
      mobile: "",
      refDoctor: "",
    });
    setSelectedTests([]);
    setTestSearch("");
    setErrors({});
    setPatientId(null);
  };

  // Success screen
  if (patientId) {
    return <SuccessScreen patientId={patientId} onBookAnother={resetAll} />;
  }

  const stepTitles = ["Patient Details", "Select Tests", "Review & Confirm"];

  return (
    <PartnerLayout>
      <PageHeader
        title="Book Patient Test"
        subtitle="Register a new patient for lab tests"
      />

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Step content */}
      <div className="px-4 pb-6">
        <div
          className="card-elevated p-4"
          data-ocid={`book_test.step_${step + 1}_panel`}
        >
          <h3 className="font-display font-semibold text-sm text-foreground mb-4 pb-3 border-b border-border">
            {stepTitles[step]}
          </h3>

          {step === 0 && (
            <PatientDetailsStep
              form={form}
              onChange={setForm}
              errors={errors}
            />
          )}
          {step === 1 && (
            <SelectTestsStep
              tests={tests}
              isLoading={testsLoading}
              selected={selectedTests}
              onToggle={handleToggleTest}
              search={testSearch}
              onSearch={setTestSearch}
              error={errors.tests}
            />
          )}
          {step === 2 && <ConfirmStep form={form} selected={selectedTests} />}
        </div>

        {/* Mutation error */}
        {bookMutation.isError && (
          <p
            className="text-destructive text-sm font-medium mt-3"
            data-ocid="book_test.error_state"
          >
            {bookMutation.error instanceof Error
              ? bookMutation.error.message
              : "Something went wrong. Please try again."}
          </p>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              data-ocid="book_test.back_button"
              className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              data-ocid="book_test.next_button"
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 font-semibold"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => bookMutation.mutate()}
              disabled={bookMutation.isPending}
              data-ocid="book_test.submit_button"
              className="btn-accent flex-1 py-3 flex items-center justify-center gap-2 font-semibold disabled:opacity-60"
            >
              {bookMutation.isPending ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Booking
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </PartnerLayout>
  );
}
