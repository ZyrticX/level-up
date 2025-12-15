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
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminInstitutionsPage from "./pages/AdminInstitutionsPage";
import AdminGroupsPage from "./pages/AdminGroupsPage";
import AdminContentPage from "./pages/AdminContentPage";
import AdminVideoLibraryPage from "./pages/AdminVideoLibraryPage";
import AdminVideoEditorPage from "./pages/AdminVideoEditorPage";
import AdminCourseBuilderPage from "./pages/AdminCourseBuilderPage";
import AdminTrackingPage from "./pages/AdminTrackingPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminSubjectsPage from "./pages/AdminSubjectsPage";
import AdminHetznerVideosPage from "./pages/AdminHetznerVideosPage";
import AdminVideoPreviewPage from "./pages/AdminVideoPreviewPage";
import SettingsPage from "./pages/SettingsPage";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import TestPage from "./pages/TestPage";
import CoursePagePurchased from "./pages/CoursePagePurchased";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import CookieConsent from "./components/CookieConsent";
import PrivacyPage from "./pages/PrivacyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CoursesPage from "./pages/CoursesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CookieConsent />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
            <Route path="/institution/:institutionId" element={<Layout><InstitutionPage /></Layout>} />
            <Route path="/course/:courseId" element={<Layout><CoursePage /></Layout>} />
            <Route path="/checkout/:courseId" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/watch/:courseId" element={<Layout><VideoPlayerPage /></Layout>} />
            <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
            <Route path="/my-courses" element={<Layout><MyCoursesPage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/course-purchased/:courseId" element={<Layout><CoursePagePurchased /></Layout>} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/courses" element={<AdminLayout><AdminPage /></AdminLayout>} />
            <Route path="/admin/students" element={<AdminLayout><AdminStudentsPage /></AdminLayout>} />
            <Route path="/admin/institutions" element={<AdminLayout><AdminInstitutionsPage /></AdminLayout>} />
            <Route path="/admin/groups" element={<AdminLayout><AdminGroupsPage /></AdminLayout>} />
            <Route path="/admin/content" element={<AdminLayout><AdminContentPage /></AdminLayout>} />
            <Route path="/admin/video-library" element={<AdminLayout><AdminVideoLibraryPage /></AdminLayout>} />
            <Route path="/admin/video-editor/:id" element={<AdminLayout><AdminVideoEditorPage /></AdminLayout>} />
            <Route path="/admin/course-builder" element={<AdminLayout><AdminCourseBuilderPage /></AdminLayout>} />
            <Route path="/admin/tracking" element={<AdminLayout><AdminTrackingPage /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><AdminReportsPage /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
            <Route path="/admin/subjects" element={<AdminLayout><AdminSubjectsPage /></AdminLayout>} />
            <Route path="/admin/hetzner-videos" element={<AdminLayout><AdminHetznerVideosPage /></AdminLayout>} />
            <Route path="/admin/preview/:videoId" element={<AdminVideoPreviewPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
