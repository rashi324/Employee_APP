const express = require("express");
const Leave = require("../models/Leave");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const leave = await Leave.create(req.body);
  res.json(leave);
});

router.put("/:id", auth, async (req, res) => {
  const updated = await Leave.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

router.get("/", auth, async (req, res) => {
  res.json(await Leave.find());
});

module.exports = router;
