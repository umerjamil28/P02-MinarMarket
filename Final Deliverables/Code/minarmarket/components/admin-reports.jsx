"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
// import { updateReportStatus } from "@/lib/api/admin";

export function AdminReportsTable({ reports, refetch }) {
  const [selectedReports, setSelectedReports] = useState([]);

  // const { mutate: updateStatus, isLoading } = useMutation({
  //   mutationFn: ({ ids, status }) => updateReportStatus(ids, status),
  //   onSuccess: () => {
  //     refetch();
  //     setSelectedReports([]);
  //   },
  //   onError: (error) => {
  //     console.error("Failed to update report status:", error);
  //   },
  // });

  const handleStatusUpdate = (newStatus) => {
    if (selectedReports.length === 0) return;
    updateStatus({ ids: selectedReports, status: newStatus });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Reports</h1>
        
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
            </TableHead>
            <TableHead>Report ID</TableHead>
            <TableHead>Reporter Name</TableHead>
            <TableHead>Reported User</TableHead>
            <TableHead>Complaint Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>View Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report._id}>
              <TableCell>
              </TableCell>
              <TableCell className="font-medium text-blue-600">{report._id}</TableCell>
              <TableCell>{report.reporterName}</TableCell>
              <TableCell>{report.reportedUserName}</TableCell>
              <TableCell>{report.complaintType}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${report.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : report.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : report.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {report.status}
                </span>
              </TableCell>

              <TableCell className="text-purple-800 underline">
                <Link href={`/app/admin/reports/${report._id}`}>
                  View More Detail
                </Link></TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
