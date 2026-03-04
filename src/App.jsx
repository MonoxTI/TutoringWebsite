// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🧭 Components & Pages
import Navbar from './Components/Nav.jsx';
import Footer from "./Components/Footer.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx"; // 👈 Import new component

// Pages
import Home from "./Pages/Home.jsx";
import AboutFounder from "./Pages/About.jsx";
import AboutMission from "./Pages/About2.jsx";
import Staff from "./Pages/Staff.jsx";
import Services from "./Pages/Services.jsx";
import Bookings from "./Pages/Bookings.jsx";
import Alumni from "./Pages/Alumni.jsx";
import Contact from "./Pages/Contact.jsx";
import AllAppointments from "./Pages/AllApointments.jsx";
import DetailAppointment from "./Pages/Detail.jsx";
import Login from "./Pages/login.jsx";
import Register from "./Pages/register.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import AdminDashboard from "./Pages/adminDashboard.jsx";
import PendingApproval from "./Pages/PendingApproval.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        
        <Routes>
          {/* 🌐 PUBLIC ROUTES - Anyone can visit */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutFounder />} />
          <Route path="/mission" element={<AboutMission />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending" element={<PendingApproval />} />

          {/* 🔐 PROTECTED ROUTES - Must be logged in + approved (role: "user" or "admin") */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <AllAppointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/detail" 
            element={
              <ProtectedRoute>
                <DetailAppointment />
              </ProtectedRoute>
            } 
          />

          {/* 👑 ADMIN ROUTES - Must be logged in + role: "admin" */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* ⚠️ CATCH-ALL: Redirect unknown routes to home */}
          <Route path="*" element={<Home />} />
        </Routes>
        
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;