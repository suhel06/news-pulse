const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema(
  {
    cluster_id: Number,
    size: Number,
    articles: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cluster", clusterSchema);