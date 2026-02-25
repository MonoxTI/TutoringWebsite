// Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchAppointmentsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("https://tutoringwebsite-sm0u.onrender.com/Allappointments", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data = await res.json();
      setAppointmentCount(data.data.count || 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsCount();
  }, [navigate]);

 const handleDeleteAll = async () => {
  const confirmed = window.confirm("Are you sure you want to delete ALL appointments? This cannot be undone.");
  if (!confirmed) return;

  const userInput = window.prompt('Please type "Delete-all-appointments" to confirm deletion:');
  if (userInput !== "Delete-all-appointments") {
    alert("Incorrect confirmation text. Deletion cancelled.");
    return;
  }

  setDeleting(true);
  setError("");
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://tutoringwebsite-sm0u.onrender.com/deleteAppointments", {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Failed to delete appointments");

    setAppointmentCount(0);
  } catch (err) {
    console.error("Delete error:", err);
    setError("Failed to delete appointments. Please try again.");
  } finally {
    setDeleting(false);
  }
};

  const handleViewAll = () => navigate("/appointments");
  const handleViewDetails = () => navigate("/detail");

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

          {/* Delete All Button */}
          <button
            onClick={handleDeleteAll}
            disabled={deleting || appointmentCount === 0}
            className="bg-white hover:bg-red-50 border border-red-200 rounded-xl shadow-md p-6 text-left transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-700">
                {deleting ? "Deleting..." : "Delete All Appointments"}
              </h3>
            </div>
            <p className="text-gray-600">Permanently remove all scheduled sessions</p>
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