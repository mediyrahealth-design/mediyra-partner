import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Barcode,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  HeadphonesIcon,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import type React from "react";
import { CenterStatus } from "../backend.d";
import { PartnerLayout } from "../components/layouts/PartnerLayout";
import { useAuth } from "../hooks/useAuth";
import { useApiService } from "../services/api";

const MENU_CARDS = [
  {
    title: "My Price List",
    desc: "View partner pricing for all tests",
    icon: ClipboardList,
    path: "/price-list",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    accent: "border-l-primary",
  },
  {
    title: "Book Patient Test",
    desc: "Register a new patient booking",
    icon: UserPlus,
    path: "/book-test",
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    accent: "border-l-accent",
    cta: "Start Booking",
  },
  {
    title: "Track Sample",
    desc: "Check real-time sample status",
    icon: Barcode,
    path: "/track-sample",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    accent: "border-l-primary",
    cta: "Track Now",
  },
  {
    title: "Download Report",
    desc: "Access and share patient reports",
    icon: Download,
    path: "/reports",
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    accent: "border-l-accent",
    cta: "Get Reports",
  },
  {
    title: "Billing & Earnings",
    desc: "Track payments and commission",
    icon: CreditCard,
    path: "/billing",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    accent: "border-l-primary",
  },
  {
    title: "Support",
    desc: "Call, WhatsApp or visit the lab",
    icon: HeadphonesIcon,
    path: "/support",
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    accent: "border-l-accent",
  },
] satisfies {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  iconColor: string;
  iconBg: string;
  accent: string;
  cta?: string;
}[];

const STATS = [
  {
    label: "Tests This Month",
    value: "—",
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Pending Reports",
    value: "—",
    icon: FileText,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Total Commission",
    value: "—",
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const statsVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.32,
      ease: "easeOut" as const,
    },
  }),
};

export default function DashboardPage() {
  const { user } = useAuth();
  const api = useApiService();

  const { data: center } = useQuery({
    queryKey: ["myCenter", user?.token],
    queryFn: () => api.getMyCenter(user!.token),
    enabled: !!user?.token,
  });

  const isActive = center?.status === CenterStatus.active;
  const displayName = user?.centerName ?? user?.userId ?? "Partner";

  return (
    <PartnerLayout>
      <div className="px-4 pt-5 pb-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-5"
        >
          <h2 className="font-display font-bold text-xl text-foreground leading-snug">
            Welcome, {displayName}
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-muted-foreground text-sm">
              Current Status:
            </span>
            <span
              className={`text-sm font-semibold flex items-center gap-1.5 ${
                isActive ? "text-accent" : "text-destructive"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-accent animate-pulse" : "bg-destructive"
                }`}
              />
            </span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div
          className="grid grid-cols-3 gap-2 mb-5"
          data-ocid="dashboard.stats_row"
        >
          {STATS.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={statsVariants}
              className="rounded-xl bg-card border border-border px-2 py-3 flex flex-col items-center gap-1.5 shadow-sm"
            >
              <div
                className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className="font-display font-bold text-base text-foreground leading-none">
                {value}
              </span>
              <span className="text-muted-foreground text-[10px] text-center leading-tight font-medium">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3"
        >
          Quick Actions
        </motion.p>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3" data-ocid="dashboard.menu_list">
          {MENU_CARDS.map(
            (
              { title, desc, icon: Icon, path, iconColor, iconBg, accent, cta },
              i,
            ) => (
              <motion.div
                key={path}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <Link
                  to={path}
                  data-ocid={`dashboard.menu.item.${i + 1}`}
                  className={`flex flex-col gap-3 bg-card border border-border border-l-4 ${accent} rounded-xl p-4 shadow-sm active:scale-[0.97] transition-smooth hover:shadow-md hover:border-l-4 group`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-smooth`}
                  >
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-sm text-foreground leading-tight">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug">
                      {desc}
                    </p>
                  </div>
                  {cta && (
                    <span className="w-full text-center text-xs font-semibold py-2 px-3 rounded-lg bg-accent text-accent-foreground transition-smooth group-hover:opacity-90">
                      {cta}
                    </span>
                  )}
                </Link>
              </motion.div>
            ),
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-8 mb-1">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </PartnerLayout>
  );
}
