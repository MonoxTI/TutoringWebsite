import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/Allappointments");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setAppointments(data.data.appointments);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) return <p className="text-center mt-16">Loading appointments...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center flex-1">All Appointments</h1>
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg shadow transition"
          >
            ← Dashboard
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found</p>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition"
              >
                <p><strong>Name:</strong> {apt.fullName}</p>
                <p><strong>Email:</strong> {apt.email}</p>
                <p><strong>Package:</strong> {apt.packageName}</p>
                <p><strong>Date:</strong> {apt.date}</p>
                <p><strong>Tutor:</strong> {apt.tutor}</p>

                
              </div>
            ))}
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 px-6 rounded-lg shadow transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}