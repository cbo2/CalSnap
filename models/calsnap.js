const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calsnapSchema = new Schema({
  username: { type: String, required: true },
  food: { type: String, required: false },
  calories: { type: String, required: false },
  quantity: {type: Boolean, default: false}
});

const Calsnap = mongoose.model("Calsnap", calsnapSchema);

module.exports = Calsnap;