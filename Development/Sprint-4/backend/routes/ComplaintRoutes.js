const express = require('express');
const router = express.Router();

const {getAllComplaints, getIndividualComplaint, registerComplaint, resolveComplaint} = require('../controllers/ComplaintController.js');

router.get('/view-complaints', getAllComplaints);
router.get('/complaint/:complaintId', getIndividualComplaint);
router.post('/register-complaint', registerComplaint);
router.post('/resolve-complaint/:complaintId', resolveComplaint);



module.exports = router;