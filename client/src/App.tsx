
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OwnerLogin from "./pages/OwnerLogin";
import CustomerLogin from "./pages/CustomerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ViewProducts from "./pages/ViewProducts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product" element={<UpdateProduct />} />
          <Route path="/view-products" element={<ViewProducts />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
