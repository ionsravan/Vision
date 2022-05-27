const Error = require("../../utils/Error");
const UserModel = require("../../models/user.model");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const { OauthId, email, fullName } = req.body;
    if (!OauthId || !email || !fullName) {
      throw new Error("Required fields missing", 400);
    }

    const exestingUser = await UserModel.findOne({ email: email });

    if (exestingUser) {
      const token = jwt.sign(
        {
          id: exestingUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).json({
        message: "Successful",
        token,
      });
    } else {
      const newUser = new UserModel({
        email: email,
        fullName: fullName,
        OauthId: OauthId,
        isVerified: true,
      });
      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({
        message: "Authentication successful",
        token,
      });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;
