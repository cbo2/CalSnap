const router = require("express").Router();
const foodController = require("../../controllers/foodController");

// Matches with "/api/food"
router.route("/")
  .post(foodController.identifyFood)
  // .get(foodController.create);  // we only have a post request to food/watson

// TODO - add a route for /hitwatson


// Matches with "/api/food/:id"
router
  .route("/:id")
  .get(foodController.findById)
  .delete(foodController.remove);

module.exports = router;