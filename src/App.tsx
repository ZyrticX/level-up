import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InstitutionPage from "./pages/InstitutionPage";
import CoursePage from "./pages/CoursePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import AuthPage from "./pages/AuthPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/institution/:institutionId" element={<InstitutionPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/watch/:courseId" element={<VideoPlayerPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
