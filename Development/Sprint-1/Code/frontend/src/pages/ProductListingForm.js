import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { getUserDetails } from "../components/SessionManager";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const ProductListingForm = () => {
  const location = useLocation(); // Access the state passed via navigation
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Extract product ID from state (if exists)
  const productId = location.state?.productId || null;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Call getUserDetails to log and store user details
    const tempuserDetails = getUserDetails();
    if (tempuserDetails) {
      console.log(tempuserDetails);
      setUserDetails(tempuserDetails);
    }
  }, []);

  // Fetch product details if productId exists
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/product-listings/fetch-product-details/${productId}`);
          if (response.ok) {
            const productData = await response.json();
            console.log("productData from the backend: ",productData)
            setFormData({
              title: productData.product.title,
              description: productData.product.description,
              price: productData.product.price,
              category: productData.product.category,
            });
            setUploadedFiles(productData.product.images || []);
            console.log("After updating from the backend, formData: ", formData);
            console.log("After updating from the backend, uploadedFiles: ", uploadedFiles);
            
          } else {
            console.error("Failed to fetch product details.");
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedFiles.length + files.length > 6) {
      alert("You can only upload a maximum of 6 photos.");
      return;
    }

    setUploading(true);
    const newFiles = files.map((file) => ({
      file,
      name: file.name,
      status: "pending",
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setUploading(false);
  };

  const removeFile = (fileName) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xxy7dsyf");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dm56xy1oj/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    try {
      const uploadedUrls = await Promise.all(
        uploadedFiles.map((fileObj) =>
          uploadToCloudinary(fileObj.file).then((url) => ({
            name: fileObj.name,
            url,
          }))
        )
      );

      setUploading(false);

      const finalFormData = {
        ...formData,
        images: uploadedUrls,
        userId: userDetails.userId,
      };

      console.log("Form Data to send to backend:", finalFormData);

      const endpoint = productId
        ? `${process.env.REACT_APP_API_URL}/product-listings/updateProduct/${productId}`
        : `${process.env.REACT_APP_API_URL}/addProductListing`;

      const method = productId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      if (response.ok) {
        setMessage(
          productId
            ? "Product has been successfully updated."
            : "Product has been successfully sent to the admin for approval."
        );
        navigate('/seller-dashboard');
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server Error" }));
        setMessage(
          `Error adding/updating product: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error(
        "Error uploading images to Cloudinary or adding/updating product:",
        error
      );
      setMessage("An error occurred. Please try again.");
      setUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <nav className="flex space-x-4">
              <a href="/seller-dashboard" className="font-medium text-gray-900">
                Home
              </a>
              <a href="#" className="text-gray-500">
                Profile
              </a>
            </nav>
          </div>
          <button className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <h1 className="text-xl font-medium">List Your Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Form fields */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Drag & drop files or{" "}
                    <span className="text-blue-500">Browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 6 files. JPG, PNG
                  </p>
                </label>
              </div>

              <div className="mt-4 space-y-2">
                {uploading && (
                  <div className="text-sm text-gray-600">Uploading...</div>
                )}
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border rounded-md p-2"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
              {/* Display success or error message */}
              {message && <p>{message}</p>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProductListingForm;
