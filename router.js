const { Router } = require("express");
const multer = require("multer");

const router = Router();

const formData = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // keep file size < 200 MB
  },
});

//initial route
router.get("/", (req, res) => {
  res.send("welcome to Vision!");
});

module.exports = router;
