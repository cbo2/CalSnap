const router = require("express").Router();
const foodController = require("../../controllers/foodController");
const nutritionixController = require("../../controllers/nutritionixController");

// Matches with "/api/food"
router.route("/")
  .post(foodController.create)

// Matches with "/api/food/:username"
router.route("/:username")
  .get(foodController.findAllbyUser)

// Matches with "/api/food/:today/:tomorrow/:username
router.route("/:username/:today/:tomorrow")
  .get(foodController.findAllbyUserAndDate)

// Matches with "/api/food/:id"
router.route("/:id")
  // .put(foodController.update)
  .delete(foodController.remove)

// Matches with "/api/food/identify"
router.route("/identify")
  .post(foodController.identifyFood)
// .get(foodController.create);  // we only have a post request to food/watson

router.route("/scanBarcode")
  .post(foodController.scanBarcode)

// nutritionix routes
router.route("/nutritionix/instant")
  .post(nutritionixController.nutritionixInstantSearch)

router.route("/nutritionix/barcode")
  .post(nutritionixController.nutritionixBarcode)

router.route("/nutritionix/nutrition")
  .post(nutritionixController.nutritionixNutritionSearch)

module.exports = router;