const Error = require("../../utils/Error");
const TvShowModel = require("../../models/tvShows.model");

const getTvShow = async (req, res, next) => {
  try {
    const { tvShowId } = req.body;
    if (!tvShowId) {
      throw new Error("Please provide a tv show id", 400);
    }

    const requiredTvShow = await TvShowModel.findById(tvShowId);
    if (!requiredTvShow) {
      throw new Error("The show does not exist", 404);
    }
    await requiredTvShow.populate("episodes");
    // console.log(requiredTvShow);

    return res.json({
      message: "Successful",
      result: requiredTvShow,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = getTvShow;
