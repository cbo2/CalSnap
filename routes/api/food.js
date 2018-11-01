const router = require("express").Router();
const foodController = require("../../controllers/foodController");
const nutritionixController = require("../../controllers/nutritionixController");

// Matches with "/api/food/identify"
router.route("/identify")
  .post(foodController.identifyFood)
// .get(foodController.create);  // we only have a post request to food/watson

router.route("/scanBarcode")
  .post(foodController.scanBarcode)

// Matches with "/api/food/:id"
router
  .route("/:id")
  .get(foodController.findById)
  .delete(foodController.remove);

// nutritionix routes
router.route("/nutritionix/instant")
  .post(nutritionixController.nutritionixInstantSearch)

router.route("/nutritionix/barcode")
  .post(nutritionixController.nutritionixBarcode)

router.route("/nutritionix/nutrition")
  .post(nutritionixController.nutritionixNutritionSearch)

module.exports = router;