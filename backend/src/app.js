const express = require("express");
const cors = require("cors");

const articleRoutes = require("./routes/article.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "News Pulse API Running",
  });
});

module.exports = app;