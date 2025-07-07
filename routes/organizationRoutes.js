const express = require("express");
const router = express.Router();
const orgController = require("../controllers/organizationController");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);
router.post("/create", orgController.createOrganization);
router.get("/", orgController.getOrganizations);
router.put("/assign", orgController.assignProfessionalToOrganization);

module.exports = router;