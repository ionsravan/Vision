const Error = require("../../utils/Error");
const AdminModel = require("../../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Required fields missing", 400);
    }

    const requiredAdmin = await AdminModel.findOne({ email: email });
    if (!requiredAdmin) {
      throw new Error("No user with this email exist, please signup", 404);
    }

    if (await bcrypt.compare(password, requiredAdmin.password)) {
      const token = jwt.sign(
        {
          id: requiredAdmin._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.json({
        message: "Successful",
        result: {
          _id: requiredAdmin._id,
          email: requiredAdmin.email,
          fullName: requiredAdmin.fullName,
        },
        token: token,
      });
    } else {
      throw new Error("Invalid credentials", 401);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = login;
