const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
      unique: true,
    },

    source: {
      type: String,
      required: true,
    },

    published: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);