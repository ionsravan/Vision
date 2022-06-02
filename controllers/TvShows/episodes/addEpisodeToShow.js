const Error = require("../../../utils/Error");
const TvShowModel = require("../../../models/tvShows.model");
const EpisodeModel = require("../../../models/episodes.model");
const uuid = require("uuid").v4;

const { upload } = require("../../../S3");

const addEpisodeToShow = async (req, res, next) => {
  try {
    const { name, description, tvShowId } = req.body;

    if (!name || !description || !tvShowId) {
      throw new Error("Please provide the required fields", 400);
    }

    const requiredShow = await TvShowModel.findById(tvShowId);

    if (!requiredShow) {
      throw new Error("The show does not exist", 404);
    }

    const episodeFile = req?.files?.file?.[0];
    const episodePoster = req?.files?.poster?.[0];

    if (!episodeFile) {
      throw new Error("Please provide a episode file", 400);
    }

    if (!episodePoster) {
      throw new Error("Please provide  a episode poster", 400);
    }

    let episodeUrl = null;
    let posterUrl = null;

    if (episodeFile) {
      const filesNameSplit = episodeFile.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `tvShows/episodes/mediaFile/${fileName}_${uuid()}.${extension}`,
        Body: episodeFile.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        episodeUrl = response.Location;
      }
    }

    if (episodePoster) {
      const filesNameSplit = episodePoster.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `tvShows/episodes/posters/${fileName}_${uuid()}.${extension}`,
        Body: episodePoster.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        posterUrl = response.Location;
      }
    }

    const newEpisode = new EpisodeModel({
      displayPoster: posterUrl,
      episodeUrl: episodeUrl,
      name,
      description,
    });
    await newEpisode.save();
    requiredShow.episodes.push(newEpisode);
    await requiredShow.save();

    return res.json({
      message: "Successful",
      result: newEpisode,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = addEpisodeToShow;
