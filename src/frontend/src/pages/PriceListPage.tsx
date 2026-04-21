import { Clock, Droplets, FlaskConical, Search, TestTube } from "lucide-react";
import { useMemo, useState } from "react";
import { PartnerLayout } from "../components/layouts/PartnerLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import type { LabTest } from "../types";

// Pre-populated test catalog (service-layer seed data)
const CATALOG: LabTest[] = [
  {
    id: BigInt(1),
    name: "CBC",
    category: "Hematology",
    sampleType: "Blood",
    tubeType: "EDTA",
    fastingRequired: false,
    reportTime: "24 hrs",
    mrpPrice: BigInt(350),
    partnerPrice: BigInt(260),
  },
  {
    id: BigInt(2),
    name: "LFT",
    category: "Biochemistry",
    sampleType: "Blood",
    tubeType: "SST",
    fastingRequired: true,
    reportTime: "6 hrs",
    mrpPrice: BigInt(700),
    partnerPrice: BigInt(520),
  },
  {
    id: BigInt(3),
    name: "KFT",
    category: "Biochemistry",
    sampleType: "Blood",
    tubeType: "SST",
    fastingRequired: false,
    reportTime: "6 hrs",
    mrpPrice: BigInt(650),
    partnerPrice: BigInt(480),
  },
  {
    id: BigInt(4),
    name: "Lipid Profile",
    category: "Lipids",
    sampleType: "Blood",
    tubeType: "SST",
    fastingRequired: true,
    reportTime: "12 hrs",
    mrpPrice: BigInt(900),
    partnerPrice: BigInt(680),
  },
  {
    id: BigInt(5),
    name: "BSR",
    category: "Biochemistry",
    sampleType: "Blood",
    tubeType: "Sodium Fluoride",
    fastingRequired: true,
    reportTime: "2 hrs",
    mrpPrice: BigInt(150),
    partnerPrice: BigInt(100),
  },
  {
    id: BigInt(6),
    name: "Urine Routine",
    category: "Urine",
    sampleType: "Urine",
    tubeType: "Container",
    fastingRequired: false,
    reportTime: "2 hrs",
    mrpPrice: BigInt(200),
    partnerPrice: BigInt(140),
  },
];

const CATEGORIES = [
  "All",
  "Hematology",
  "Biochemistry",
  "Urine",
  "Lipids",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_CHIP: Record<string, string> = {
  Hematology: "bg-rose-100 text-rose-700 border-rose-200",
  Biochemistry: "bg-amber-100 text-amber-700 border-amber-200",
  Urine: "bg-purple-100 text-purple-700 border-purple-200",
  Lipids: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function categoryStyle(cat: string) {
  return CATEGORY_CHIP[cat] ?? "bg-muted text-muted-foreground border-border";
}

// ─── Test Card ────────────────────────────────────────────────────────────────
function TestCard({
  test,
  index,
  onTap,
}: {
  test: LabTest;
  index: number;
  onTap: (t: LabTest) => void;
}) {
  const savingsPct = Math.round(
    ((Number(test.mrpPrice) - Number(test.partnerPrice)) /
      Number(test.mrpPrice)) *
      100,
  );

  return (
    <button
      type="button"
      onClick={() => onTap(test)}
      data-ocid={`price_list.test.item.${index}`}
      className="card-elevated w-full text-left p-4 hover:shadow-lg active:scale-[0.98] transition-smooth"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-base text-foreground leading-tight truncate">
            {test.name}
          </h3>
          <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Droplets className="w-3 h-3 shrink-0" />
            {test.sampleType}
          </span>
        </div>
        <span
          className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${categoryStyle(test.category)}`}
        >
          {test.category}
        </span>
      </div>

      {/* Price row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground line-through mb-0.5">
            MRP ₹{test.mrpPrice.toString()}
          </p>
          <p className="text-xl font-display font-bold text-primary leading-none">
            ₹{test.partnerPrice.toString()}
          </p>
        </div>
        {savingsPct > 0 && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
            Save {savingsPct}%
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card">
      <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function TestDetailModal({
  test,
  onClose,
}: {
  test: LabTest | null;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={!!test}
      onClose={onClose}
      title={test?.name ?? ""}
      data-ocid="price_list.test_detail"
    >
      {test && (
        <div className="space-y-4">
          {/* Price highlight */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                Partner Price
              </p>
              <p className="text-2xl font-display font-bold text-primary">
                ₹{test.partnerPrice.toString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                MRP
              </p>
              <p className="text-base font-semibold text-muted-foreground line-through">
                ₹{test.mrpPrice.toString()}
              </p>
            </div>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            <DetailRow
              icon={<Droplets className="w-4 h-4 text-primary" />}
              label="Sample Type"
              value={test.sampleType}
            />
            <DetailRow
              icon={<TestTube className="w-4 h-4 text-primary" />}
              label="Tube Type"
              value={test.tubeType}
            />
            <DetailRow
              icon={<FlaskConical className="w-4 h-4 text-primary" />}
              label="Fasting Required"
              value={
                <span
                  className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    test.fastingRequired
                      ? "bg-orange-100 text-orange-700 border-orange-200"
                      : "bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {test.fastingRequired ? "Yes" : "No"}
                </span>
              }
            />
            <DetailRow
              icon={<Clock className="w-4 h-4 text-primary" />}
              label="Report Time"
              value={test.reportTime}
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              Category:
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle(test.category)}`}
            >
              {test.category}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PriceListPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATALOG.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.sampleType.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <PartnerLayout>
      {/* Sticky: title + search + filters */}
      <div className="sticky top-[60px] z-30 bg-background border-b border-border shadow-sm">
        {/* Title row */}
        <div className="px-4 pt-4 pb-2 flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              My Price List
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Exclusive partner rates for your center
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search tests or categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-10 h-10 text-sm"
              data-ocid="price_list.search_input"
              aria-label="Search tests"
            />
          </div>
        </div>

        {/* Category chips */}
        <div
          className="flex items-center gap-2 px-4 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
          aria-label="Filter by category"
          data-ocid="price_list.category_filter"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`price_list.filter.${cat.toLowerCase()}_tab`}
                className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-smooth ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 pt-3 pb-1">
        <p
          className="text-xs font-medium text-muted-foreground"
          data-ocid="price_list.results_count"
        >
          {filtered.length === 0
            ? "No tests found"
            : `${filtered.length} test${filtered.length !== 1 ? "s" : ""} available`}
        </p>
      </div>

      {/* Test list */}
      <div className="px-4 pb-24 space-y-3" data-ocid="price_list.test_list">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FlaskConical className="w-7 h-7" />}
            title="No tests found"
            description={
              search
                ? `No tests match "${search}". Try a different search or clear the filter.`
                : "No tests available in this category."
            }
            action={
              search || activeCategory !== "All" ? (
                <button
                  type="button"
                  className="btn-secondary text-sm mt-1"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  data-ocid="price_list.clear_filters_button"
                >
                  Clear filters
                </button>
              ) : undefined
            }
            data-ocid="price_list.empty_state"
          />
        ) : (
          filtered.map((test, i) => (
            <TestCard
              key={test.id.toString()}
              test={test}
              index={i + 1}
              onTap={setSelectedTest}
            />
          ))
        )}
      </div>

      {/* Test detail modal */}
      <TestDetailModal
        test={selectedTest}
        onClose={() => setSelectedTest(null)}
      />
    </PartnerLayout>
  );
}
