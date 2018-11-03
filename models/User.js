const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: { type: String, required: true },
  email: { type: String, required: true },
  food: [{
    type: Schema.Types.ObjectId,
    ref: "Food"
  }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;