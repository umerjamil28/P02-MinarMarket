const express = require('express');
const router = express.Router();
const { createProposal, getProposalsByUser } = require('../controllers/ProposalController');

// Create new proposal
router.post('/', createProposal);

// Get proposals by user role (buyer/seller)
router.post('/:role', getProposalsByUser);

module.exports = router;