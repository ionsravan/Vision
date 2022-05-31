const Error = require("../../utils/Error");
const UserModel = require("../../models/user.model");
const bcrypt = require("bcrypt");
const sendEmail = require("../../utils/sendInBlueConfig");

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

    //generate code to send in email....
    let randomCode = Math.floor(Math.random() * 90000) + 10000;
    await sendEmail(email, fullName, randomCode);
    let currentTime = Math.floor(Date.now() / 1000);

    const newUser = new UserModel({
      email,
      fullName,
      password: hashPass,
      isVerified: false,
      code: {
        value: randomCode,
        creationTime: currentTime,
      },
    });
    await newUser.save();

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
    // console.log(error);
    return next(error);
  }
};

module.exports = signup;
