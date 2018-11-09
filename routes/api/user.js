const router = require("express").Router();
const userController = require("../../controllers/userController");

// Matches with "/api/user"
router.route("/")
  .post(userController.create);

// Matches with "/api/user/:username"
router.route("/:username")
  .get(userController.findOne)

router.route("/:id")
  .put(userController.update)

  router.route("/:username/:id")
  .delete(userController.removeUser)
  
  module.exports = router;