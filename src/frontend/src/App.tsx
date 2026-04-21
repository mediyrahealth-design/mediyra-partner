import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Role } from "./backend.d";
import { PageLoader } from "./components/ui/LoadingSpinner";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Lazy pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PriceListPage = lazy(() => import("./pages/PriceListPage"));
const BookTestPage = lazy(() => import("./pages/BookTestPage"));
const TrackSamplePage = lazy(() => import("./pages/TrackSamplePage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const AdminCentersPage = lazy(() => import("./pages/admin/AdminCentersPage"));
const AdminTestsPage = lazy(() => import("./pages/admin/AdminTestsPage"));
const AdminReportsPage = lazy(() => import("./pages/admin/AdminReportsPage"));
const AdminPaymentsPage = lazy(() => import("./pages/admin/AdminPaymentsPage"));

function RequireAuth({
  children,
  adminOnly = false,
}: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!user) {
    throw redirect({ to: adminOnly ? "/admin/login" : "/login" });
  }
  if (adminOnly && user.role !== Role.admin) {
    throw redirect({ to: "/dashboard" });
  }
  if (!adminOnly && user.role === Role.admin) {
    throw redirect({ to: "/admin/centers" });
  }
  return <>{children}</>;
}

// Root
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

// Public routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: () => <AdminLoginPage />,
});

// Partner routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

const priceListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/price-list",
  component: () => (
    <RequireAuth>
      <PriceListPage />
    </RequireAuth>
  ),
});

const bookTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book-test",
  component: () => (
    <RequireAuth>
      <BookTestPage />
    </RequireAuth>
  ),
});

const trackSampleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track-sample",
  component: () => (
    <RequireAuth>
      <TrackSamplePage />
    </RequireAuth>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <RequireAuth>
      <ReportsPage />
    </RequireAuth>
  ),
});

const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/billing",
  component: () => (
    <RequireAuth>
      <BillingPage />
    </RequireAuth>
  ),
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support",
  component: () => (
    <RequireAuth>
      <SupportPage />
    </RequireAuth>
  ),
});

// Admin routes
const adminCentersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/centers",
  component: () => (
    <RequireAuth adminOnly>
      <AdminCentersPage />
    </RequireAuth>
  ),
});

const adminTestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/tests",
  component: () => (
    <RequireAuth adminOnly>
      <AdminTestsPage />
    </RequireAuth>
  ),
});

const adminReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/reports",
  component: () => (
    <RequireAuth adminOnly>
      <AdminReportsPage />
    </RequireAuth>
  ),
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/payments",
  component: () => (
    <RequireAuth adminOnly>
      <AdminPaymentsPage />
    </RequireAuth>
  ),
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminLoginRoute,
  dashboardRoute,
  priceListRoute,
  bookTestRoute,
  trackSampleRoute,
  reportsRoute,
  billingRoute,
  supportRoute,
  adminCentersRoute,
  adminTestsRoute,
  adminReportsRoute,
  adminPaymentsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
