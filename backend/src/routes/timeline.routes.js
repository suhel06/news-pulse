const express = require("express");

const router = express.Router();

const {
  getTimeline,
} = require("../controllers/timeline.controller");

router.get("/", getTimeline);

module.exports = router;