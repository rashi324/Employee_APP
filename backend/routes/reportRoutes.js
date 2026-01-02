const express = require("express");
const Employee = require("../models/Employee");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/employees", auth, async (req, res) => {
  const data = await Employee.find();
  res.json(data);
});

module.exports = router;
