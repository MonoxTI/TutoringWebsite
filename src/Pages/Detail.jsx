import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DetailAppointment() {
  const [fullName, setFullName] = useState("");
  const [options, setOptions] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch all appointment names for dropdown
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/Allappointments", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        if (res.ok && result.data && result.data.appointments) {
          // extract unique fullNames
          const names = [...new Set(result.data.appointments.map(a => a.fullName))];
          setOptions(names);
        } else {
          console.error("Failed to fetch appointment options");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOptions();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setData(null);

    if (!fullName) {
      setError("Please select a name from the dropdown");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/getAppointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ fullName }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch appointment");

      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search Appointment</h1>

        <button
          type="button"
          onClick={handleBackToDashboard}
          className="mb-4 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg shadow transition"
        >
          ← Dashboard
        </button>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white shadow rounded-lg p-6 mb-6"
        >
          <select
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a name</option>
            {options.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
        )}

        {/* Result */}
        {data && (
          <>
            {/* Appointment Details */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
              <p><strong>Name:</strong> {data.appointment.fullName}</p>
              <p><strong>Email:</strong> {data.appointment.email}</p>
              <p><strong>Phone:</strong> {data.appointment.phoneNumber}</p>
              <p><strong>Package:</strong> {data.appointment.packageName}</p>
              <p><strong>Date:</strong> {data.appointment.date}</p>
              <p><strong>Tutor:</strong> {data.appointment.tutor}</p>
            </div>

            {/* Payment Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              {data.paymentDetails ? (
                <>
                  <p><strong>Status:</strong> {data.paymentDetails.paymentStatus}</p>
                  <p><strong>Amount Paid:</strong> R{data.paymentDetails.amountPaid}</p>
                  <p><strong>Transaction ID:</strong> {data.paymentDetails.transactionId}</p>
                  <p><strong>Invoice:</strong> {data.paymentDetails.invoiceNumber}</p>
                  {data.paymentDetails.note && (
                    <p><strong>Note:</strong> {data.paymentDetails.note}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No payment details available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
