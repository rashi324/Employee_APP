const express = require("express");
const Employee = require("../models/Employee");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE
router.post("/", auth, async (req, res) => {
  const employee = await Employee.create(req.body);
  res.json(employee);
});

// READ
router.get("/", auth, async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

module.exports = router;
