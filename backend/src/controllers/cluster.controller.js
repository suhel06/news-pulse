const mongoose = require("mongoose");

const Cluster = mongoose.model("Cluster");

const getClusters = async (req, res) => {
  try {
    const clusters = await Cluster.find();

    res.status(200).json({
      success: true,
      count: clusters.length,
      data: clusters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getClusterById = async (req, res) => {
  try {
    const cluster = await Cluster.findOne({
      cluster_id: Number(req.params.id),
    });

    if (!cluster) {
      return res.status(404).json({
        success: false,
        message: "Cluster not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cluster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getClusters,
  getClusterById,
};