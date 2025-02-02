
"use client";

import { useEffect, useState } from "react";
import { getUserDetails } from "@/lib/SessionManager";

async function checkIfMessageExists(userId, productId) {
  if (!userId) return false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/buyer-messages/check?id_of_buyer=${userId}&id_of_product=${productId}`
    );

    const result = await response.json();
    return result.exists; // Returns true if message exists, false otherwise
  } catch (error) {
    console.error("Error checking message:", error);
    return false;
  }
}

async function sendBuyerMessage(userId, productId, setMessageExists) {
  if (!userId) {
    alert("Please log in to contact the seller.");
    return;
  }

  const payload = {
    id_of_buyer: userId,
    id_of_product: productId,
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buyer-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Message sent to the seller successfully!");
      setMessageExists(true); // Update state to show the message instead of button
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to contact the seller. Please try again.");
  }
}

export default function ContactSellerButton({ productId }) {
  const [messageExists, setMessageExists] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // Add a loading state
  const user = getUserDetails();

  useEffect(() => {
    if (user?.userId) {
      checkIfMessageExists(user.userId, productId).then((exists) => {
        setMessageExists(exists);
        setIsChecking(false); // Mark check as complete
      });
    } else {
      setIsChecking(false); // No user logged in, stop checking
    }
  }, [user, productId]);

  if (isChecking) {
    return null; // Prevent the flicker issue by showing nothing while loading
  }

  return messageExists ? (
    <p className="text-green-600 font-semibold">The query has been sent to the seller.</p>
  ) : (
    <button
      onClick={() => sendBuyerMessage(user?.userId, productId, setMessageExists)}
      className="w-full bg-black text-white py-3 rounded-md hover:bg-black/90 transition-colors"
    >
      Contact the Seller
    </button>
  );
}
