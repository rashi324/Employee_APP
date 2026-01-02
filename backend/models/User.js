const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "employee" } // admin / employee
});

module.exports = mongoose.model("User", userSchema);
