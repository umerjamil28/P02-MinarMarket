const Visit = require("../models/Visit");
const BuyerMessage = require("../models/BuyerMessages");
const Proposal = require('../models/Proposal'); // Adjust the path if needed


// Utility function to get IP address
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
};

exports.recordVisit = async (req, res) => {

    try {
        const ipAddress = getClientIP(req);
        const userAgent = req.body.userAgent || req.headers["user-agent"]; 
        const userId = req.body.userId || null;
        const page = req.body.page || "unknown"; 
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Extract YYYY-MM-DD

        // Check if a visit from this IP exists today
        const existingVisit = await Visit.findOne({ userId, ipAddress, userAgent, date: formattedDate });
        
        if (existingVisit) {
          return res.status(200).json({
            success: false,
            message: "Visit already recorded today.",
          });
        }
    
        // Save new visit if it's a new day
       
        const visit = new Visit({ userId, ipAddress, userAgent, page, date: formattedDate });
        await visit.save();
    
        return res.status(200).json({
          success: true,
          message: "Visit recorded successfully.",
        });
      } catch (error) {
        console.error("Error recording visit:", error);
        return res.status(500).json({
          success: false,
          message: "An error occurred while recording the visit.",
        });
      }

};


exports.getVisitStats = async (req, res) => {
    try {
      const { from, to } = req.body;
  
      // Default range: Last 7 days if no dates are provided
      let startDate = from ? new Date(from) : new Date();
      let endDate = to ? new Date(to) : new Date();
  
      if (!from || !to) {
        startDate.setUTCDate(endDate.getUTCDate() - 7);
      }
  
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);
  
      // Convert start and end date to YYYY-MM-DD format for comparison
      const startDateString = startDate.toISOString().split("T")[0];
      const endDateString = endDate.toISOString().split("T")[0];
  
      // ✅ Aggregate visit data by date (using `date` field)
      const visits = await Visit.aggregate([
        {
          $match: {
            date: { $gte: startDateString, $lte: endDateString }, // Compare using `date` field (YYYY-MM-DD format)
          },
        },
        {
          $group: {
            _id: "$date", // Group by `date` directly
            totalVisits: { $sum: 1 },
            signedInVisits: {
              $sum: { $cond: [{ $ifNull: ["$userId", false] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      return res.status(200).json({
        success: true,
        message: "Visit statistics fetched successfully.",
        data: visits,
      });
  
    } catch (error) {
      console.error("Error fetching visit stats:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching visit statistics.",
      });
    }
  };
  


exports.buyerContacts = async (req, res) => {
    try {
       
        // Extract date range from request body
        let { from, to } = req.body;
    

        // Default to last 7 days if no date range provided
        let startDate = from ? new Date(from) : new Date();
        let endDate = to ? new Date(to) : new Date();

        if (!from || !to) {
            startDate.setUTCDate(endDate.getUTCDate() - 7); // Go back 7 days
        }

        // Set time for accurate filtering
        startDate.setUTCHours(0, 0, 0, 0);
        startDate.setUTCDate(startDate.getUTCDate() + 1);
        endDate.setUTCDate(endDate.getUTCDate() + 2);
        endDate.setUTCHours(23, 59, 59, 999);


       
        const contacts = await BuyerMessage.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: startDate, $lte: endDate }
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%dT00:00:00.000Z", date: "$createdAt" } }, // Keep ISO format
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Convert `_id` back to a real Date object
        
        const formattedContacts = contacts.map(c => ({
            date: new Date(c._id), // Convert back to Date object
            count: c.count
        }));

      

        return res.status(200).json({ success: true, data: formattedContacts });
    } catch (error) {
        console.error("Error fetching buyer contacts:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};



exports.sellerContacts = async (req, res) => {
    
    try {
        // Extract date range from request body
        let { from, to } = req.body;

        // Default to last 7 days if no date range provided
        let startDate = from ? new Date(from) : new Date();
        let endDate = to ? new Date(to) : new Date();

        if (!from || !to) {
            startDate.setUTCDate(endDate.getUTCDate() - 7); // Go back 7 days
        }

        // Set time for accurate filtering
        startDate.setUTCHours(0, 0, 0, 0);
        startDate.setUTCDate(startDate.getUTCDate() + 1);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        endDate.setUTCHours(23, 59, 59, 999);

        // Aggregate proposals by createdAt date
        const contacts = await Proposal.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: startDate, $lte: endDate }
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%dT00:00:00.000Z", date: "$createdAt" } }, // Keep ISO format
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Convert `_id` back to a real Date object
        const formattedContacts = contacts.map(c => ({
            date: new Date(c._id), // Convert back to Date object
            count: c.count
        }));


        return res.status(200).json({ success: true, data: formattedContacts });
    } catch (error) {
        console.error("Error fetching seller contacts:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};



exports.adVisits = async (req, res) => {
    
    try {
        // Calculate the date range for the last 30 days
        let endDate = new Date();
        let startDate = new Date();
        startDate.setUTCDate(endDate.getUTCDate() - 30); // Go back 30 days
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        // Convert dates to YYYY-MM-DD format for filtering
        const startDateString = startDate.toISOString().split("T")[0];
        const endDateString = endDate.toISOString().split("T")[0];

        // Aggregate visits based on the `page` field
        const visitCounts = await Visit.aggregate([
            {
                $match: {
                    date: { $gte: startDateString, $lte: endDateString } // Filter visits within the last 30 days
                }
            },
            {
                $group: {
                    _id: "$page", // Group by `page`
                    count: { $sum: 1 } // Count occurrences of each `page`
                }
            }
        ]);

        // Convert result to a dictionary format
        const pageVisitDict = {};
        visitCounts.forEach(({ _id, count }) => {
            if (_id !== null) { 
                pageVisitDict[_id] = count;
            }
        });

        return res.status(200).json({
            success: true,
            message: "Ad visit statistics fetched successfully.",
            data: pageVisitDict
        });

    } catch (error) {
        console.error("Error fetching ad visit stats:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching ad visit statistics."
        });
    }
};
