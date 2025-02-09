
// "use client";

// import { SidebarNav } from '@/components/sidebar-nav';
// import { useState, useEffect } from "react";
// import { Header } from '@/components/header';
// import { getUserDetails } from "@/lib/SessionManager"; 

// export default function MessageChat() {
//     const [messages, setMessages] = useState([]);
//     const [sellerId, setSellerId] = useState(null);

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const user = await getUserDetails(); 
//                 if (!user || !user.userId) return;
                
//                 setSellerId(user.id);
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message-from-buyers/${user.userId}`);
//                 if (!response.ok) throw new Error("Failed to fetch messages");

//                 const data = await response.json();
//                 setMessages(data.messages);
//             } catch (error) {
//                 console.error("Error fetching messages:", error);
//             }
//         };

//         fetchMessages();
//     }, []);

//     return (
//         <div className="flex min-h-screen flex-col px-4">
           
//             <Header />

//             <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
                
//                 <SidebarNav />

               
//                 <main>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                         {messages.map((msg) => (
//                             <div key={msg.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
//                                 <h2 className="text-lg font-semibold">{msg.product}</h2>
//                                 <p className="text-gray-700">{msg.name}</p>
//                                 <p className="text-gray-500 text-sm">{msg.email}</p>
//                                 <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
//                                     Contact Buyer
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// }


"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { getUserDetails } from "@/lib/SessionManager";

export default function MessageChat() {
    const [messages, setMessages] = useState([]);
    const [sellerId, setSellerId] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const user = await getUserDetails();
                if (!user || !user.userId) return;

                setSellerId(user.id);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message-from-buyers/${user.userId}`);
                if (!response.ok) throw new Error("Failed to fetch messages");

                const data = await response.json();
                setMessages(data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, []);

    // Function to handle status update
    const handleStatusUpdate = async (msgId, newStatus) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-message-status/${msgId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update message status");

            // Update UI after successful status change
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === msgId ? { ...msg, status: newStatus } : msg
                )
            );
        } catch (error) {
            console.error("Error updating message status:", error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col px-4">
            <Header />

            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
                <SidebarNav />

                <main>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
                                {msg.status === "Pending" ? (
                                    <>
                                        <h2 className="text-lg font-semibold">You have a buyer who wants to connect!</h2>
                                        <button
                                            onClick={() => handleStatusUpdate(msg.id, "Yes")}
                                            className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(msg.id, "No")}
                                            className="mt-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                                        >
                                            No
                                        </button>
                                    </>
                                ) : msg.status === "Yes" ? (
                                    <>
                                        <h2 className="text-lg font-semibold">{msg.product}</h2>
                                        <p className="text-gray-700">{msg.name}</p>
                                        <p className="text-gray-500 text-sm">{msg.email}</p>
                                        <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                            Contact Buyer
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-red-600 font-semibold">You rejected the ask</p>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
