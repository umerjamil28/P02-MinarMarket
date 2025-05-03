const express = require('express');
const router = express.Router();
const { 
    listServiceRequirement, 
    getMyServiceRequirements, 
    fetchServiceRequirementDetails,
    getAllServiceRequirements  
} = require('../controllers/BuyerServiceRequirementController');

router.post('/', listServiceRequirement);
router.get('/', getMyServiceRequirements);
router.get('/fetch-service-requirement-details/:serviceRequirementId', fetchServiceRequirementDetails);
router.get('/all', getAllServiceRequirements);  

module.exports = router;