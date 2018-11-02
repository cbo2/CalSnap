var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FoodSchema = new Schema({
  body: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Food = mongoose.model("Food", FoodSchema);

// Export the Note model
module.exports = Food;