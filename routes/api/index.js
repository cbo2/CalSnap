const router = require("express").Router();
const foodRoutes = require("./food");

// Article routes
router.use("/food", foodRoutes);

module.exports = router;