const { Schema, model } = require("../db/connection"); // import Schema & model

// User Schema
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Client", "Maintainer", "Admin"],
    },
    date: { type: Date },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project",  }],
  },
  {
    collection: "Users",
  }
);

// User model
const User = model("User", UserSchema);

module.exports = User;
