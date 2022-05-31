const Error = require("../../utils/Error");
const UserModel = require("../../models/user.model");
const jwt = require("jsonwebtoken");

const verifyEmail = async (req, res, next) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) throw new Error("Required field missing", 400);

    const requiredUser = await UserModel.findById(userId);

    if (!requiredUser) throw new Error("The user does not exist", 404);

    let currentTime = Math.floor(Date.now() / 1000);

    if (
      requiredUser?.code?.value !== code ||
      currentTime - 300 > requiredUser?.code?.creationTime
    ) {
      throw new Error("Code is invalid or has expired please try again", 400);
    }

    const token = jwt.sign(
      {
        id: requiredUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    requiredUser.isVerified = true;
    await requiredUser.save();

    return res.status(200).json({
      message: "Login successful",
      result: {
        _id: requiredUser._id,
        email: requiredUser.email,
        fullName: requiredUser.fullName,
        isVerified: requiredUser.isVerified,
      },
      token: token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = verifyEmail;
