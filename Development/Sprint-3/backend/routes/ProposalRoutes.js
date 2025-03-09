const express = require('express');
const router = express.Router();
const { createProposal, getProposalsByUser,getReceivedProposals, updateProposalStatus, getSellerProposals} = require('../controllers/ProposalController');


// Create new proposal
router.post('/', createProposal);

// Get proposals by user role (buyer/seller)
router.post('/:role', getProposalsByUser);
router.get('/received/:userId', getReceivedProposals);
router.put('/:proposalId/status', updateProposalStatus);
router.get('/seller/:userId', getSellerProposals);
// Add this new route


module.exports = router;