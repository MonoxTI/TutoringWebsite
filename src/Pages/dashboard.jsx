// Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch total appointment count on mount
  useEffect(() => {
    const fetchAppointmentsCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/Allappointments", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await res.json();
        setAppointmentCount(data.data.count || 0);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsCount();
  }, [navigate]);

  const handleViewAll = () => {
    navigate("/appointments");
  };

  const handleViewDetails = () => {
    navigate("/detail");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Here's your overview.</p>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Total Appointments</h2>
              <p className="text-gray-600">All scheduled sessions</p>
            </div>
            <div className="bg-blue-100 text-blue-800 text-4xl font-bold w-24 h-24 rounded-full flex items-center justify-center">
              {loading ? "..." : appointmentCount}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleViewAll}
            className="bg-white hover:bg-blue-50 border border-blue-200 rounded-xl shadow-md p-6 text-left transition-all hover:shadow-lg"
          >
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">View All Appointments</h3>
            </div>
            <p className="text-gray-600">See complete list of scheduled sessions</p>
          </button>

          <button
            onClick={handleViewDetails}
            className="bg-white hover:bg-blue-50 border border-blue-200 rounded-xl shadow-md p-6 text-left transition-all hover:shadow-lg"
          >
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">View Detailed Appointments</h3>
            </div>
            <p className="text-gray-600">See complete list of scheduled sessions</p>
          </button>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}