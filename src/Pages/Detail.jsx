import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DetailAppointment() {
  const [fullName, setFullName] = useState("");
  const [options, setOptions] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Payment update states - KEEP CAPITALIZED as your backend expects them
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const navigate = useNavigate();

  // Fetch appointment names for dropdown
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
        if (res.ok && result.success && Array.isArray(result.data?.appointments)) {
          const names = [...new Set(result.data.appointments.map(a => a.fullName))];
          setOptions(names);
        }
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("Failed to load appointment names. Please try again later.");
      }
    };

    fetchOptions();
  }, []);

  // Initialize payment fields when data loads
  useEffect(() => {
    if (data?.paymentDetails) {
      // Backend returns lowercase, but we need to convert to capitalized for display/editing
      const status = data.paymentDetails.paymentStatus || "unpaid";
      const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
      setPaymentStatus(capitalizedStatus);
      setAmount(data.paymentDetails.amountPaid?.toString() || "");
      setNote(data.paymentDetails.note || "");
    } else {
      setPaymentStatus("Unpaid");
      setAmount("");
      setNote("");
    }
    setUpdateMessage(null);
  }, [data]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setData(null);
    setUpdateMessage(null);

    if (!fullName.trim()) {
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

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch appointment details");
      }

      setData(result.data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    setUpdateMessage(null);

    // Validation
    if (paymentStatus !== "Unpaid" && (!amount || parseFloat(amount) <= 0)) {
      setUpdateMessage({ 
        type: "error", 
        text: "Amount must be greater than zero when status is Paid or Partial" 
      });
      return;
    }

    if (amount && isNaN(amount)) {
      setUpdateMessage({ 
        type: "error", 
        text: "Please enter a valid numeric amount" 
      });
      return;
    }

    try {
      setUpdateLoading(true);
      const token = localStorage.getItem("token");
      
      // Send EXACTLY what your backend validation expects: capitalized values
      const payload = {
        fullName: data.appointment.fullName,
        PaymentStatus: paymentStatus, // "Unpaid", "Partial", or "Paid"
        AmountPaid: amount ? parseFloat(amount) : null, // Send number, not string
        Note: note.trim() || "",
      };

      const res = await fetch("http://localhost:5000/api/updatePayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update payment details");
      }

      // Update local state - convert response back to capitalized for display
      const responseStatus = result.data.paymentStatus;
      const capitalizedResponseStatus = responseStatus.charAt(0).toUpperCase() + responseStatus.slice(1);
      
      setData(prev => ({
        ...prev,
        paymentDetails: {
          paymentStatus: capitalizedResponseStatus,
          amountPaid: result.data.amountPaid,
          note: result.data.note,
          transactionId: result.transactionId || prev.paymentDetails?.transactionId || "N/A",
          invoiceNumber: result.invoiceNumber || prev.paymentDetails?.invoiceNumber || "N/A",
        },
      }));

      setUpdateMessage({ 
        type: "success", 
        text: "Payment details updated successfully!" 
      });
      
      setTimeout(() => {
        setUpdateMessage(null);
      }, 2000);
    } catch (err) {
      setUpdateMessage({ 
        type: "error", 
        text: err.message || "Failed to update payment details. Please try again." 
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBackToDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-16 md:mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Appointment Management</h1>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg shadow transition"
          >
            <span className="mr-2">←</span> Dashboard
          </button>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow rounded-xl p-5 md:p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Appointment</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <select
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a student name</option>
                {options.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !fullName}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search Appointment"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results Section */}
        {data && (
          <div className="space-y-6">
            {/* Appointment Details */}
            <div className="bg-white shadow rounded-xl p-5 md:p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p><span className="font-medium">Student:</span> {data.appointment.fullName}</p>
                <p><span className="font-medium">Email:</span> {data.appointment.email}</p>
                <p><span className="font-medium">Phone:</span> {data.appointment.phoneNumber}</p>
                <p><span className="font-medium">Chapters:</span> {data.appointment.chapters}</p>
                
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white shadow rounded-xl p-5 md:p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Information
                {data.paymentDetails && (
                  <span className={`ml-2 text-xs font-bold px-3 py-1 rounded-full ${
                    data.paymentDetails.paymentStatus === "Paid" 
                      ? "bg-green-100 text-green-800" 
                      : data.paymentDetails.paymentStatus === "Partial"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {data.paymentDetails.paymentStatus}
                  </span>
                )}
              </h2>
              
              {data.paymentDetails ? (
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-medium">Status:</span> {data.paymentDetails.paymentStatus}</p>
                  <p><span className="font-medium">Amount Paid:</span> R{parseFloat(data.paymentDetails.amountPaid || 0).toFixed(2)}</p>
                  <p><span className="font-medium">Transaction ID:</span> {data.paymentDetails.transactionId || "N/A"}</p>
                  <p><span className="font-medium">Invoice #:</span> {data.paymentDetails.invoiceNumber || "N/A"}</p>
                  {data.paymentDetails.note && (
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">{data.paymentDetails.note}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 italic py-2">
                  No payment details recorded yet. Update payment information below.
                </div>
              )}
            </div>

            {/* Update Payment Form */}
            <div className="bg-white shadow rounded-xl p-5 md:p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Payment Details</h2>
              
              {updateMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  updateMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {updateMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdatePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial Payment</option>
                    <option value="Paid">Fully Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Paid (ZAR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={paymentStatus === "Unpaid"}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {paymentStatus === "Unpaid" 
                      ? "Amount disabled while status is Unpaid" 
                      : "Enter amount received from student"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y min-h-[80px]"
                    placeholder="Add payment notes, special arrangements, or reminders..."
                    maxLength="500"
                  />
                  <p className="mt-1 text-xs text-gray-400 text-right">{note.length}/500</p>
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {updateLoading ? "Updating Payment..." : "Update Payment Details"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}