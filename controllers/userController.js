const db = require("../models");

// Defining methods for the userController
module.exports = {
  // Find one user
  findOne: function (req, res) {
    db.User
      .findOne({ username: req.params.username }, ["username", "calorieGoal" ])
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // Create new user
  create: function (req, res) {
    db.User
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // Update user
  update: function (req, res) {
    db.User
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // Deletes user from database along with food data and delete them for Auth0
  removeUser: function (req, res) {
    console.log(req.params);
    // Deletes user from database as well as food data
    db.User
      .findOneAndDelete({ username: req.params.username })
      .then(dbUser => {
        console.log(`This user was deleted: ${dbUser}`);
        return db.Food.deleteMany({ username: dbUser.username })
      })
      .then(dbFood => {
        console.log("This is dbFood:", dbFood);

      })
      .catch(err => res.status(422).json(err));

    console.log("The function is getting this far")
    // Deletes user from Auth0
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://calsnap.auth0.com/api/v2/users/${req.params.id}`,
      "method": "GET",
      "headers": {
        "authorization": `Bearer =${process.env.AUHT0_API_TOKENID}`
      }
    }

    axios(settings)
      .then(res => res.json(res))
      .catch(err => res.status(422).json(err));
  }
};