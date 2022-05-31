const Error = require("../../utils/Error");
const MovieModel = require("../../models/movies.model");

const getMovies = async (req, res, next) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      throw new Error("Please provide a movie id", 400);
    }

    const requiredMovie = await MovieModel.findById(movieId);
    if (!requiredMovie) {
      throw new Error("The movie does not exist", 404);
    }
    return res.json({
      message: "Successful",
      result: requiredMovie,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = getMovies;
