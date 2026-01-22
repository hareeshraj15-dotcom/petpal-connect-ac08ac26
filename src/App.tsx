import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Pet Owner Dashboard
import PetOwnerDashboard from "./pages/PetOwnerDashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyPets from "./pages/dashboard/MyPets";
import HealthRecords from "./pages/dashboard/HealthRecords";
import Appointments from "./pages/dashboard/Appointments";
import Marketplace from "./pages/dashboard/Marketplace";
import Orders from "./pages/dashboard/Orders";
import Messages from "./pages/dashboard/Messages";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";

// Vet Dashboard
import VetDashboard from "./pages/vet/VetDashboard";
import VetHome from "./pages/vet/VetHome";
import VetAppointments from "./pages/vet/VetAppointments";
import VetConsultations from "./pages/vet/VetConsultations";
import VetPetRecords from "./pages/vet/VetPetRecords";
import VetPrescriptions from "./pages/vet/VetPrescriptions";
import VetMessages from "./pages/vet/VetMessages";
import VetProfile from "./pages/vet/VetProfile";
import VetAvailability from "./pages/vet/VetAvailability";

// Admin Dashboard
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Pet Owner Dashboard */}
          <Route path="/dashboard" element={<PetOwnerDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="my-pets" element={<MyPets />} />
            <Route path="health-records" element={<HealthRecords />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="orders" element={<Orders />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Veterinarian Dashboard */}
          <Route path="/vet-dashboard" element={<VetDashboard />}>
            <Route index element={<VetHome />} />
            <Route path="appointments" element={<VetAppointments />} />
            <Route path="consultations" element={<VetConsultations />} />
            <Route path="pet-records" element={<VetPetRecords />} />
            <Route path="prescriptions" element={<VetPrescriptions />} />
            <Route path="messages" element={<VetMessages />} />
            <Route path="profile" element={<VetProfile />} />
            <Route path="availability" element={<VetAvailability />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
