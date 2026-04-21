import { r as reactExports, j as jsxRuntimeExports } from "./index-JOqAemMk.js";
import { P as PartnerLayout } from "./PartnerLayout-BZ-tItP5.js";
import { E as EmptyState } from "./EmptyState-Bs2VlqML.js";
import { M as Modal } from "./Modal-CS88njSf.js";
import { S as Search } from "./search-CQtgmj9r.js";
import { a as FlaskConical } from "./log-out-D-etv4XY.js";
import { c as createLucideIcon } from "./api-BJm7cS3U.js";
import { C as Clock } from "./clock-YVbpLAQB.js";
import "./x-DzgZfkJo.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
      key: "1ptgy4"
    }
  ],
  [
    "path",
    {
      d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
      key: "1sl1rz"
    }
  ]
];
const Droplets = createLucideIcon("droplets", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2", key: "125lnx" }],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }],
  ["path", { d: "M14.5 16h-5", key: "1ox875" }]
];
const TestTube = createLucideIcon("test-tube", __iconNode);
const CATALOG = [
  {
    id: BigInt(1),
    name: "CBC",
    category: "Hematology",
    sampleType: "Blood",
    tubeType: "EDTA",
    fastingRequired: false,
    reportTime: "24 hrs",
    mrpPrice: BigInt(350),
    partnerPrice: BigInt(260)
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
    partnerPrice: BigInt(520)
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
    partnerPrice: BigInt(480)
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
    partnerPrice: BigInt(680)
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
    partnerPrice: BigInt(100)
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
    partnerPrice: BigInt(140)
  }
];
const CATEGORIES = [
  "All",
  "Hematology",
  "Biochemistry",
  "Urine",
  "Lipids"
];
const CATEGORY_CHIP = {
  Hematology: "bg-rose-100 text-rose-700 border-rose-200",
  Biochemistry: "bg-amber-100 text-amber-700 border-amber-200",
  Urine: "bg-purple-100 text-purple-700 border-purple-200",
  Lipids: "bg-emerald-100 text-emerald-700 border-emerald-200"
};
function categoryStyle(cat) {
  return CATEGORY_CHIP[cat] ?? "bg-muted text-muted-foreground border-border";
}
function TestCard({
  test,
  index,
  onTap
}) {
  const savingsPct = Math.round(
    (Number(test.mrpPrice) - Number(test.partnerPrice)) / Number(test.mrpPrice) * 100
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onTap(test),
      "data-ocid": `price_list.test.item.${index}`,
      className: "card-elevated w-full text-left p-4 hover:shadow-lg active:scale-[0.98] transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-foreground leading-tight truncate", children: test.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "w-3 h-3 shrink-0" }),
              test.sampleType
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${categoryStyle(test.category)}`,
              children: test.category
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground line-through mb-0.5", children: [
              "MRP ₹",
              test.mrpPrice.toString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-display font-bold text-primary leading-none", children: [
              "₹",
              test.partnerPrice.toString()
            ] })
          ] }),
          savingsPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full", children: [
            "Save ",
            savingsPct,
            "%"
          ] })
        ] })
      ]
    }
  );
}
function DetailRow({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-muted-foreground font-medium", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: value })
  ] });
}
function TestDetailModal({
  test,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      isOpen: !!test,
      onClose,
      title: (test == null ? void 0 : test.name) ?? "",
      "data-ocid": "price_list.test_detail",
      children: test && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5", children: "Partner Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-display font-bold text-primary", children: [
              "₹",
              test.partnerPrice.toString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5", children: "MRP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-semibold text-muted-foreground line-through", children: [
              "₹",
              test.mrpPrice.toString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border rounded-xl border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "w-4 h-4 text-primary" }),
              label: "Sample Type",
              value: test.sampleType
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TestTube, { className: "w-4 h-4 text-primary" }),
              label: "Tube Type",
              value: test.tubeType
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-4 h-4 text-primary" }),
              label: "Fasting Required",
              value: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${test.fastingRequired ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700 border-green-200"}`,
                  children: test.fastingRequired ? "Yes" : "No"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary" }),
              label: "Report Time",
              value: test.reportTime
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Category:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle(test.category)}`,
              children: test.category
            }
          )
        ] })
      ] })
    }
  );
}
function PriceListPage() {
  const [search, setSearch] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("All");
  const [selectedTest, setSelectedTest] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATALOG.filter((t) => {
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.sampleType.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PartnerLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-[60px] z-30 bg-background border-b border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-4 pb-2 flex items-start justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground", children: "My Price List" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Exclusive partner rates for your center" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "search",
            placeholder: "Search tests or categories…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "input-field w-full pl-10 h-10 text-sm",
            "data-ocid": "price_list.search_input",
            "aria-label": "Search tests"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center gap-2 px-4 pb-3 overflow-x-auto",
          style: { scrollbarWidth: "none" },
          "aria-label": "Filter by category",
          "data-ocid": "price_list.category_filter",
          children: CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveCategory(cat),
                "data-ocid": `price_list.filter.${cat.toLowerCase()}_tab`,
                className: `shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-smooth ${isActive ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary"}`,
                children: cat
              },
              cat
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-xs font-medium text-muted-foreground",
        "data-ocid": "price_list.results_count",
        children: filtered.length === 0 ? "No tests found" : `${filtered.length} test${filtered.length !== 1 ? "s" : ""} available`
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-24 space-y-3", "data-ocid": "price_list.test_list", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-7 h-7" }),
        title: "No tests found",
        description: search ? `No tests match "${search}". Try a different search or clear the filter.` : "No tests available in this category.",
        action: search || activeCategory !== "All" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn-secondary text-sm mt-1",
            onClick: () => {
              setSearch("");
              setActiveCategory("All");
            },
            "data-ocid": "price_list.clear_filters_button",
            children: "Clear filters"
          }
        ) : void 0,
        "data-ocid": "price_list.empty_state"
      }
    ) : filtered.map((test, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TestCard,
      {
        test,
        index: i + 1,
        onTap: setSelectedTest
      },
      test.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TestDetailModal,
      {
        test: selectedTest,
        onClose: () => setSelectedTest(null)
      }
    )
  ] });
}
export {
  PriceListPage as default
};
