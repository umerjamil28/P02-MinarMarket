import React, { useState, useEffect } from "react";
import BuyerSidebar from "../components/BuyerSidebar";
import Footer from "../components/Footer";
import ConfirmModal from "../pages/ConfirmModal"; // Import the ConfirmModal component
import { jwtDecode } from "jwt-decode";

const BuyerMyListings = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for update modal
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [updateFeedback, setUpdateFeedback] = useState("");
  const [updatedProduct, setUpdatedProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    const fetchMyProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const decodedData = jwtDecode(token); // Decode the token to extract the id
        const buyerId = decodedData.id; // Extract buyer ID from token

        const res = await fetch(`${process.env.REACT_APP_API_URL}/buyer-listings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Set content type
            "buyerId": buyerId, // Custom header
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setMyProducts(data.data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching my products:", error);
      }
    };

    fetchMyProducts();
  }, []);

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId); // Store the product ID
    setIsModalOpen(true); // Open the modal
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false); // Close the modal
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
  
    try {
      const decodedData = jwtDecode(token); // Decode the token to extract the buyer ID
      const buyerId = decodedData.id; // Extract buyer ID from token

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/buyer-listings/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerId: buyerId, // Include buyer ID in the request body
            productId: selectedProductId, // Include product ID in the request body
          }),
        }
      );
  
      if (response.ok) {
        alert("Listing deleted successfully.");
        setMyProducts((prevProducts) =>
          prevProducts.filter((p) => p._id !== selectedProductId)
        );
      } else {
        console.error("Failed to delete listing:", response.status);
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleUpdateClick = (product) => {
    setUpdateFeedback("");
    setSelectedProductId(product._id);
    setUpdatedProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
    });
    setIsUpdateModalOpen(true); // Open the update modal
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmitUpdate = async () => {
    // Check if there are any changes made
    setUpdateFeedback("");
    const originalProduct = myProducts.find((p) => p._id === selectedProductId);
  
    if (
      originalProduct.title === updatedProduct.title &&
      originalProduct.description === updatedProduct.description &&
      originalProduct.price === updatedProduct.price &&
      originalProduct.category === updatedProduct.category
    ) {
      setUpdateFeedback("No changes were made. Please modify the fields before submitting.");
      return; // Exit early if no changes
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
  
    try {
      const decodedData = jwtDecode(token); // Decode the token to extract the buyer ID
      const buyerId = decodedData.id; // Extract buyer ID from token
  
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/buyer-listings/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerId: buyerId, // Include buyer ID in the request body
            productId: selectedProductId, // Include product ID in the request body
            updatedData: { ...updatedProduct, status: "Pending" }, // Change status to Pending
          }),
        }
      );
  
      if (response.ok) {
        setUpdateFeedback("Listing updated successfully. Awaiting approval.");
        setTimeout(() => {
          setIsUpdateModalOpen(false);
        }, 3000);
        setMyProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === selectedProductId ? { ...p, ...updatedProduct, status: "Pending" } : p
          )
        );
      } else {
        setUpdateFeedback(`Failed to update listing: ${response.status}`);
      }
    } catch (error) {
      setUpdateFeedback(`Error updating listing: ${error.message}`);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow w-full">
        <div className="text-xl font-bold">Minar Market</div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-blue-500">
            About
          </a>
          <div>
            <select className="border border-gray-300 p-2 rounded">
              <option>All</option>
              <option>Products</option>
              <option>Services</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 p-2 rounded w-64"
          />
          <a href="#" className="hover:text-blue-500">
            ❤
          </a>
          <a href="#" className="hover:text-blue-500">
            🛒
          </a>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            List Requirement
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded">Log out</button>
        </div>
      </nav>

      <div className="flex flex-1">
        <BuyerSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-6">
            {myProducts.length > 0 ? (
              myProducts.map((product) => (
                <div key={product._id} className="bg-gray-100 p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                  <p className="text-gray-700 mb-2">{product.description}</p>
                  <p className="text-lg font-semibold mb-4">${product.price}</p>
                  <p
                    className={`text-lg font-semibold mb-4 ${
                      product.status === "Rejected"
                        ? "text-red-500"
                        : product.status === "Approved"
                        ? "text-green-500"
                        : "text-orange-500"
                    }`}
                  >
                    {product.status}
                  </p>

                  <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
                  <div className="space-x-4">
                    <button
                      onClick={() => handleUpdateClick(product)} // Trigger update modal
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)} // Trigger delete modal
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No listings found.</p>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal without action
        onConfirm={handleConfirmDelete} // Confirm delete action
        message="Are you sure you want to delete this listing?"
      />

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Update Listing</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={updatedProduct.title}
                onChange={handleUpdateChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={updatedProduct.description}
                onChange={handleUpdateChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleUpdateChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={updatedProduct.category}
                onChange={handleUpdateChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
                <option>Other</option>
              </select>
            </div>
            {updateFeedback && (
              <div className="mb-4 text-sm text-red-500">
                {updateFeedback}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsUpdateModalOpen(false)} // Close the modal
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate} // Submit updated data
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BuyerMyListings;
