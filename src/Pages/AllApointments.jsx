import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fixed: Added chaptersPart to return value for fallback display
  const parseChapters = (chaptersStr) => {
    if (!chaptersStr) return { paper: "", chapters: [], chaptersPart: "" };
    const parts = chaptersStr.split(" - ");
    const paper = parts[0]?.trim() || "";
    const chaptersPart = parts[1]?.trim() || "";
    const chaptersArr = chaptersPart
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    return { paper, chapters: chaptersArr, chaptersPart };
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAppointments = async () => {
      try {
        // ✅ Fixed: Removed trailing spaces from URL
        const res = await fetch(
          "https://tutoringwebsite-hzbg.onrender.com/api/Allappointments",
          { signal: abortController.signal }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch");

        console.log("fetched appointments:", data.data.appointments.map(a => a.chapters));
        setAppointments(data.data.appointments);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError("Failed to load appointments. Please try again.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
    return () => abortController.abort(); // ✅ Cleanup on unmount
  }, []);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) return <p className="text-center mt-16 text-gray-600">Loading appointments...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center flex-1 text-gray-900">All Appointments</h1>
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg shadow transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* ✅ Inline error display instead of alert() */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-2 underline font-medium hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found</p>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt) => {
              const { paper, chapters, chaptersPart } = parseChapters(apt.chapters);

              return (
                <div
                  // ✅ Fixed: Use apt.id (string) since backend sends it
                  key={apt.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition"
                >
                  <p className="text-gray-900"><strong>Name:</strong> {apt.fullName}</p>
                  <p className="text-gray-900"><strong>Email:</strong> {apt.email}</p>
                  <p className="text-gray-900"><strong>Phone:</strong> {apt.phoneNumber}</p>

                  {/* ✅ Always-visible chapters section with improved styling */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      <span className="text-blue-900">📚 Chapters:</span>
                    </p>

                    {apt.chapters ? (
                      <div className="pl-4 border-l-2 border-blue-300 bg-blue-50/40 rounded-r-lg p-3">
                        {paper && (
                          <p className="text-sm text-gray-800 mb-1">
                            <span className="font-medium text-blue-900">Paper:</span> {paper}
                          </p>
                        )}

                        {chapters.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-gray-800 space-y-0.5">
                            {chapters.map((ch, idx) => (
                              <li key={idx}>{ch}</li>
                            ))}
                          </ul>
                        ) : chaptersPart ? (
                          // Fallback: show raw chaptersPart if no commas found
                          <p className="text-sm text-gray-800">{chaptersPart}</p>
                        ) : (
                          <p className="text-sm text-gray-600 italic">No chapters listed</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Not specified</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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