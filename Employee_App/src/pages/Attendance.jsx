const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: String,
  status: String, // Present / Absent / Late / Leave
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
