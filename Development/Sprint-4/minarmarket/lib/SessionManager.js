import { jwtDecode } from "jwt-decode";

// Decode the JWT to get the payload data
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])); // Decode the payload of JWT
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// Function to check if localStorage is available
const isLocalStorageAvailable = () => typeof window !== "undefined" && window.localStorage;

// Function to check if the session is still valid
export const isSessionValid = () => {
  if (!isLocalStorageAvailable()) return false; // Ensure it's running on the client

  const token = localStorage.getItem("token");
  if (!token) return false;

  const decoded = decodeToken(token);

  // Check if the token has expired
  if (!decoded || decoded.exp * 1000 < Date.now()) {
    clearSession(); // Clear expired session
    return false;
  }
  return true;
};

// Function to initialize session management after login
export const initializeSession = (token) => {
  if (!isLocalStorageAvailable()) return; // Ensure it's running on the client

  // Store the token in localStorage
  localStorage.setItem("token", token);

  // Set a timeout to automatically clear the session when the token expires
  const decoded = decodeToken(token);
  if (decoded) {
    const expirationTime = decoded.exp * 1000 - Date.now(); // Time in ms
    setTimeout(() => {
      // Log out user after token expiration
      clearSession();
      alert("Session expired. Please log in again.");
      window.location.reload(); // Optional: redirect to login page
    }, expirationTime);
  }
};

// Function to clear the session (for logout or token expiration)
export const clearSession = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem("token");
};

// Function to get user details from the token
export const getUserDetails = () => {
  if (!isLocalStorageAvailable()) return null;

  const token = localStorage.getItem("token");

  if (!!!token ) return null;

  const decoded = jwtDecode(token);
  return {
    userName: decoded.name,
    userEmail: decoded.email,
    userId: decoded.id,
    isAdmin: decoded.admin,
  };
};
