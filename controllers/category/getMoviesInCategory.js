const Error = require("../../utils/Error");
const CategoryModel = require("../../models/category.model");

const getMoviesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) throw new Error("Please provide a category id", 400);
    const requiredCategory = await CategoryModel.findById(categoryId).populate(
      "movies"
    );
    if (!requiredCategory) {
      throw new Error("The category does not exist", 404);
    }

    return res.json({
      message: "Successful",
      result: requiredCategory.movies,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = getMoviesByCategory;
