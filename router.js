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
const authMiddleware = require("./middlewares/auth.md");
const addTvShow = require("./controllers/TvShows/addTvShow");
const addEpisode = require("./controllers/TvShows/episodes/addEpisodeToShow");
const getTvShow = require("./controllers/TvShows/getTvShow");
const addUserProfilePhoto = require("./controllers/User/addUserProfilePhoto");
const changePassword = require("./controllers/User/changePassword");

const router = Router();

const mediaFiles = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024 * 1024, // keep file size < 4 GB
  },
});

//for profile photo

const avatarFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // keep file size < 5MB
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

//user routes
router.post(
  "/user/addUserProfilePhoto",
  authMiddleware,
  avatarFile.single("avatar"),
  addUserProfilePhoto
);

router.post("/user/changePassword", authMiddleware, changePassword);

//movies routes

const multipleUpload = mediaFiles.fields([
  { name: "poster", maxCount: 1 },
  { name: "file" },
]);
router.get("/movies/getMovie", authMiddleware, getMovies);
router.post("/movies/addMovie", authMiddleware, multipleUpload, addMovie);

//tv shows routes
router.post("/tvShows/addTvshow", multipleUpload, addTvShow);
router.get("/tvShows/getTvShow", getTvShow);
//episodes routes
router.post("/tvShows/addEpisode", multipleUpload, addEpisode);

//category routes

router.get("/categories/getAllCategories", authMiddleware, getAllCategories);
router.get(
  "/categories/getMoviesByCategory",
  authMiddleware,
  getMoviesByCategory
);
router.get(
  "/categories/getTvShowsByCategory",
  authMiddleware,
  getTvShowsByCategory
);

module.exports = router;
