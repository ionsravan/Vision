const Error = require("../../utils/Error");
const MovieModel = require("../../models/movies.model");
const CategoryModel = require("../../models/category.model");
const uuid = require("uuid").v4;
const { upload } = require("../../S3");

const addMovies = async (req, res, next) => {
  try {
    const { name, releaseYear, description, ageLimit } = req.body;
    const category = req.body.category?.toUpperCase();

    if (!name || !releaseYear || !category || !description || !ageLimit) {
      throw new Error("Required parameters missing", 400);
    }

    const movieFile = req?.files?.file?.[0];
    const moviePoster = req?.files?.poster?.[0];

    if (!movieFile) {
      throw new Error("Please provide a movie file", 400);
    }

    if (!moviePoster) {
      throw new Error("Please provide  a movie poster", 400);
    }

    let movieUrl = null;
    let posterUrl = null;

    if (movieFile) {
      const filesNameSplit = movieFile.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `movies/mediaFiles/${fileName}_${uuid()}.${extension}`,
        Body: movieFile.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        movieUrl = response.Location;
      }
    }

    if (moviePoster) {
      const filesNameSplit = moviePoster.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `movies/posters/${fileName}_${uuid()}.${extension}`,
        Body: moviePoster.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        posterUrl = response.Location;
      }
    }

    const movieCategory = await CategoryModel.findOne({ name: category });

    const newMovie = new MovieModel({
      displayPoster: posterUrl,
      movieUrl: movieUrl,
      name,
      ageLimit,
      releaseYear,
      description,
      category,
    });
    await newMovie.save();

    if (movieCategory) {
      //add movie to this category
      movieCategory.movies.push(newMovie);
      await movieCategory.save();
    } else {
      //create a new category with the category name and add movie to it
      const newCategory = new CategoryModel({
        name: category,
        movies: [],
        tvShows: [],
      });

      newCategory.movies.push(newMovie);
      await newCategory.save();
    }

    return res.json({
      message: "Successful",
      result: newMovie,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = addMovies;
