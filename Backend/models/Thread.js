const { Schema, model } = require("../db/connection");

const Thread = new Schema(
  {
    project_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    threadname: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },
    replys: [],
    postdate: { type: Date },
    lastUpdated: { type: Date },
  },
  {
    collection: "Threads",
  }
);

module.exports = model("Thread", Thread);
