// "use client";

// import { SidebarNav } from "@/components/sidebar-nav";
// import { useState, useEffect } from "react";
// import { Header } from "@/components/header";
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

//     // Function to handle status update
//     const handleStatusUpdate = async (msgId, newStatus) => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-message-status/${msgId}`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ status: newStatus }),
//             });

//             if (!response.ok) throw new Error("Failed to update message status");

//             // Update UI after successful status change
//             setMessages((prevMessages) =>
//                 prevMessages.map((msg) =>
//                     msg.id === msgId ? { ...msg, status: newStatus } : msg
//                 )
//             );
//         } catch (error) {
//             console.error("Error updating message status:", error);
//         }
//     };

//     return (
//         <div className="flex min-h-screen flex-col px-4">
//             <Header />

//             <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
//                 <SidebarNav />

//                 <main>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                         {messages.map((msg) => (
//                             <div key={msg.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
//                                 {msg.status === "Pending" ? (
//                                     <>
//                                         {/* <h2 className="text-md">You have a buyer who wants to connect for your lisited product, <h2 className="font-semibold text-lg"> {msg.product}!</h2> </h2> */}
//                                         {/* <h2 className="text-md">You have a buyer who wants to connect for your listing, <h2 className="font-semibold text-lg">{msg.listing}!</h2></h2> */}
//                                         <h3 className="text-md">
//                                             You have a buyer who wants to connect for your listing, 
//                                             <span className="font-semibold text-lg">{msg.title}!</span>
//                                         </h3>


//                                         <button
//                                             onClick={() => handleStatusUpdate(msg.id, "Yes")}
//                                             className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
//                                         >
//                                             Yes
//                                         </button>
//                                         <button
//                                             onClick={() => handleStatusUpdate(msg.id, "No")}
//                                             className="mt-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
//                                         >
//                                             No
//                                         </button>
//                                     </>
//                                 ) : msg.status === "Yes" ? (
//                                     <>
//                                         <h2 className="text-lg font-semibold">{msg.title}</h2>
//                                         <p className="text-gray-700">Name: {msg.name}</p>
//                                         <p className="text-gray-500 text-sm">Email: {msg.email}</p>
//                                         <p className="text-gray-500 text-sm">Phone# {msg.phone}</p>
//                                         <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
//                                             Contact Buyer
//                                         </button>
//                                     </>
//                                 ) : (
//                                     <p className="text-red-600 font-semibold">You rejected the ask</p>
//                                 )}
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
    const [sortOrder, setSortOrder] = useState("desc"); // Sorting order
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 6; // Number of messages per page

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

    // Sorting messages
    const sortedMessages = [...messages].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    // Pagination logic
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = sortedMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    return (
        <div className="flex min-h-screen flex-col px-4">
            <Header />

            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
                <SidebarNav />

                <main>
                    {/* Sorting Dropdown */}
                    <div className="flex justify-end items-center gap-2 mb-4">
                        <span>Sort By</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            <option value="desc">Most Recent</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>

                    {/* Message Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currentMessages.map((msg) => (
                            <div key={msg.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
                                {msg.status === "Pending" ? (
                                    <>
                                        <h3 className="text-md">
                                            You have a buyer who wants to connect for your listing, 
                                            <span className="font-semibold text-lg">{msg.title}!</span>
                                        </h3>

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
                                        <h2 className="text-lg font-semibold">{msg.title}</h2>
                                        <p className="text-gray-700">Name: {msg.name}</p>
                                        <p className="text-gray-500 text-sm">Email: {msg.email}</p>
                                        <p className="text-gray-500 text-sm">Phone# {msg.phone}</p>
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

                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-6 gap-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-lg font-semibold">Page {currentPage}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={indexOfLastMessage >= messages.length}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
