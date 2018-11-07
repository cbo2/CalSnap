var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FoodSchema = new Schema({
  item_name: String,
  quantity: Number,
  nf_calories: Number,
  nf_protein: Number,
  nf_serving_size_unit: String,
  nf_total_carbohydrate: Number,
  username: String,
  meal: String,
  date: Date
});

// This creates our model from the above schema, using mongoose's model method
var Food = mongoose.model("Food", FoodSchema);

// Export the Note model
module.exports = Food;