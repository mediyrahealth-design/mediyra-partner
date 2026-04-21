import { SampleStatus } from "../../backend.d";

const STATUS_CONFIG: Record<
  SampleStatus,
  { label: string; className: string; dot: string }
> = {
  [SampleStatus.sampleCollected]: {
    label: "Sample Collected",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-400",
  },
  [SampleStatus.sampleReceived]: {
    label: "Sample Received",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    dot: "bg-indigo-400",
  },
  [SampleStatus.processing]: {
    label: "Processing",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  [SampleStatus.reportReady]: {
    label: "Report Ready",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400",
  },
};

interface StatusBadgeProps {
  status: SampleStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function SAMPLE_STATUS_STEPS() {
  return [
    SampleStatus.sampleCollected,
    SampleStatus.sampleReceived,
    SampleStatus.processing,
    SampleStatus.reportReady,
  ];
}
