import { Link } from "react-router-dom";
import { useState } from "react";
import LOGO from "../Assets/LOGO.png";

export default function Navbar() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-3 px-6 shadow-md border-b-2 border-white">
      {/* Removed max-w-6xl mx-auto to allow full-left alignment */}
      <div className="flex items-center justify-between gap-4">
        {/* Logo + Name - LEFT (more left, bolder text) */}
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

        {/* Navigation Links - RIGHT */}
        <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4 relative">
          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <button
              className="px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors duration-200 font-medium whitespace-nowrap"
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              aria-haspopup="true"
              aria-expanded={isAboutOpen}
            >
              About
            </button>

            {/* Dropdown Menu */}
            {isAboutOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-blue-800 rounded-lg shadow-lg z-10 py-2">
                <Link
                  to="/about"
                  className="block px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setIsAboutOpen(false)}
                >
                  Founder
                </Link>
                <Link
                  to="/mission"
                  className="block px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setIsAboutOpen(false)}
                >
                  Mission
                </Link>
              </div>
            )}
          </div>

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
          <Link to="/alumni">
            <button className="px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors duration-200 font-medium whitespace-nowrap">
              Career
            </button>
          </Link>
          <Link to="/contact">
            <button className="px-4 py-2 rounded-lg hover:bg-blue-800/70 transition-colors duration-200 font-medium whitespace-nowrap">
              Contact
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}