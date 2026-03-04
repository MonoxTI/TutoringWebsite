// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LOGO from "../assets/LOGO.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔄 Check user auth status on mount & when storage changes
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // 🚪 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-3 px-6 shadow-md border-b-2 border-white">
      <div className="flex items-center justify-between gap-4">
        {/* 🏷️ Logo + Name - LEFT */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={LOGO}
            alt="Assembled Tutoring"
            className="h-12 w-auto object-contain"
          />
          <h1 className="text-xl md:text-2xl font-black text-white whitespace-nowrap tracking-tight">
            Assembled Tutoring
          </h1>
        </Link>

        {/* 📱 Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-blue-800/70 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* 🔗 Navigation Links - RIGHT (Desktop) */}
        <div className="hidden md:flex flex-wrap justify-end gap-2 md:gap-4 items-center">
          {/* Public Links - Everyone sees these */}
          <Link to="/services">
            <button className="px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors duration-200 font-medium whitespace-nowrap">
              Services
            </button>
          </Link>
          <Link to="/bookings">
            <button className="px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors duration-200 font-medium whitespace-nowrap">
              Bootcamp
            </button>
          </Link>
          <Link to="/contact">
            <button className="px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors duration-200 font-medium whitespace-nowrap">
              Contact
            </button>
          </Link>

          {/* 🔐 Auth Links - Only show for logged-in users */}
          {user && user.role !== "pending" && (
            <>
              <Link to="/dashboard">
                <button className="px-4 py-2 rounded-lg bg-white text-blue-900 hover:bg-gray-100 transition-colors duration-200 font-semibold whitespace-nowrap">
                  Dashboard
                </button>
              </Link>
              
              {/* 👑 Admin Only Link */}
              {user.role === "admin" && (
                <Link to="/admin">
                  <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 font-semibold whitespace-nowrap flex items-center gap-2">
                    ⚙️ Admin
                  </button>
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-blue-900 transition-colors duration-200 font-medium whitespace-nowrap"
              >
                Logout
              </button>
            </>
          )}

          {/* 🟡 Pending users only see status + logout */}
          {user?.role === "pending" && (
            <>
              <span className="px-4 py-2 text-yellow-300 font-medium whitespace-nowrap">
                ⏳ Pending Approval
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-blue-900 transition-colors duration-200 font-medium whitespace-nowrap"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* 📱 Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-blue-900 border-t border-blue-800 shadow-lg py-4 px-6 space-y-3">
          {/* Public Links */}
          <Link to="/services" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors font-medium">
              Services
            </button>
          </Link>
          <Link to="/bookings" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors font-medium">
              Bootcamp
            </button>
          </Link>
          <Link to="/contact" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors font-medium">
              Contact
            </button>
          </Link>

          {/* Auth Links - Only for approved users */}
          {user && user.role !== "pending" && (
            <>
              <Link to="/dashboard" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-left px-4 py-2 rounded-lg bg-white text-blue-900 font-semibold">
                  Dashboard
                </button>
              </Link>
              
              {user.role === "admin" && (
                <Link to="/admin" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full text-left px-4 py-2 rounded-lg bg-red-600 text-white font-semibold">
                    ⚙️ Admin
                  </button>
                </Link>
              )}
              
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 rounded-lg border-2 border-white font-medium"
              >
                Logout
              </button>
            </>
          )}

          {/* Pending users */}
          {user?.role === "pending" && (
            <>
              <div className="w-full text-left px-4 py-2 text-yellow-300 font-medium">
                ⏳ Pending Approval
              </div>
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 rounded-lg border-2 border-white font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}