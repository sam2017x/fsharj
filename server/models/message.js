const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  message: {
    type: String
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  timestamp: {
    type: Date
  }
});

module.exports = mongoose.model("Message", schema);
