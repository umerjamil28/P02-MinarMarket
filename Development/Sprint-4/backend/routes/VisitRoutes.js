const express = require("express");
const { recordVisit, getVisitStats, buyerContacts, sellerContacts, adVisits, recordProd } = require("../controllers/VisitController");
const router = express.Router();

router.post("/", recordVisit);
router.post("/visits", getVisitStats);
router.post("/contacts", buyerContacts);
router.post("/seller-contacts", sellerContacts);
router.post("/ads", adVisits)

router.post("/prodvisits", recordProd)

module.exports = router;
