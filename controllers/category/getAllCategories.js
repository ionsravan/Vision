const Error = require("../../utils/Error");
const MovieModel = require("../../models/movies.model");
const CategoryModel = require("../../models/category.model");

const getAllCategories = async (req, res, next) => {
  try {
    const allCategories = await CategoryModel.find();
    if (!allCategories) {
      throw new Error("No category exists", 404);
    }

    return res.json({
      message: "Successful",
      result: allCategories,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = getAllCategories;
