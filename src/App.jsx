import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Nav.jsx'
import AboutFounder from "./Pages/About.jsx";
import AboutMission from "./Pages/About2.jsx";
import Staff from "./Pages/Staff.jsx";
import Services from "./Pages/Services.jsx";
import Bookings from "./Pages/Bookings.jsx";
import Alumni from "./Pages/Alumni.jsx";
import Contact from "./Pages/Contact.jsx";
import Home from "./Pages/Home.jsx";
import Footer from "./Components/Footer.jsx";
import AllAppointments from "./Pages/AllApointments.jsx";
import DetailAppointment from "./Pages/Detail.jsx";
import Login from "./Pages/login.jsx";
import Register from "./Pages/register.jsx";
import Dashboard from "./Pages/dashboard.jsx";

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={< AboutFounder/>} />
        <Route path="/mission" element={< AboutMission/>} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointments" element={<AllAppointments />} />
        <Route path="/detail" element={<DetailAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  )
}

export default App
