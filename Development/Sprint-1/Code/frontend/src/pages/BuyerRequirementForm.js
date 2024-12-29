import React, { useState, useEffect } from "react";
import { getUserDetails } from "../components/SessionManager";
import { useNavigate } from "react-router-dom";

const BuyerRequirementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
    // userId: "",
  });

  const [userDetails, setUserDetails] = useState(null);
  const [message, setMessage] = useState(""); // State for success/error message
  const [messageType, setMessageType] = useState(""); // State for message type (success or error)

  useEffect(() => {
    const tempuserDetails = getUserDetails();
    if (tempuserDetails) {
      console.log(tempuserDetails);
      setUserDetails(tempuserDetails);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages

    try {

      const finalFormData = {
        ...formData,
        // images: uploadedUrls,
        userId: userDetails.userId
      };

      const response = await fetch(
        process.env.REACT_APP_API_URL+"/buyer-requirement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalFormData),
        }
      );

      if (response.ok) {
        setMessage(
          "Product has been successfully sent to the admin for approval."
        );
        // navigate('/buyer-dashboard');
        setTimeout(() => {
          navigate('/buyer-dashboard');
        }, 2000);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server Error" }));
        setMessage(
          `Error adding product listing: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error(
        "Error uploading images to Cloudinary or adding product:",
        error
      );
      setMessage("An error occurred. Please try again.");
    }

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <nav className="flex space-x-4">
              <a href="/seller-dashboard" className="font-medium text-gray-900">Home</a>
              <a href="#" className="text-gray-500">Profile</a>
            </nav>
          </div>
          <button className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <h1 className="text-xl font-medium">List Your Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Budget (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4 mt-12">
              <button
                type="submit"
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Submit for Approval
              </button>

              {message && (
                <p className={`text-sm text-center ${message === "Product has been successfully sent to the admin for approval." ? "text-green-500" : "text-red-500"}`}>
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
    
  );
};

export default BuyerRequirementForm;
