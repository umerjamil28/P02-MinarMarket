const BuyerRequirement = require('../models/BuyerRequirement');
const Proposal = require('../models/Proposal');
const User = require('../models/User');
const BuyerServiceRequirement = require('../models/BuyerServiceRequirement');
const ProductListing = require('../models/ProductListing');
const ServiceListing = require('../models/ServiceListing');


exports.createProposal = async (req, res) => {
  try {
    console.log(req.body)
    const { sellerId, requirementId, sellerListingId} = req.body;

    // Check for missing required fields
    if (!sellerId || !requirementId || !sellerListingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const existingProposal = await Proposal.findOne({
      requirementId,
      sellerListingId,
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: 'This listing has already been offered against this requirement',
      });
    }

    // Create a new proposal with the specified attributes
    const proposal = new Proposal({
      sellerId,
      requirementId,
      sellerListingId,
      createdAt: new Date()
    });

    // Save the proposal to the database
    await proposal.save();

    // Respond with success message and the created proposal
    res.status(201).json({
      success: true,
      message: 'Proposal created successfully',
      proposal
    });

  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({
      success: false, 
      message: 'Error creating proposal',
      error: error.message
    });
  }


  // try {
    
  //   const { buyerId, sellerId, requirementId, price, description } = req.body;

  //   if (!buyerId || !sellerId || !requirementId || !price || !description) {
  //     return res.status(400).json({
  //       success: false,
  //       message: 'Missing required fields'
  //     });
  //   }

  //   const proposal = new Proposal({
  //     buyerId,
  //     sellerId,
  //     requirementId,
  //     price,
  //     description
  //   });

  //   await proposal.save();

  //   res.status(201).json({
  //     success: true,
  //     message: 'Proposal created successfully',
  //     proposal
  //   });

  // } catch (error) {
  //   console.error('Error creating proposal:', error);
  //   res.status(500).json({
  //     success: false, 
  //     message: 'Error creating proposal',
  //     error: error.message
  //   });
  // }
};

exports.getProposalsByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { role } = req.params;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const query = role === 'seller' ? { sellerId: userId } : { buyerId: userId };

    const proposals = await Proposal.find(query)
      .populate('buyerId', 'name email')  
      .populate('sellerId', 'name email')
      .populate('requirementId', 'title description')
      .sort({ createdAt: -1 });
     
    res.status(200).json({
      success: true,
      proposals
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proposals',
      error: error.message
    });
  }
};

exports.getReceivedProposals = async (req, res) => {
  try {
   
    const { userId } = req.params;
    console.log(userId)
    const requirements = await BuyerRequirement.find({ listerId: userId });
    // console.log("requirements", requirements)
    const requirementIds = requirements.map(requirement => requirement._id);
    // const proposals = await Proposal.find({ requirementId })
    //   .populate('sellerId', 'name email')
    //   .populate('sellerListingId')
    //   .populate('requirementId');
    const proposals = await Proposal.find({ requirementId: { $in: requirementIds } })
      .populate('sellerId', 'name email')
      .populate('sellerListingId')
      .populate('requirementId');
      console.log(proposals)
    res.status(200).json({
      success: true,
      proposals
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proposals'
    });
  }
};


exports.updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status } = req.body;

    const proposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Proposal ${status} successfully`,
      proposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating proposal'
    });
  }
};

exports.getSellerProposals = async (req, res) => {
  // try {
    
  //   const { userId } = req.params;
    
  //   const proposals = await Proposal.find({ sellerId: userId })
  //     .populate('sellerId', 'name email')
  //     .populate('requirementId')
  //     .populate('sellerListingId')
  //     .sort({ createdAt: -1 });
  //   console.log(proposals)
  //   res.status(200).json({
  //     success: true,
  //     proposals
  //   });
  // } catch (error) {
  //   console.error('Error:', error);
  //   res.status(500).json({
  //     success: false,
  //     message: 'Error fetching seller proposals'
  //   });
  // }

  try {
    const { userId } = req.params;

    // Step 1: Get proposals for the given sellerId
    const proposals = await Proposal.find({ sellerId: userId }).sort({ createdAt: -1 });

    // Step 2: Manually fetch related details for each proposal
    const enrichedProposals = await Promise.all(proposals.map(async (proposal) => {
      // Fetch seller details
      const sellerDetails = await User.findById(proposal.sellerId).select('name email');

      // Fetch requirement details (first from BuyerRequirement, if null, check BuyerServiceRequirement)
      let requirementDetails = await BuyerRequirement.findById(proposal.requirementId);
      if (!requirementDetails) {
        requirementDetails = await BuyerServiceRequirement.findById(proposal.requirementId);
      }

      // Fetch seller listing details (first from ProductListing, if null, check ServiceListing)
      let sellerListingDetails = await ProductListing.findById(proposal.sellerListingId);
      if (!sellerListingDetails) {
        sellerListingDetails = await ServiceListing.findById(proposal.sellerListingId);
      }

      return {
        ...proposal.toObject(),
        sellerId: sellerDetails,
        requirementId: requirementDetails,
        sellerListingId: sellerListingDetails
      };
    }));

    // Step 3: Send response
    console.log(enrichedProposals)
    res.status(200).json({
      success: true,
      proposals: enrichedProposals
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller proposals'
    });
  }
};
