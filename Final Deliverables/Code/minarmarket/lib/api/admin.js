export async function getAllProductListings() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin-product-listings`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product listings");
  }
  return response.json();
}

export async function getAllServiceListings () {
  const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/admin/admin-service-listings`);

  if(!response.ok) {
    throw new Error("Failed to fetch service listings");
  }

  return response.json();
}


export async function getAllProductsRequirementListings() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/admin-products-requirement-listings`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product requirement listings");
  }
  return response.json();
}

export async function getAllServicesRequirementListings() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/admin-services-requirement-listings`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch services requirement listings");
  }
  return response.json();
}


export async function updateProductListingsStatus(itemIds, newStatus) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin-product-listings/update-listings-status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemIds, newStatus }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update product listings");
  }
  return response.json();
}

export async function updateServiceListingsStatus(itemIds, newStatus) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/update-service-listing-status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemIds, newStatus }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update service listings");
  }
  return response.json();
}



export async function updateProductsRequirementListingsStatus(itemIds, newStatus) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/update-products-requirement-listings-status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemIds, newStatus }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update products requirement listings");
  }
  return response.json();
}


export async function updateServicesRequirementListingsStatus(itemIds, newStatus) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/update-services-requirement-listings-status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemIds, newStatus }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update services requirement listings");
  }
  return response.json();
}



export async function getAllComplaints() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/report/view-complaints`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  const data = await response.json(); // Await the JSON response

  return data;
}

export async function getIndividualComplaint(id) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/complaint/${id}`);
  console.log("After response;");
  if (!response.ok) {
    throw new Error("Failed to fetch details of the complaint.");
  }

  return response.json();
}


export async function updateComplaintStatus(complaintId, status, adminNotes, action) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/resolve-complaint/${complaintId}`, {
      method: "POST", // Updated to POST as per backend route
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, adminNotes, action }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update complaint status.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
