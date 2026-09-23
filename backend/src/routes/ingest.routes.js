const express = require("express");

const router = express.Router();

const {
  triggerIngest,
  getIngestStatus,
} = require("../controllers/ingest.controller");

router.post("/trigger", triggerIngest);

router.get("/status/:jobId", getIngestStatus);

module.exports = router;