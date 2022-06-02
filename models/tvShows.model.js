const { Schema, model } = require("mongoose");

const schema = new Schema({
  displayPoster: { type: String, required: true },
  name: { type: String, required: true },
  ageLimit: { type: String, required: true },
  releaseYear: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  episodes: [{ type: Schema.Types.ObjectId, ref: "Episode", required: false }],
});

module.exports = model("TvShow", schema);
