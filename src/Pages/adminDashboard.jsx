// AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // 🔐 Check if user is admin on mount
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      fetchData();
    };

    checkAdmin();
  }, [navigate]);

  // 📥 Fetch pending users
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const usersRes = await fetch(
        "https://tutoringwebsite-xjj4.onrender.com/api/users/pending",
        { headers }
      );
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setPendingUsers(usersData.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve a pending user
  const handleApprove = async (userId, username) => {
    if (!window.confirm(`Approve "${username}"? They will gain dashboard access.`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://tutoringwebsite-xjj4.onrender.com/api/users/${userId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Approval failed");

      setSuccess(`✅ ${username} approved successfully!`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 4000);
    }
  };

  // ❌ Revoke a user's access
  const handleRevoke = async (userId, username) => {
    if (!window.confirm(`Revoke access for "${username}"? They will return to pending status.`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://tutoringwebsite-xjj4.onrender.com/api/users/${userId}/revoke`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Revocation failed");

      setSuccess(` ${username}'s access revoked.`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 4000);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🎨 Format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-8 pt-12 md:pt-25">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage user access</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500 mb-6 w-fit">
          <p className="text-sm text-gray-500">Awaiting Approval</p>
          <p className="text-3xl font-bold text-gray-900">{pendingUsers.length}</p>
        </div>

        {/* Alerts */}
        {(error || success) && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm font-medium ${
              success
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {success || error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">
              👥 Pending Users ({pendingUsers.length})
            </h2>
          </div>

          <div className="p-6">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
                <p className="text-gray-500">No pending users waiting for approval.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-sm font-medium text-gray-500">Username</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Email</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Registered</th>
                      <th className="pb-3 text-sm font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{user.username}</td>
                        <td className="py-3 text-gray-600">{user.email}</td>
                        <td className="py-3 text-gray-500 text-sm">{formatDate(user.createdAt)}</td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => handleApprove(user._id, user.username)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleRevoke(user._id, user.username)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                          >
                            🔒 Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          💡 <strong>Tip:</strong> Click "Approve" to grant a user dashboard access. They'll be able to log in and book appointments immediately.
        </div>
      </div>
    </div>
  );
}