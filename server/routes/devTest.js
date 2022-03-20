const express = require("express");
const router = express.Router();

const devTestController = require("../controllers/devTest");
const checkAuth = require("../middleware/check-auth");

// router.get("", checkAuth, devTestController.test);
router.get("", devTestController.test);
module.exports = router;
