const { Schema, model } = require("../db/connection");

const Roles = new Schema(
  {
    role_name: { type: String },
    actions: [{ type: String }],
  },
  {
    collection: "Users",
  }
);

module.exports = model("Roles", Roles);
