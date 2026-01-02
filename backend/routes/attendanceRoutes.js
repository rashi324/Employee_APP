const express = require("express");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const record = await Attendance.create(req.body);
  res.json(record);
});

router.get("/", auth, async (req, res) => {
  const records = await Attendance.find();
  res.json(records);
});

module.exports = router;
