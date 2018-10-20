const router = require("express").Router();
const foodController = require("../../controllers/foodController");

// Matches with "/api/food"
router.route("/")
  .get(foodController.findAll)
  .post(foodController.create);

// TODO - add a route for /hitwatson


// Matches with "/api/food/:id"
router
  .route("/:id")
  .get(foodController.findById)
  .delete(foodController.remove);

module.exports = router;