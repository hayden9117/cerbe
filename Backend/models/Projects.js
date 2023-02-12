const { Schema, model } = require("../db/connection");

const Project = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    projectname: {
      type: String,
    },
    status: {
      type: String,
      enum: ["in progress", "awaiting review", "awaiting response", "complete"],
    },
    needsReview: {
      type: Boolean,
    },
    threads: [],
    startDate: { type: Date },
    lastUpdated: { type: Date },
  },
  {
    collection: "Projects",
  }
);

module.exports = model("Project", Project);
