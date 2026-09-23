const express = require("express");
const router = express.Router();

const {
  getClusters,
} = require("../controllers/cluster.controller");

const {
  getTimeline,
} = require("../controllers/timeline.controller");

const {
  
  getClusterById,
} = require("../controllers/cluster.controller");

router.get("/", getClusters);

router.get("/timeline", getTimeline);
router.get("/:id", getClusterById);

module.exports = router;