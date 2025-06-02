
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ExpensesPage } from "@/pages/ExpensesPage";
import { IncomePage } from "@/pages/IncomePage";
import { LoansPage } from "@/pages/LoansPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-slate-50">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center border-b bg-white px-6 shadow-sm">
              <SidebarTrigger className="mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors" />
              <h1 className="text-xl font-semibold text-slate-800">
                Financial Tracker
              </h1>
            </header>
            
            <main className="flex-1 bg-slate-50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/income" element={<IncomePage />} />
                <Route path="/loans" element={<LoansPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
