const mongoose = require("mongoose");

const Cluster = mongoose.model("Cluster");

const getTimeline = async (req, res) => {
  try {
    const clusters = await Cluster.find();

    const timelineData = clusters.map((cluster) => {
      const dates = cluster.articles
        .map((article) => new Date(article.published))
        .filter((date) => !isNaN(date.getTime()));

      const startTime =
        dates.length > 0
          ? new Date(Math.min(...dates.map((date) => date.getTime())))
          : null;

      const endTime =
        dates.length > 0
          ? new Date(Math.max(...dates.map((date) => date.getTime())))
          : null;

      return {
        clusterId: cluster.cluster_id,
        label: `Cluster ${cluster.cluster_id}`,
        articleCount: cluster.size,
        startTime,
        endTime,
      };
    });

    res.status(200).json({
      success: true,
      count: timelineData.length,
      data: timelineData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTimeline,
};