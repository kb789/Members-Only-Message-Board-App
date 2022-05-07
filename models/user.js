const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});
module.exports = mongoose.model("User", UserSchema);
