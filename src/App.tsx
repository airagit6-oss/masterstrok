import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import ResellerGuard from "@/components/ResellerGuard";
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Public pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscribeCheckoutPage from "./pages/SubscribeCheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import SearchPage from "./pages/SearchPage";
import SupportPage from "./pages/SupportPage";
import ResellerApplyPage from "./pages/ResellerApplyPage";
import NotFound from "./pages/NotFound";

// User dashboard
import DashboardLayout from "./pages/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage";
import RecentPage from "./pages/RecentPage";
import DashboardSubscriptionPage from "./pages/DashboardSubscriptionPage";
import AppsPage from "./pages/AppsPage";

// User dashboard sub-pages
import ProfilePage from "./pages/dashboard/ProfilePage";
import BillingPage from "./pages/dashboard/BillingPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SecurityPage from "./pages/dashboard/SecurityPage";

// App access (subscription-gated)
import AppAccessPage from "./pages/AppAccessPage";

// Reseller
import ResellerLayout from "./pages/ResellerLayout";
import ResellerDashboardPage from "./pages/ResellerDashboardPage";
import ResellerUsersPage from "./pages/ResellerUsersPage";
import ResellerLeadsPage from "./pages/ResellerLeadsPage";
import ResellerPipelinePage from "./pages/ResellerPipelinePage";
import ResellerContactsPage from "./pages/ResellerContactsPage";
import ResellerSubscriptionsPage from "./pages/ResellerSubscriptionsPage";
import ResellerProductsPage from "./pages/ResellerProductsPage";
import ResellerEarningsPage from "./pages/ResellerEarningsPage";
import ResellerSettingsPage from "./pages/ResellerSettingsPage";
import ResellerCommissionsPage from "./pages/reseller/ResellerCommissionsPage";
import ResellerReportsPage from "./pages/reseller/ResellerReportsPage";
import ResellerMarketingPage from "./pages/reseller/ResellerMarketingPage";
import ResellerPayoutsHistoryPage from "./pages/reseller/ResellerPayoutsHistoryPage";

// Admin
import AdminLayout from "./pages/AdminLayout";
import AdminGalleryPage from "./pages/AdminGalleryPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminSubscriptionsPage from "./pages/AdminSubscriptionsPage";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import RevenuePage from "./pages/RevenuePage";
import LogsPage from "./pages/LogsPage";
import AlertsPage from "./pages/AlertsPage";
import InfrastructurePage from "./pages/InfrastructurePage";
import MetricsPage from "./pages/MetricsPage";
import TracesPage from "./pages/TracesPage";
import DashboardsPage from "./pages/DashboardsPage";
import SettingsPage from "./pages/SettingsPage";
import VendorsPage from "./pages/admin/VendorsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import ReviewsPage from "./pages/admin/ReviewsPage";
import CouponsPage from "./pages/admin/CouponsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import EmailTemplatesPage from "./pages/admin/EmailTemplatesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/reseller-apply" element={<ResellerApplyPage />} />

              {/* Category hierarchy (macro, macro/sub, macro/sub/micro) */}
              <Route path="/category/:macro" element={<HomePage />} />
              <Route path="/category/:macro/:sub" element={<HomePage />} />
              <Route path="/category/:macro/:sub/:micro" element={<HomePage />} />

              {/* Product */}
              <Route path="/product/:id" element={<ProductPage />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/subscribe-checkout" element={<SubscribeCheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />

              {/* App access — subscription-gated */}
              <Route
                path="/app/:productId"
                element={
                  <SubscriptionGuard>
                    <AppAccessPage />
                  </SubscriptionGuard>
                }
              />

              {/* User dashboard — auth-gated */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <DashboardLayout />
                  </AuthGuard>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="subscription" element={<DashboardSubscriptionPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="recent" element={<RecentPage />} />
              </Route>

              {/* Reseller — reseller/admin role required */}
              <Route
                path="/reseller"
                element={
                  <ResellerGuard>
                    <ResellerLayout />
                  </ResellerGuard>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ResellerDashboardPage />} />
                <Route path="leads" element={<ResellerLeadsPage />} />
                <Route path="pipeline" element={<ResellerPipelinePage />} />
                <Route path="contacts" element={<ResellerContactsPage />} />
                <Route path="users" element={<ResellerUsersPage />} />
                <Route path="subscriptions" element={<ResellerSubscriptionsPage />} />
                <Route path="products" element={<ResellerProductsPage />} />
                <Route path="earnings" element={<ResellerEarningsPage />} />
                <Route path="settings" element={<ResellerSettingsPage />} />
              </Route>

              {/* Admin / Boss panel — auth-gated (admin role) */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<OverviewPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
                <Route path="revenue" element={<RevenuePage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="infrastructure" element={<InfrastructurePage />} />
                <Route path="metrics" element={<MetricsPage />} />
                <Route path="traces" element={<TracesPage />} />
                <Route path="dashboards" element={<DashboardsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
              </Route>

              {/* Catch-all → redirect to home (zero 404) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
