import { useState } from "react";

export default function Bookings() {
  const initialFormState = {
    fullName: "",
    email: "",
    phoneNumber: "",
    // chapters will be dynamically generated before submission
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(""); // Tracks selected paper
  const [selectedChapters, setSelectedChapters] = useState([]); // Tracks multiple selected chapters

  // Chapter options mapped to each paper
  const chapterOptions = {
    "Maths Paper 1": ["Algebra", "Series and sequences", "Financial maths", "Functions and graphs", "Probability"],
    "Maths Paper 2": ["Trigonometry", "Euclidean geometry", "Analytical geometry", "Statistics and regression"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle paper selection
  const handlePaperChange = (e) => {
    const paper = e.target.value;
    setSelectedPaper(paper);
    setSelectedChapters([]); // Reset chapter selections when paper changes
  };

  // Handle chapter checkbox changes
  const handleChapterCheckboxChange = (chapter) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter) 
        : [...prev, chapter]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation
    if (!selectedPaper) {
      setMessage({ type: "error", text: "Please select a Maths Paper" });
      setLoading(false);
      return;
    }
    
    if (selectedChapters.length === 0) {
      setMessage({ type: "error", text: "Please select at least one Chapter" });
      setLoading(false);
      return;
    }

    // Prepare payload with combined chapters string
    const payload = {
      ...form,
      chapters: `${selectedPaper} - ${selectedChapters.join(', ')}`
    };

    try {
      const res = await fetch("https://tutoringwebsite-sm0u.onrender.com/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Booking failed" });
        return;
      }

      setMessage({ type: "success", text: "Appointment booked successfully ✅" });
      // Reset all form states
      setForm(initialFormState);
      setSelectedPaper("");
      setSelectedChapters([]);
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
          {/* Standard form fields */}
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phoneNumber", type: "tel" },
          ].map((field) => (
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

          {/* Paper Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Paper
            </label>
            <select
              value={selectedPaper}
              onChange={handlePaperChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
            >
              <option value="">Choose Maths Paper</option>
              <option value="Maths Paper 1">Maths Paper 1</option>
              <option value="Maths Paper 2">Maths Paper 2</option>
            </select>
          </div>

          {/* Chapter Selection Checkboxes (conditionally rendered) */}
          {selectedPaper && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Chapters (choose one or more)
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                {chapterOptions[selectedPaper]?.map((chapter) => (
                  <label 
                    key={chapter} 
                    className="flex items-center py-1.5 hover:bg-gray-100 rounded px-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChapters.includes(chapter)}
                      onChange={() => handleChapterCheckboxChange(chapter)}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">{chapter}</span>
                  </label>
                ))}
              </div>
              {selectedChapters.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {selectedChapters.join(', ')}
                </p>
              )}
            </div>
          )}

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