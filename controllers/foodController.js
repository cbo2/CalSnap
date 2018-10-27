const db = require("../models");
// TODO - start
// TODO - later, consider to refactor the below dependencies passing through from server.js
// const path = app.get('path');
// const uuid = app.get('uuid');
// const fs = app.get('fs');
// const VisualRecognitionV3 = app.get('watson');
// TODO - and, remove the corresponding ones below
const path = require('path');
const uuid = require('uuid');
const fs = require("fs");
const VisualRecognitionV3 = require("watson-developer-cloud/visual-recognition/v3");
// TODO - end
require("dotenv").config({
  silent: true
});
const visual_recognition = new VisualRecognitionV3({
  version: "2018-03-19"
});


// Defining methods for the articlesController
module.exports = {
  parseBase64Image: function (imageString) {
    var matches = imageString.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    var resource = {};

    if (matches.length !== 3) {
      return null;
    }

    resource.type = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    resource.data = new Buffer(matches[2], 'base64');
    return resource;
  },
  // we will use identifyFood to call to watson
  identifyFood: function (req, res) {

    console.log(`===> hit the /api/food "watson" route`);

    const params = {
      classifier_ids: ["food"],
      image_file: null
    };
    console.log("about to parse from Watson: ")
    // let resource = parseBase64Image(req.body.image)

    // TODO - begin - refactor later to separate function
    let imageString = req.body.image
    console.log(`===> the image is: ${imageString}`)

    let matches = imageString.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    let resource = {};
    // if (matches.length !== 3) {
    //   return null;
    // }
    resource.type = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    resource.data = new Buffer(matches[2], 'base64');
    // TODO - end - refactor later to separate function

    console.log("=======> os tempdir is: " + __dirname + "/pics")
    let temp = path.join(__dirname + "/pics", uuid.v1() + '.' + resource.type);
    console.log("========> temp file is: " + temp)
    fs.writeFileSync(temp, resource.data, { mode: '664' });

    params.image_file = fs.createReadStream(temp);

    console.log("====> about to call watson!");
    visual_recognition.classify(params, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("====> " + JSON.stringify(result));
        const labelsvr = result.images[0].classifiers[0].classes[0].class;
        console.log("===> " + JSON.stringify(labelsvr));
        res.send({ data: labelsvr });
      }
    })
  },
  findAll: function (req, res) {
    db.Food
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Food
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    db.Food
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
  remove: function (req, res) {
    db.Food
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
