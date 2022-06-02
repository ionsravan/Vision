const Error = require("../../utils/Error");
const UserModel = require("../../models/user.model");
const uuid = require("uuid").v4;
const { upload } = require("../../S3");

const addUserProfilePhoto = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error("Please provide a user id", 400);
    }
    if (userId !== req?.bearerId) {
      throw new Error("You are not authorized", 401);
    }
    const avatarFile = req.file;

    if (!avatarFile) {
      throw new Error("Please provide a file", 400);
    }

    let profilePhotoUrl = null;

    if (avatarFile) {
      const filesNameSplit = avatarFile.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `user/profilePhoto/${fileName}_${uuid()}.${extension}`,
        Body: avatarFile.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        profilePhotoUrl = response.Location;
      }
    }
    if (!profilePhotoUrl) {
      throw new Error("Failed to upload profile photo", 500);
    }

    const requiredUser = await UserModel.findById(userId).select(
      "-password -code "
    );
    requiredUser.profilePhoto = profilePhotoUrl;
    await requiredUser.save();

    return res.json({
      message: "Successful",
      result: requiredUser,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = addUserProfilePhoto;
