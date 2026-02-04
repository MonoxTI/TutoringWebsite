import { useState } from "react";

export default function Bookings() {
  const initialFormState = {
    fullName: "",
    email: "",
    phoneNumber: "",
    packageName: "",
    date: "",
    tutor: ""
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Booking failed" });
        return;
      }

      setMessage({ type: "success", text: "Appointment booked successfully ✅" });
      setForm(initialFormState);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Server error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 pt-12 pb-8">
      <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Book an Appointment
        </h1>

        {message && (
          <div
            className={`mb-4 text-sm text-center px-4 py-2 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phoneNumber", type: "tel" },
            { label: "Package", name: "packageName", type: "text" },
            { label: "Date", name: "date", type: "date" },
            { label: "Tutor", name: "tutor", type: "text" }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-800"
            }`}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
