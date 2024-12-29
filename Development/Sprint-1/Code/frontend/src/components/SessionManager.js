// sessionManager.js
import { jwtDecode } from 'jwt-decode';
// Decode the JWT to get the payload data
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])); // Decode the payload of JWT
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
// Function to check if the session is still valid
export const isSessionValid = () => {
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
  localStorage.removeItem("token");
};

// Function to get user details from the token
export const getUserDetails = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (token) {
    const decoded = jwtDecode(token);
    // console.log("User Info:", decoded); // { id, name, email, ... }

    const userName = decoded.name;
    const userEmail = decoded.email;
    const userId = decoded.id;
    const isAdmin = decoded.admin;
    // console.log("Name:", userName);
    // console.log("Email:", userEmail);
    return {userName, userEmail, userId, isAdmin};
  }
  return null;
};

// // sessionManager.js

// // Decode the JWT to get the payload data
// const decodeToken = (token) => {
//     try {
//         return JSON.parse(atob(token.split('.')[1])); // Decode the payload of JWT
//     } catch (error) {
//         console.error("Invalid token", error);
//         return null;
//     }
// };

// // Function to check if the session is still valid
// export const isSessionValid = () => {
//     const token = sessionStorage.getItem('token'); // Change to sessionStorage
//     if (!token) return false;

//     const decoded = decodeToken(token);
//     // Check if the token has expired
//     return decoded && decoded.exp * 1000 > Date.now();
// };

// // Function to initialize session management after login
// export const initializeSession = (token) => {
//     // Store the token in sessionStorage instead of localStorage
//     sessionStorage.setItem('token', token);  // Change to sessionStorage

//     // Set a timeout to automatically clear the session when the token expires
//     const decoded = decodeToken(token);
//     if (decoded) {
//         const expirationTime = decoded.exp * 1000 - Date.now(); // Time in ms
//         setTimeout(() => {
//             // Log out user after token expiration
//             clearSession();
//             alert("Session expired. Please log in again.");
//             window.location.reload(); // Optional: redirect to login page
//         }, expirationTime);
//     }
// };

// // Function to clear the session (for logout or token expiration)
// export const clearSession = () => {
//     sessionStorage.removeItem('token');  // Change to sessionStorage
// };

// // Function to get user details from the token
// export const getUserDetails = () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) return null;
//     const decoded = decodeToken(token);
//     return decoded ? { name: decoded.name, email: decoded.email } : null;
// };
