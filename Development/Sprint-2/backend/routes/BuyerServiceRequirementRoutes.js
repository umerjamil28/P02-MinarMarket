const express = require('express');
const router = express.Router();
const { 
    listServiceRequirement, 
    getMyServiceRequirements 
} = require('../controllers/BuyerServiceRequirementController');

router.post('/', listServiceRequirement);
router.get('/', getMyServiceRequirements);

module.exports = router;
