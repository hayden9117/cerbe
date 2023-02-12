const { Schema, model } = require("../db/connection");

const Request = new Schema(
  {
    reason: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    date: { type: Date },
  },
  {
    collection: "ClientRequests",
  }
);

module.exports = model("Request", Request);
