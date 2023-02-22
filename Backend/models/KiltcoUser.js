
const { Schema, model } = require("../db/connection"); // import Schema & model

const KiltcoUserSchema = new Schema({

    email: {
      type: String,
      required: true,
      unique: true
    },
    company: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  } , {
    
    collection: "KiltcoUser",
  });
  

  
  module.exports = model("KiltcoUser", KiltcoUserSchema);;