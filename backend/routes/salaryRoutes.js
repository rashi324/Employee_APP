const express = require("express");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:empId", auth, async (req, res) => {
  const emp = await Employee.findById(req.params.empId);
  const attendance = await Attendance.find({ employeeId: req.params.empId });

  const leaves = attendance.filter(a => a.status === "Leave").length;
  const deduction = leaves * 500;

  const finalSalary = emp.basicSalary - deduction;

  res.json({
    basic: emp.basicSalary,
    leaves,
    deduction,
    finalSalary
  });
});

module.exports = router;
