import { getUserDetails } from "@/lib/SessionManager";

export async function getAllBuyerServiceRequirements() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/buyer-service-requirement/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response not OK:", response.status, errorText);
      throw new Error("Failed to fetch buyer service requirements");
    }
    
    return response.json();
  } catch (error) {
    console.error("Request error details:", error);
    throw error;
  }
}

export async function getMyServiceRequirements() {
  const user = getUserDetails();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/buyer-service-requirement?userId=${user?.userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch my service requirements");
  return response.json();
}