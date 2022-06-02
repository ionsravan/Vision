const Error = require("../../utils/Error");
const TvShowModel = require("../../models/tvShows.model");
const CategoryModel = require("../../models/category.model");
const uuid = require("uuid").v4;
const { upload } = require("../../S3");

const addTvShow = async (req, res, next) => {
  try {
    const { name, releaseYear, description, ageLimit } = req.body;
    const category = req.body.category?.toUpperCase();

    if (!name || !releaseYear || !description || !category || !ageLimit) {
      throw new Error("Please provide the required field", 400);
    }
    const tvShowPoster = req?.files?.poster?.[0];
    if (!tvShowPoster) {
      throw new Error("Please provide  a tv show poster", 400);
    }

    let posterUrl = null;

    if (tvShowPoster) {
      const filesNameSplit = tvShowPoster.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `tvShows/posters/${fileName}_${uuid()}.${extension}`,
        Body: tvShowPoster.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        posterUrl = response.Location;
      }
    }

    const tvShowCategory = await CategoryModel.findOne({ name: category });

    const newTvShow = new TvShowModel({
      displayPoster: posterUrl,
      name,
      description,
      releaseYear,
      ageLimit,
      category,
      episodes: [],
    });
    await newTvShow.save();

    if (tvShowCategory) {
      //add movie to this category
      tvShowCategory.tvShows.push(newTvShow);
      await tvShowCategory.save();
    } else {
      //create a new category with the category name and add movie to it
      const newCategory = new CategoryModel({
        name: category,
        movies: [],
        tvShows: [],
      });

      newCategory.tvShows.push(newTvShow);
      await newCategory.save();
    }

    return res.json({
      message: "Successful",
      result: newTvShow,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = addTvShow;
