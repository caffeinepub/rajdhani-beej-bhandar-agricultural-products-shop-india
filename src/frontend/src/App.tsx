import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from './i18n/I18nProvider';
import { LanguageSelectModal } from './components/i18n/LanguageSelectModal';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagerPage from './pages/admin/ProductManagerPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import PlannedFeaturesPage from './pages/admin/PlannedFeaturesPage';
import AdminEditTextPage from './pages/admin/AdminEditTextPage';
import AdminEditImagesPage from './pages/admin/AdminEditImagesPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import ReferenceWebsitePage from './pages/admin/ReferenceWebsitePage';
import AdminAgentsPage from './pages/admin/AdminAgentsPage';
import AdminRouteGuard from './components/admin/AdminRouteGuard';
import AgentOrdersPage from './pages/agent/AgentOrdersPage';
import AgentRouteGuard from './components/agent/AgentRouteGuard';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductListPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetailPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/$productId',
  component: CheckoutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <AdminRouteGuard>
      <ProductManagerPage />
    </AdminRouteGuard>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <AdminRouteGuard>
      <OrderManagementPage />
    </AdminRouteGuard>
  ),
});

const adminAgentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/agents',
  component: () => (
    <AdminRouteGuard>
      <AdminAgentsPage />
    </AdminRouteGuard>
  ),
});

const adminPlannedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/planned',
  component: () => (
    <AdminRouteGuard>
      <PlannedFeaturesPage />
    </AdminRouteGuard>
  ),
});

const adminEditTextRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/edit-text',
  component: () => (
    <AdminRouteGuard>
      <AdminEditTextPage />
    </AdminRouteGuard>
  ),
});

const adminEditImagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/edit-images',
  component: () => (
    <AdminRouteGuard>
      <AdminEditImagesPage />
    </AdminRouteGuard>
  ),
});

const adminGalleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/gallery',
  component: () => (
    <AdminRouteGuard>
      <AdminGalleryPage />
    </AdminRouteGuard>
  ),
});

const adminReferenceWebsiteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/reference-website',
  component: () => (
    <AdminRouteGuard>
      <ReferenceWebsitePage />
    </AdminRouteGuard>
  ),
});

const agentOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent/orders',
  component: () => (
    <AgentRouteGuard>
      <AgentOrdersPage />
    </AgentRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  checkoutRoute,
  contactRoute,
  adminDashboardRoute,
  adminProductsRoute,
  adminOrdersRoute,
  adminAgentsRoute,
  adminPlannedRoute,
  adminEditTextRoute,
  adminEditImagesRoute,
  adminGalleryRoute,
  adminReferenceWebsiteRoute,
  agentOrdersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <I18nProvider>
        <LanguageSelectModal />
        <RouterProvider router={router} />
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
