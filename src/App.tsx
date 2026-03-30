import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import MetricsPage from "./pages/MetricsPage";
import LogsPage from "./pages/LogsPage";
import TracesPage from "./pages/TracesPage";
import InfrastructurePage from "./pages/InfrastructurePage";
import UsersPage from "./pages/UsersPage";
import AppsPage from "./pages/AppsPage";
import RevenuePage from "./pages/RevenuePage";
import AlertsPage from "./pages/AlertsPage";
import DashboardsPage from "./pages/DashboardsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/traces" element={<TracesPage />} />
            <Route path="/infrastructure" element={<InfrastructurePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/revenue" element={<RevenuePage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/dashboards" element={<DashboardsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
