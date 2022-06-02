const { Schema, model } = require("mongoose");

const schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  profilePhoto: { type: String, required: false },
  fullName: {
    type: String,
    required: true,
  },
  code: {
    value: {
      type: String,
    },
    creationTime: {
      type: String,
    },
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  OauthId: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
});

module.exports = model("User", schema);
