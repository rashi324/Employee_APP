const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: String,
  from: Date,
  to: Date,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Leave", leaveSchema);
