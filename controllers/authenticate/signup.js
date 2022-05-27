const Error = require("../../utils/Error");
const UserModel = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      throw new Error("Required fields missing", 400);
    }

    const exestingUser = await UserModel.findOne({ email: email });
    if (exestingUser) {
      throw new Error("Email already exists, please login", 401);
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      fullName,
      password: hashPass,
      isVerified: false,
    });
    await newUser.save();

    // const token = jwt.sign(
    //   {
    //     id: newUser._id,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d",
    //   }
    // );

    return res.status(200).json({
      message: "Successful",
      result: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = signup;
