
"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { getUserDetails } from "@/lib/SessionManager";
import {
  Check,
  X,
  Clock,
  Mail,
  Phone,
  Tag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation"; // ✅ Added import

export default function MessageChat() {
  const [messages, setMessages] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;

  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user = await getUserDetails();
        if (!user || !user.userId) return;

        setSellerId(user.userId);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/message-from-buyers/${user.userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleStatusUpdate = async (msgId, newStatus, buyerId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/update-message-status/${msgId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, sellerId, buyerId }),
        }
      );

      if (!response.ok) throw new Error("Failed to update message status");

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === msgId ? { ...msg, status: newStatus } : msg
        )
      );
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = sortedMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 md:py-8">
        <SidebarNav />

        <main className="space-y-6 px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              Buyer Messages
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort By</span>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Most Recent</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="asc">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Oldest First</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">No messages yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                When buyers contact you about your listings, they&apos;ll appear
                here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {currentMessages.map((msg) => (
                <Card
                  key={msg.id}
                  className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                    msg.status === "Pending"
                      ? "border-l-4 border-l-amber-500"
                      : msg.status === "Yes"
                      ? "border-l-4 border-l-green-500"
                      : "border-l-4 border-l-red-500"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
                    <div className="flex-1 space-y-3 md:pr-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge
                          variant={
                            msg.status === "Pending"
                              ? "outline"
                              : msg.status === "Yes"
                              ? "success"
                              : "destructive"
                          }
                          className="px-2 py-1"
                        >
                          {msg.status === "Pending" ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Pending</span>
                            </div>
                          ) : msg.status === "Yes" ? (
                            <div className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              <span>Accepted</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <X className="h-3 w-3" />
                              <span>Declined</span>
                            </div>
                          )}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold">{msg.title}</h3>

                      {msg.status === "Pending" ? (
                        <p className="text-sm text-gray-600">
                          You have a buyer who wants to connect for your
                          listing.
                        </p>
                      ) : msg.status === "Yes" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Name:</span>
                            <span className="text-gray-700">{msg.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">
                              {msg.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{msg.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">
                              {msg.category}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          You declined this connection request.
                        </p>
                      )}
                    </div>

                    {/* ✅ Updated "Contact Buyer" button with router.push */}
                    <div className="flex-shrink-0 flex mt-4 md:mr-6">
                      {msg.status === "Pending" ? (
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                          <Button
                            onClick={() =>
                              handleStatusUpdate(msg.id, "Yes", msg.buyerId)
                            }
                            variant="default"
                            className="gap-1"
                          >
                            <Check className="h-4 w-4" />
                            Accept
                          </Button>
                          <Button
                            onClick={() =>
                              handleStatusUpdate(msg.id, "No", msg.buyerId)
                            }
                            variant="outline"
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      ) : msg.status === "Yes" ? (
                        <Button
                          className="gap-1"
                          onClick={() =>
                            router.push(
                              `/app/messages?buyerId=${msg.buyerId}&sellerId=${sellerId}`
                            )
                          }
                        >
                          <MessageSquare className="h-4 w-4" />
                          Contact Buyer
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {messages.length > 0 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">Page</span>
                <span className="text-sm font-medium">{currentPage}</span>
                <span className="text-sm text-gray-500">
                  of {Math.ceil(messages.length / messagesPerPage)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={
                  indexOfLastMessage >= messages.length ||
                  currentMessages.length < messagesPerPage
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
