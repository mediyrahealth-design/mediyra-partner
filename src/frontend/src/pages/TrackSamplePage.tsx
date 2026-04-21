import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Download,
  Loader2,
  Search,
  TestTube2,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { SampleStatus } from "../backend.d";
import { PartnerLayout } from "../components/layouts/PartnerLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { useApiService } from "../services/api";
import type { PatientPublic } from "../types";

const RECENT_SEARCHES_KEY = "mediyra_recent_searches";
const MAX_RECENT = 5;

const STATUS_STEPS = [
  {
    status: SampleStatus.sampleCollected,
    label: "Sample Collected",
    sublabel: "Collected at center",
  },
  {
    status: SampleStatus.sampleReceived,
    label: "Sample Received",
    sublabel: "Received at Mediyra Lab",
  },
  {
    status: SampleStatus.processing,
    label: "Processing",
    sublabel: "Analysis in progress",
  },
  {
    status: SampleStatus.reportReady,
    label: "Report Ready",
    sublabel: "Report available to download",
  },
];

const STATUS_ORDER: Record<SampleStatus, number> = {
  [SampleStatus.sampleCollected]: 0,
  [SampleStatus.sampleReceived]: 1,
  [SampleStatus.processing]: 2,
  [SampleStatus.reportReady]: 3,
};

type SearchMode = "patientId" | "mobile";

function formatDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const recent = getRecentSearches().filter((q) => q !== query);
  recent.unshift(query);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT)),
  );
}

function removeRecentSearch(query: string) {
  const updated = getRecentSearches().filter((q) => q !== query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

export default function TrackSamplePage() {
  const { user } = useAuth();
  const api = useApiService();

  const [mode, setMode] = useState<SearchMode>("patientId");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [patient, setPatient] = useState<PatientPublic | null>(null);
  const [recentSearches, setRecentSearches] =
    useState<string[]>(getRecentSearches);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleModeSwitch = (m: SearchMode) => {
    setMode(m);
    setQuery("");
    setPatient(null);
    setSearched(false);
  };

  const doSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !user?.token) return;
    setLoading(true);
    setSearched(false);
    setPatient(null);
    try {
      const result = await api.trackSample(user.token, searchQuery.trim());
      setPatient(result);
      setSearched(true);
      saveRecentSearch(searchQuery.trim());
      setRecentSearches(getRecentSearches());
    } catch {
      setPatient(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
    doSearch(chip);
  };

  const handleRemoveChip = (chip: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(chip);
    setRecentSearches(getRecentSearches());
  };

  const currentStepIndex = patient ? STATUS_ORDER[patient.status] : -1;

  const showIdle = !loading && !searched && recentSearches.length === 0;
  const showRecent = !loading && !searched && recentSearches.length > 0;

  return (
    <PartnerLayout>
      <PageHeader
        title="Track Sample"
        subtitle="Search by Patient ID or Mobile Number"
      />

      {/* Search Mode Toggle */}
      <div className="px-4 mb-4">
        <div
          className="flex bg-muted rounded-xl p-1 gap-1"
          data-ocid="track.mode_toggle"
          role="tablist"
          aria-label="Search mode"
        >
          {(["patientId", "mobile"] as SearchMode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              data-ocid={`track.mode_${m}_tab`}
              onClick={() => handleModeSwitch(m)}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-smooth ${
                mode === m
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "patientId" ? "Patient ID" : "Mobile Number"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="px-4 mb-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              data-ocid="track.search_input"
              type={mode === "mobile" ? "tel" : "text"}
              inputMode={mode === "mobile" ? "numeric" : "text"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                mode === "patientId"
                  ? "e.g. MED-20240101-001"
                  : "e.g. 9876543210"
              }
              className="pl-9 pr-4 h-11 rounded-xl border-input bg-card text-sm"
              aria-label={mode === "patientId" ? "Patient ID" : "Mobile Number"}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            data-ocid="track.search_button"
            disabled={!query.trim() || loading}
            className="h-11 px-5 rounded-xl font-semibold gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>

      {/* Recent Searches */}
      {showRecent && (
        <div className="px-4 mb-4" data-ocid="track.recent_searches">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            Recent searches
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((chip) => (
              <div
                key={chip}
                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full border border-border overflow-hidden"
              >
                <button
                  type="button"
                  data-ocid="track.recent_chip"
                  onClick={() => handleChipClick(chip)}
                  className="flex items-center gap-1.5 pl-3 pr-1 py-1.5 hover:bg-muted transition-smooth"
                >
                  <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="max-w-[120px] truncate">{chip}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${chip}`}
                  onClick={(e) => handleRemoveChip(chip, e)}
                  className="pr-2 pl-0.5 py-1.5 text-muted-foreground hover:text-destructive transition-smooth"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="px-4 space-y-3" data-ocid="track.loading_state">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
            <div className="h-4 bg-muted rounded-full w-2/3 animate-pulse" />
            <div className="h-3 bg-muted rounded-full w-1/2 animate-pulse" />
            <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="h-3 bg-muted rounded-full flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Found */}
      {!loading && searched && !patient && (
        <EmptyState
          data-ocid="track.empty_state"
          icon={<Search className="w-8 h-8" />}
          title="Patient not found"
          description={
            mode === "patientId"
              ? "No patient found with that ID. Try searching by mobile number instead."
              : "No patient found with that mobile number. Try searching by Patient ID instead."
          }
          action={
            <Button
              variant="outline"
              size="sm"
              data-ocid="track.switch_mode_button"
              onClick={() =>
                handleModeSwitch(mode === "patientId" ? "mobile" : "patientId")
              }
              className="rounded-xl mt-1"
            >
              Try {mode === "patientId" ? "Mobile Number" : "Patient ID"}
            </Button>
          }
        />
      )}

      {/* Patient Result */}
      {!loading && patient && (
        <div className="px-4 space-y-4 pb-4">
          {/* Patient Info Card */}
          <div
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            data-ocid="track.patient_card"
          >
            <div className="bg-primary/[0.07] border-b border-border px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-base text-foreground truncate">
                  {patient.name}
                </p>
                <p className="text-xs text-muted-foreground font-mono tracking-wide mt-0.5 truncate">
                  {patient.id}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <InfoRow label="Age" value={`${patient.age} yrs`} />
              <InfoRow
                label="Gender"
                value={
                  patient.gender.charAt(0).toUpperCase() +
                  patient.gender.slice(1)
                }
              />
              <InfoRow label="Mobile" value={patient.mobile} />
              <InfoRow label="Ref. Doctor" value={patient.refDoctor || "—"} />
              <InfoRow
                label="Booked On"
                value={formatDate(patient.bookingDate)}
                span
              />
              <div className="col-span-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Tests
                </span>
                <p className="text-sm text-foreground font-semibold mt-0.5">
                  {patient.testIds.length} test
                  {patient.testIds.length !== 1 ? "s" : ""} booked
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div
            className="bg-card rounded-2xl border border-border shadow-sm px-4 pt-4 pb-5"
            data-ocid="track.status_timeline"
          >
            <p className="font-display font-semibold text-sm text-foreground mb-5">
              Sample Status
            </p>
            <div className="relative pl-4">
              {/* Vertical connector line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />

              <div className="space-y-0">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.status}
                      className="flex items-start gap-4 relative pb-6 last:pb-0"
                      data-ocid={`track.status_step.${idx + 1}`}
                    >
                      {/* Step indicator */}
                      <div className="relative z-10 flex-shrink-0 -ml-4">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                          </div>
                        ) : isCurrent ? (
                          <div className="relative w-8 h-8 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-40" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                            <Circle className="w-3 h-3 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>

                      {/* Step label */}
                      <div className="flex-1 pt-1 min-w-0">
                        <p
                          className={`text-sm font-semibold leading-tight ${
                            isCompleted
                              ? "text-primary"
                              : isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground/50"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            isCurrent
                              ? "text-primary/70 font-medium"
                              : "text-muted-foreground/60"
                          }`}
                        >
                          {isCurrent ? "Current status" : step.sublabel}
                        </p>
                      </div>

                      {isCompleted && (
                        <span className="flex-shrink-0 pt-1 text-xs font-bold text-primary">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Download Report CTA */}
          {patient.status === SampleStatus.reportReady && (
            <Link to="/reports" data-ocid="track.download_report_button">
              <Button className="w-full h-12 rounded-xl font-semibold text-sm gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Download Report
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Idle state */}
      {showIdle && (
        <div
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
          data-ocid="track.idle_state"
        >
          <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mb-4">
            <TestTube2 className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="font-display font-semibold text-base text-foreground mb-1">
            Track your sample
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            Enter a Patient ID or mobile number above to check sample status and
            report availability.
          </p>
        </div>
      )}
    </PartnerLayout>
  );
}

function InfoRow({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <p className="text-sm text-foreground font-semibold mt-0.5 truncate">
        {value}
      </p>
    </div>
  );
}
