const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  empId: String,
  role: String,
  joinDate: Date,
  basicSalary: Number
});

module.exports = mongoose.model("Employee", employeeSchema);
