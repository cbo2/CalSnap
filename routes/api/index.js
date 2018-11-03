const router = require("express").Router();
const foodRoutes = require("./food");
const userRoutes = require("./user");

// Food routes
router.use("/food", foodRoutes);
router.use("/user", userRoutes);

module.exports = router;