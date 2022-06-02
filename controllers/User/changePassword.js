const Error = require("../../utils/Error");
const UserModel = require("../../models/user.model");
const bcrypt = require("bcrypt");

const changePassword = async (req, res, next) => {
  try {
    const { password, previousPassword, userId } = req.body;

    if (!password || !userId) {
      throw new Error("Please provide the required fields", 400);
    }

    if (userId !== req.bearerId) {
      throw new Error("You are not authorized for this operation", 401);
    }
    const requiredUser = await UserModel.findById(userId);

    if (await bcrypt.compare(previousPassword, requiredUser.password)) {
      const hashPass = await bcrypt.hash(password, 10);
      requiredUser.password = hashPass;
      await requiredUser.save();

      return res.json({
        message: "Successful",
        result: {
          _id: requiredUser._id,
          email: requiredUser.email,
          fullName: requiredUser.fullName,
          isVerified: requiredUser.isVerified,
        },
      });
    } else {
      throw new Error("Invalid credentials", 401);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = changePassword;
