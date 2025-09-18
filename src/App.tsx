import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import InstitutionPage from "./pages/InstitutionPage";
import CoursePage from "./pages/CoursePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import AuthPage from "./pages/AuthPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import AdminPage from "./pages/AdminPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/institution/:institutionId" element={<Layout><InstitutionPage /></Layout>} />
            <Route path="/course/:courseId" element={<Layout><CoursePage /></Layout>} />
            <Route path="/watch/:courseId" element={<Layout><VideoPlayerPage /></Layout>} />
            <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
            <Route path="/my-courses" element={<Layout><MyCoursesPage /></Layout>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
