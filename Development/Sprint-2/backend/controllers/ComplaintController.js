const Complaint = require("../models/Complaint");
const ProductListing = require("../models/ProductListing"); // Import Product schema
const ServiceListing = require("../models/ServiceListing"); // Import Service schema


exports.getAllComplaints = async (req, res) => {
  try {
    // Fetch all complaints from the database (without sorting)
    const complaints = await Complaint.find();

    // Define a custom sorting order
    const sortOrder = {
      Pending: 1,
      "Under Review": 2,
      Resolved: 3,
      Rejected: 4,
    };

    // Manually sort complaints using the predefined order
    complaints.sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Error fetching all complaints: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching all the complaints.",
    });
  }
};

exports.getIndividualComplaint = async (req, res) => {
  try {
    // Extracting complaint ID from request parameters
    const { complaintId } = req.params;

    // Fetching complaint details by ID
    const requiredComplaint = await Complaint.findById(complaintId)
      .populate("reporterId", "name email") // Populate reporter details
      .populate("reportedUserId", "name email"); // Populate reported user details

    // If complaint is not found, return 404 response
    if (!requiredComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // Sending complaint details in response
    res.status(200).json({
      success: true,
      complaint: requiredComplaint,
    });
  } catch (error) {
    console.error("Error fetching the details of the complaint: ", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the details of the complaint.",
    });
  }
};

exports.registerComplaint = async (req, res) => {
  try {
    const { reporterId, type, sentId, complaintType, description } = req.body;
    let reportedUserId;

    if (type === "Product") {
      // Fetch only the listerId from ProductListing
      const product = await ProductListing.findById(sentId).select("listerId");
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }
      reportedUserId = product.listerId;
    } 
    else if (type === "Service") {
      // Fetch only the listerId from ServiceListing
      const service = await ServiceListing.findById(sentId).select("listerId");
      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found." });
      }
      reportedUserId = service.listerId;
    } 
    else {
      return res.status(400).json({ success: false, message: "Invalid type. It must be either 'Product' or 'Service'." });
    }

    // Create and save new complaint
    const newComplaint = new Complaint({
      reporterId,
      reportedUserId,
      complaintType,
      description,
    });

    await newComplaint.save();

    res.status(200).json({
      success: true,
      message: "The complaint has been registered successfully and forwarded to the Admin.",
    });
  } catch (error) {
    console.error("Error registering a complaint: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while registering a complaint.",
    });
  }
};

exports.resolveComplaint = async (req, res) => {
  try {
    //Resolving the complaint
    const { complaintId } = req.params;
    const { status, adminNotes } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status, adminNotes, resolvedAt: new Date() },
      { new: true }
    );

    if (!complaint)
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });

    res.status(200).json({
      success: true,
      message: "Complaint has been registered successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Error resolving the complaint: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resolving the complaint.",
    });
  }
};
