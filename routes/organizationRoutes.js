const express = require("express");
const router = express.Router();
const orgController = require("../controllers/organizationController");
const { authenticateToken } = require("../middleware/auth");
const verifyAdmin = require("../middleware/verifyAdmin");

router.use(authenticateToken);
router.post("/create", orgController.createOrganization);
router.get("/", orgController.getOrganizations);
router.put("/assign", orgController.assignProfessionalToOrganization);
router.post("/approve/:id", verifyAdmin, orgController.approveOrganization);

module.exports = router;