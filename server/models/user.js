const mongoose = require("mongoose");
const uniqueValidtor = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  posts: {
    type: Number
  },
  level: {
    type: Number
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    }
  ]
});

schema.plugin(uniqueValidtor);

module.exports = mongoose.model("User", schema);
