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
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  }
});

module.exports = mongoose.model("Message", schema);
