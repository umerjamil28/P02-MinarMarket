import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { getUserDetails } from "../components/SessionManager";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const ServiceListingForm = () => {
  const location = useLocation(); // Access the state passed via navigation
  const navigate = useNavigate(); // useNavigate hook for navigation

  const serviceId = location.state?.serviceId || null;
  console.log("serviceId: ",serviceId);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    rate: "",
    city: "",
    pricingModel: "",
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


  // Fetch service details if serviceId exists
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (serviceId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/service-listings/fetch-service-details/${serviceId}`);
          if (response.ok) {
            const serviceData = await response.json();
            console.log("serviceData from the backend: ", serviceData)
            setFormData({
              title: serviceData.service.title,
              description: serviceData.service.description,
              category: serviceData.service.category,
              city: serviceData.service.city,
              rate: serviceData.service.rate,
              pricingModel: serviceData.service.pricingModel,
            });
            setUploadedFiles(serviceData.service.images || []);
            console.log("After updating from the backend, formData: ", formData);
            console.log("After updating from the backend, uploadedFiles: ", uploadedFiles);

          } else {
            console.error("Failed to fetch service details.");
          }
        } catch (error) {
          console.error("Error fetching service details:", error);
        }
      }
    };

    fetchServiceDetails();
  }, [serviceId]);


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

      const endpoint = serviceId
        ? `${process.env.REACT_APP_API_URL}/service-listings/updateService/${serviceId}`
        : `${process.env.REACT_APP_API_URL}/addServiceListing`;

      const method = serviceId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      if (response.ok) {
        setMessage(
          serviceId
            ? "Service has been successfully updated."
            : "Service has been successfully sent to the admin for approval."
        );
        navigate('/seller-dashboard/services');
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server Error" }));
        setMessage(
          `Error adding/updating service: ${errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error(
        "Error uploading images to Cloudinary or adding/updating service:",
        error
      );
      setMessage("An error occurred. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">


      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <h1 className="text-xl font-medium">List Your Service</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Form fields */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Service Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Professional Web Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Service Description (Max. 200 words)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your service in detail..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="pricingModel"
                    value="Per Hour"
                    checked={formData.pricingModel === "Per Hour"}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Per Hour</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    className="form-radio"
                    name="pricingModel"
                    value="Per Day"
                    checked={formData.pricingModel === "Per Day"}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Per Day</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    className="form-radio"
                    name="pricingModel"
                    value="Per Job"
                    checked={formData.pricingModel === "Per Job"}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Per Job</span>
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your city"
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
                  <option value="">Select category</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="marketing">Marketing</option>
                  <option value="writing">Writing</option>
                  <option value="consulting">Consulting</option>
                  <option value="custom">Other (Custom)</option>
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

export default ServiceListingForm;










//   return (
//     <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
//           Service Title
//         </label>
//         <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="e.g. Professional Web Development" />
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//           Service Description (Max. 200 words)
//         </label>
//         <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Describe your service in detail..." rows="4"></textarea>
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Pricing Model
//         </label>
//         <div className="mt-2">
//           <label className="inline-flex items-center">
//             <input type="radio" className="form-radio" name="pricingModel" value="hour" />
//             <span className="ml-2">Per Hour</span>
//           </label>
//           <label className="inline-flex items-center ml-6">
//             <input type="radio" className="form-radio" name="pricingModel" value="day" />
//             <span className="ml-2">Per Day</span>
//           </label>
//           <label className="inline-flex items-center ml-6">
//             <input type="radio" className="form-radio" name="pricingModel" value="job" />
//             <span className="ml-2">Per Job</span>
//           </label>
//         </div>
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
//           Price (PKR)
//         </label>
//         <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="price" type="number" placeholder="0.00" />
//       </div>

// <div className="mb-4">
//   <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
//     City
//   </label>
//   <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="Enter your city" />
// </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
//           Category
//         </label>
//         <select
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           id="category"
//           onChange={handleCategoryChange}
//           value={category}
//         >
// <option value="">Select category</option>
// <option value="design">Design</option>
// <option value="development">Development</option>
// <option value="marketing">Marketing</option>
// <option value="writing">Writing</option>
// <option value="consulting">Consulting</option>
// <option value="custom">Other (Custom)</option>
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Upload Images
//         </label>
//         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//           <div className="space-y-1 text-center">
//             <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
//               <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//             <div className="flex text-sm text-gray-600">
//               <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
//                 <span>Upload a file</span>
//                 <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageUpload} />
//               </label>
//               <p className="pl-1">or drag and drop</p>
//             </div>
//             <p className="text-xs text-gray-500">
//               PNG, JPG, GIF up to 10MB
//             </p>
//           </div>
//         </div>
//         {images.length > 0 && (
//           <div className="mt-2">
//             <p className="text-sm text-gray-500">{images.length} file(s) selected</p>
//             <ul className="mt-1 text-sm text-gray-500">
//               {images.map((image, index) => (
//                 <li key={index}>{image.name}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       <div className="flex items-center justify-between">
//         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
//           Submit for Approval
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ServiceListingForm;

