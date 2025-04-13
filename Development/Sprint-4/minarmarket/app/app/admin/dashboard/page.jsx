"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin-header"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart, Pie, Cell } from "recharts";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [visitsData, setVisitsData] = useState([]);
  //const [fromDate, setFromDate] = useState(null);
  //const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalVisits, setTotalVisits] = useState(0);
  const [signedInVisits, setSignedInVisits] = useState(0);

  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD
  });


  const [buyerContacts, setBuyerContacts] = useState([]);
  //const [fromDateContacts, setFromDateContacts] = useState(null);
  //const [toDateContacts, setToDateContacts] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [errorContacts, setErrorContacts] = useState(null);
  const [totalBuyerContacts, setTotalBuyerContacts] = useState(0);

  const [fromDateContacts, setFromDateContacts] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  const [toDateContacts, setToDateContacts] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD
  });




  const [sellerContacts, setSellerContacts] = useState([]);
  const [totalSellerContacts, setTotalSellerContacts] = useState(0);
  const [loadingSellerContacts, setLoadingSellerContacts] = useState(false);
  const [errorSellerContacts, setErrorSellerContacts] = useState(null);




  const today = new Date();

  // Ensure valid date selection
  const handleDateChange = (date, setDate) => {

    if (date > today) {
      alert("End date cannot be greater than today.");
      return;
    }
    setDate(date);
  };










  const [adsData, setAdsData] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [errorAds, setErrorAds] = useState(null);

  const fetchAdsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Convert dictionary to array format for Recharts
      const adsDataArray = Object.entries(data.data).map(([key, value]) => ({
        name: key,
        value,
      }));
      setAdsData(adsDataArray);


    } catch (error) {
      console.error("Error fetching ad visit data:", error);
      setError("Failed to load ad visit data.");
    }

    setLoading(false);
  };



  const pageNames = {
    "1": "Buyer Dashboard",
    "2": "Landing Page",
    "3": "Seller Dashboard",
    "4": "Products",
    "5": "Services",
  };

  const formattedAdsData = adsData.map(({ name, value }) => ({
    name: pageNames[name] || name, // Map key to name, fallback to original
    value,
  }));

  const totalAdVisits = formattedAdsData.reduce((sum, entry) => sum + entry.value, 0); // Sum all values

  const renderPieChart = () => {
    if (!formattedAdsData.length) return <p>No ad visit data available.</p>;

    const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ff6384", "#36a2eb"];

    return (
      <div className="flex flex-col items-center">
        {/* Total Ad Visits */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Total Ad Visits in Past 30 Days: {totalAdVisits}
        </h3>

        {/* Pie Chart */}
        <PieChart width={600} height={400}>
          <Pie
            data={formattedAdsData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {formattedAdsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Custom Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {formattedAdsData.map((entry, index) => (
            <div key={entry.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-gray-700 font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };









  const fetchSellerContacts = async () => {

    if (fromDateContacts && toDateContacts && fromDateContacts > toDateContacts) {
      setToDateContacts(null);
      alert("Start date cannot be greater than end date.");
      return;
    }

    setLoadingSellerContacts(true);
    setErrorSellerContacts(null);

    try {
      const requestBody = {};
      //if (fromDateContacts) requestBody.from = fromDateContacts.toISOString();
      if (fromDateContacts) {
        const adjustedDate = new Date(fromDateContacts);
        adjustedDate.setDate(adjustedDate.getDate() - 1);
        requestBody.from = adjustedDate.toISOString();
      }
      if (toDateContacts) requestBody.to = new Date(toDateContacts).toISOString();


      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webvisits/seller-contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      const contacts = data.data || [];

      // Group data by date
      const groupedContacts = contacts.reduce((acc, contact) => {
        const date = new Date(contact.date).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + contact.count;
        return acc;
      }, {});


      const generateDateLabels = (start, end) => {
        let labels = [];
        let currentDate = new Date(start);
        // currentDate.setDate(currentDate.getDate() + 1);
        let endDate = new Date(end);
        // endDate.setDate(endDate.getDate() + 1);

        while (currentDate <= endDate) {
          labels.push(currentDate.toISOString().split("T")[0]); // YYYY-MM-DD
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return labels;
      };

      const fromDate = new Date(fromDateContacts);
      const toDate = new Date(toDateContacts);
      const allDates = generateDateLabels(fromDate, toDate);
      // 🛠️ Step 3: Fill in missing dates with count = 0
      const filledContacts = allDates.map(date => ({
        _id: date,
        count: groupedContacts[date] || 0, // Use existing count or default to 0
      }));

      // 🛠️ Step 4: Calculate total contacts
      const totalContacts = filledContacts.reduce((sum, { count }) => sum + count, 0);
      setTotalSellerContacts(totalContacts);
      setSellerContacts(filledContacts);
      // ✅ Convert array to a readable string and alert
      //alert("Filled Contacts:\n" + filledContacts.map(c => `${c._id}: ${c.count}`).join("\n"));

    } catch (error) {
      console.error("Error fetching seller contacts:", error);
      setErrorSellerContacts("Failed to load seller contacts data.");
    }

    setLoadingSellerContacts(false);
  };


  const fetchBuyerContacts = async () => {

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // ✅ Set defaults if fromDateContacts or toDateContacts are missing
    if (!fromDateContacts) setFromDateContacts(sevenDaysAgo.toISOString().split("T")[0]);
    if (!toDateContacts) setToDateContacts(today.toISOString().split("T")[0]);

    if (fromDateContacts && toDateContacts && fromDateContacts > toDateContacts) {
      setToDateContacts(null);
      alert("Start date cannot be greater than end date.");
      return;
    }

    setLoadingContacts(true);
    setErrorContacts(null);

    try {
      const requestBody = {};
      //   if (fromDateContacts) requestBody.from = fromDateContacts.toISOString();
      if (fromDateContacts) {
        const adjustedDate = new Date(fromDateContacts);
        adjustedDate.setDate(adjustedDate.getDate() - 1);
        requestBody.from = adjustedDate.toISOString();
      }

      if (toDateContacts) requestBody.to = new Date(toDateContacts).toISOString();


      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webvisits/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      const contacts = data.data || [];

      // Process data to count contacts per date
      const groupedContacts = contacts.reduce((acc, contact) => {
        const date = new Date(contact.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
        acc[date] = (acc[date] || 0) + contact.count; // Add the count value instead of just incrementing by 1
        return acc;
      }, {});


      const generateDateLabels = (start, end) => {
        let labels = [];
        let currentDate = new Date(start);
        // currentDate.setDate(currentDate.getDate() + 1);
        let endDate = new Date(end);
        // endDate.setDate(endDate.getDate() + 1);

        while (currentDate <= endDate) {
          labels.push(currentDate.toISOString().split("T")[0]); // YYYY-MM-DD
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return labels;
      };

      const fromDate = new Date(fromDateContacts);
      const toDate = new Date(toDateContacts);
      const allDates = generateDateLabels(fromDate, toDate);
      // 🛠️ Step 3: Fill in missing dates with count = 0
      const filledContacts = allDates.map(date => ({
        _id: date,
        count: groupedContacts[date] || 0, // Use existing count or default to 0
      }));

      // 🛠️ Step 4: Calculate total contacts
      const totalContacts = filledContacts.reduce((sum, { count }) => sum + count, 0);
      setTotalBuyerContacts(totalContacts);
      setBuyerContacts(filledContacts);
      // ✅ Convert array to a readable string and alert
      //alert("Filled Contacts:\n" + filledContacts.map(c => `${c._id}: ${c.count}`).join("\n"));

    } catch (error) {
      console.error("Error fetching buyer contacts:", error);
      setErrorContacts("Failed to load buyer contacts data.");
    }

    setLoadingContacts(false);
  };





  // Function to fetch visit data
  const fetchData = async () => {
    if (fromDate && toDate && fromDate > toDate) {
      setToDate(null);
      alert("Start date cannot be greater than end date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const requestBody = {};

      let adjustedFromDate = fromDate ? new Date(fromDate) : null;
      let adjustedToDate = toDate ? new Date(toDate) : null;

      if (adjustedFromDate) {
        adjustedFromDate.setDate(adjustedFromDate.getDate()); // Add 1 day
        requestBody.from = adjustedFromDate.toISOString();
      }

      if (adjustedToDate) {
        adjustedToDate.setDate(adjustedToDate.getDate()); // Add 1 day
        requestBody.to = adjustedToDate.toISOString();
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webvisits/visits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );


      const data = await response.json();
      const visits = data.data || [];


      const visitMap = {};
      let currentDate = new Date(adjustedFromDate);
      const lastDate = new Date(adjustedToDate);

      while (currentDate <= lastDate) {
        const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
        visitMap[formattedDate] = {
          _id: formattedDate,
          totalVisits: 0,
          signedInVisits: 0
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Populate the visitMap with actual visit data
      visits.forEach(v => {
        if (visitMap[v._id]) {
          visitMap[v._id].totalVisits = v.totalVisits;
          visitMap[v._id].signedInVisits = v.signedInVisits;
        }
      });

      // Convert back to an array sorted by date
      const completeVisits = Object.values(visitMap).sort((a, b) => a._id.localeCompare(b._id));
      //alert(JSON.stringify(completeVisits, null, 2));

      setVisitsData(completeVisits);

      // Calculate total visits and signed-in visits
      const total = completeVisits.reduce((sum, v) => sum + v.totalVisits, 0);
      const signedIn = completeVisits.reduce((sum, v) => sum + v.signedInVisits, 0);

      setTotalVisits(total);
      setSignedInVisits(signedIn);

    } catch (error) {
      console.error("Error fetching visit data:", error);
      setError("Failed to load visit data.");
    }

    setLoading(false);
  };

  // Fetch initial data when the component first mounts (without any date filters)
  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchBuyerContacts();
    fetchSellerContacts();
  }, [fromDateContacts, toDateContacts]);

  useEffect(() => {
    fetchAdsData();
  }, []);




  // Prepare data for chart
  const chartData = {
    labels: visitsData.map((v) => new Date(v._id).toLocaleDateString()), // Format date
    datasets: [
      {
        label: "Total Visits",
        data: visitsData.map((v) => v.totalVisits),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0, // Smooth curve
        pointRadius: 3,
        pointHoverRadius: 7,
      },
      {
        label: "Signed-in Visits",
        data: visitsData.map((v) => v.signedInVisits),
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0, // Smooth curve
        pointRadius: 3,
        pointHoverRadius: 7,
      },

    ],
  };




  const generateDateLabels = (start, end) => {
    let labels = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      labels.push(currentDate.toISOString().split('T')[0]); // YYYY-MM-DD format
      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }

    return labels;
  };

  // ✅ Generate labels from fromDateContacts to toDateContacts
  const labels = generateDateLabels(fromDateContacts, toDateContacts);

  const buyerContactsChartData = {
    labels: sellerContacts.map((v) => new Date(v._id).toLocaleDateString()), // Dates as labels
    datasets: [
      {
        label: "Buyer Contacts",
        data: buyerContacts.map((c) => c.count),
        borderColor: "#4CAF50", // Green
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 7,
      },
      {
        label: "Seller Contacts",
        data: sellerContacts.map((c) => c.count),
        borderColor: "#FF9800", // Orange
        backgroundColor: "rgba(255, 152, 0, 0.2)",
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 7,
      },
    ],
  };



  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#333", // Darker text for contrast
          font: { size: 14 },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#555" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#555" },
        grid: { color: "rgba(200, 200, 200, 0.3)" },
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col px-4">
      <AdminHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <AdminSidebar />
        <main className="flex w-full flex-col gap-8">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
          {/* Total Visits Display */}
          <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-700">Total Visits</p>
              <p className="text-3xl font-bold text-red-500">{totalVisits}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-700">Signed-in Visits</p>
              <p className="text-3xl font-bold text-blue-500">{signedInVisits}</p>
            </div>
          </div>

          {/* Date Picker Filters */}
          <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow-md">
            <div>
              <label className="text-sm font-semibold text-gray-600">From: </label>
              <DatePicker
                selected={fromDate}
                onChange={(date) => handleDateChange(date, setFromDate)}
                className="p-2 border rounded-md"
                placeholderText="Select Start Date"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">To: </label>
              <DatePicker
                selected={toDate}
                onChange={(date) => handleDateChange(date, setToDate)}
                className="p-2 border rounded-md"
                placeholderText="Select End Date"
              />
            </div>
            <button
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
              onClick={fetchData} // Fetch data only when clicked
            >
              Visualize
            </button>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Website Visits</h3>

            {loading ? (
              <p className="text-blue-600">Loading data...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : visitsData.length === 0 ? (
              <p className="text-gray-500">No visit data available for the selected period.</p>
            ) : (
              <div className="w-[800px] h-[300px] mx-auto"> {/* Reduced size */}
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
          <hr className="my-4 border-gray-300" />

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            {/* Date Pickers & Fetch Button */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">From (Contacts):</label>
                <DatePicker
                  selected={fromDateContacts}
                  onChange={(date) => handleDateChange(date, setFromDateContacts)}
                  className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  placeholderText="Select Start Date"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">To (Contacts):</label>
                <DatePicker
                  selected={toDateContacts}
                  onChange={(date) => handleDateChange(date, setToDateContacts)}
                  className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  placeholderText="Select End Date"
                />
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                onClick={() => {
                  fetchBuyerContacts();
                  fetchSellerContacts();
                }}
              >
                Fetch Contacts
              </button>
            </div>

            {/* Total Contacts Display */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
              <p className="text-lg font-semibold text-gray-800">Total Contacts</p>
              <p className="text-sm text-gray-600">Contacts made by buyer: <span className="text-green-600 font-bold">{totalBuyerContacts}</span></p>
              <p className="text-sm text-gray-600">Contacts made by seller: <span className="text-orange-600 font-bold">{totalSellerContacts}</span></p>
            </div>

          </div>






          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Buyer & Seller Contacts</h3>

            {loadingContacts || loadingSellerContacts ? (
              <p className="text-blue-600">Loading contacts...</p>
            ) : errorContacts || errorSellerContacts ? (
              <p className="text-red-600">{errorContacts || errorSellerContacts}</p>
            ) : buyerContacts.length === 0 && sellerContacts.length === 0 ? (
              <p className="text-gray-500">No buyers or sellers contacted each other in this time frame.</p>
            ) : (
              <div className="w-[800px] h-[300px] mx-auto">
                <Line data={buyerContactsChartData} options={chartOptions} />
              </div>
            )}
          </div>
          <hr className="my-4 border-gray-300" />

          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Ad Visit Distribution</h3>
            {loadingAds ? (
              <p className="text-blue-600">Loading ad data...</p>
            ) : errorAds ? (
              <p className="text-red-600">{errorAds}</p>
            ) : (
              <div className="flex justify-center">{renderPieChart()}</div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};


export default AdminDashboard;
