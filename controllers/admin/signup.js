const Error = require("../../utils/Error");
const AdminModel = require("../../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      throw new Error("Required fields missing", 400);
    }

    const requiredAdmin = await AdminModel.findOne({ email: email });
    if (requiredAdmin) {
      throw new Error("Email already exists, please login", 401);
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({
      fullName: fullName,
      email: email,
      password: hashPass,
    });

    await newAdmin.save();

    const token = jwt.sign(
      {
        id: newAdmin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Successful",
      result: {
        _id: newAdmin._id,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
      },
      token: token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = signup;
