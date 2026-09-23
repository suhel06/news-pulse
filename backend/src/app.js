const express = require("express");
const cors = require("cors");

const articleRoutes = require("./routes/article.routes");
const clusterRoutes = require("./routes/cluster.routes");
const timelineRoutes = require("./routes/timeline.routes");
const ingestRoutes = require("./routes/ingest.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/clusters", clusterRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/ingest", ingestRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "News Pulse API Running",
  });
});

module.exports = app;