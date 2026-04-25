import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index.tsx";
import RouteView from "./pages/RouteView.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import NotFound from "./pages/NotFound.tsx";
import RequireAdmin from "./components/RequireAdmin";
import InstallAppBanner from "./components/InstallAppBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
 <HashRouter>
   <Routes>
       <Route path="/" element={<Index />} />
           <Route path="/route/:id" element={<RouteView />} />
               <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
                  <Route path="*" element={<NotFound />} />
                     </Routes>
                     </HashRouter>
        <InstallAppBanner />
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
