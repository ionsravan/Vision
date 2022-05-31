const { Schema, model, Mongoose } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  movies: [{ type: Schema.Types.ObjectId, ref: "Movie", required: false }],
  tvShows: [{ type: Schema.Types.ObjectId, ref: "TvShow", required: false }],
});

module.exports = model("Category", schema);
