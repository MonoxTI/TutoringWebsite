// Contact.jsx
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Contact Us
        </h1>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Email:</span> assembledtutoring@gmail.com
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Phone:</span> 084 727 7408
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Location:</span> Pretoria, Gauteng
            </p>
          </div>
        </div>

        {/* Admin Login Button */}
        <div className="mt-12">
          <Link
            to="/login"
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}