// PendingApproval.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function PendingApproval() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 text-center">
        {/* ⏳ Waiting Icon */}
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-yellow-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Account Pending Approval
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thanks for registering, <strong>{email}</strong>! 
          Your account is being reviewed by our admin team.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-blue-800">
            🔹 You'll receive an email once approved<br/>
            🔹 Approval usually takes 24-48 hours<br/>
            🔹 Check your spam folder just in case
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition"
          >
            Go to Login
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            Return Home
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Questions? Contact support@example.com
        </p>
      </div>
    </div>
  );
}