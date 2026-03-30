import { useState, createContext, useContext } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";

interface DashboardContextType {
  timeRange: string;
  setTimeRange: (t: string) => void;
  isLive: boolean;
  setIsLive: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  timeRange: "1h", setTimeRange: () => {},
  isLive: true, setIsLive: () => {},
  searchQuery: "", setSearchQuery: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState("1h");
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardContext.Provider value={{ timeRange, setTimeRange, isLive, setIsLive, searchQuery, setSearchQuery }}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
