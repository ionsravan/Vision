const { Schema, model } = require("mongoose");

const schema = new Schema({
  displayPoster: { type: String, required: true },
  name: { type: String, required: true },
  releaseYear: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = model("TvShow", schema);
