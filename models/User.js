const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  calorieGoal: { type: Number, default: 2200 },
    food: [{
      type: Schema.Types.ObjectId,
      ref: "Food"
    }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;