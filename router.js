const { Router } = require("express");
const multer = require("multer");
const userSignup = require("./controllers/authenticate/signup");
const userLogin = require("./controllers/authenticate/login");
const userVerifyEmail = require("./controllers/authenticate/verifyEmail");
const getMovies = require("./controllers/movies/getMovies");
const addMovie = require("./controllers/movies/addMovies");
const getAllCategories = require("./controllers/category/getAllCategories");
const getMoviesByCategory = require("./controllers/category/getMoviesInCategory");
const getTvShowsByCategory = require("./controllers/category/getTvShowsInCategory");

const router = Router();

const mediaFiles = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4000 * 1024 * 1024, // keep file size < 200 MB
  },
});

//initial route
router.get("/", (req, res) => {
  res.send("welcome to Vision!");
});

//auth routes
router.post("/signup", userSignup);
router.post("/verifyEmail", userVerifyEmail);
router.post("/login", userLogin);

//movies routes

const multipleUpload = mediaFiles.fields([
  { name: "poster", maxCount: 1 },
  { name: "file" },
]);
router.get("/movies/getMovie", getMovies);
router.post("/movies/addMovie", multipleUpload, addMovie);

//category routes
router.get("/categories/getAllCategories", getAllCategories);
router.get("/categories/getMoviesByCategory", getMoviesByCategory);
router.get("/categories/getTvShowsByCategory", getTvShowsByCategory);

module.exports = router;
