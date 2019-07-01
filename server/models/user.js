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
  }
});

schema.plugin(uniqueValidtor);

module.exports = mongoose.model("User", schema);
