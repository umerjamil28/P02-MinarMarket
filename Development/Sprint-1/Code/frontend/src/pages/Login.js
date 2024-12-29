import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  initializeSession,
  isSessionValid,
} from "../components/SessionManager";
import Footer from "../components/Footer";
import { getUserDetails } from "../components/SessionManager";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if a valid session already exists; if so, redirect the user based on role
    if (isSessionValid()) {
      setMessage("Already logged in. Redirecting...");

      // Retrieve user details to determine the user's role
      const userDetails = getUserDetails();
      if (userDetails) {
        // Redirect based on user role
        setTimeout(() => {
          if (userDetails.isAdmin) {
            window.location.href = "/admin-dashboard";
          } else {
            window.location.href = "/seller-dashboard";
          }
        }, 1000);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL+"/api/authentication/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      

      const data = await response.json();
      console.log("Response: ", data);

      if (response.ok) {
        setMessage("Login successful");

        // Initialize the session with the received token
        initializeSession(data.token);

        const userDetails = getUserDetails();
        if (userDetails) {
          console.log("LOGIN WALA USER:", userDetails);

          if (userDetails.isAdmin == false) {
            // Redirect to home page or dashboard
            setTimeout(() => {
              window.location.href = "/seller-dashboard"; // Adjust the redirect path as needed
            }, 1000);
          }

          if (userDetails.isAdmin == true) {
            // Redirect to home page or dashboard
            setTimeout(() => {
              window.location.href = "/admin-dashboard"; // Adjust the redirect path as needed
            }, 1000);
          }
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Avatar placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-semibold text-center mb-6">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email or mobile phone number
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm text-gray-600">
                  Your password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Log in
            </button>

            <div className="text-xs text-center text-gray-600">
              By continuing, you agree to the{" "}
              <a href="#" className="underline">
                Terms of use
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Forget your password
              </a>
            </div>
          </form>

          {message && <div className="mt-4 text-center text-sm">{message}</div>}
        </div>

        {/* Create account section */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500 mb-4">New to our community</div>
          <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
            <a href="/signup">Create an account</a>
          </button>
        </div>

        <Footer />
      
      </div>
    </div>
  );
};

export default Login;
