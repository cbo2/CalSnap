const db = require("../models");

// Defining methods for the userController
module.exports = {
  findOne: function (req, res) {
    db.User
      .findOne({ username: req.params.username }, "username")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    db.User
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  //   update: function(req, res) {
  //     db.Article
  //       .findOneAndUpdate({ _id: req.params.id }, req.body)
  //       .then(dbModel => res.json(dbModel))
  //       .catch(err => res.status(422).json(err));
  //   },
  removeUser: function (req, res) {
    db.User
    .findOneAndDelete({ username: req.params.username })
    .then(dbUser => {
      return db.Food.deleteMany({ username: dbUser.username })
    })
    .then(dbFood => res.json(dbFood))
    .catch(err => res.status(422).json(err));

    console.log(req);
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
      .then(function (response) {
        console.log(response);
      });
  }
};