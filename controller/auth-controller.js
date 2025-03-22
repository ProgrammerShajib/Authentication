const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Controller
const registerUser = async (req, res) => {
  try {
    // Extract user information
    const { username, email, password, role } = req.body;

    // Check if the user already exists
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username.",
      });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user and save it to the database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newlyCreatedUser._id,
        username: newlyCreatedUser.username,
        email: newlyCreatedUser.email,
        role: newlyCreatedUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to register user! Please try again.",
    });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  try {
    // Extract user credentials
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username }); // 🛠️ FIXED: Corrected findOne() syntax

    if (!user) {
      return res.status(400).json({
        success: false, // 🛠️ FIXED: Changed `true` to `false`
        message: "Invalid credentials!", // 🛠️ FIXED: Corrected message wording
      });
    }

    // Compare entered password with stored hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false, // 🛠️ FIXED: Changed `true` to `false`
        message: "Incorrect password!", // 🛠️ FIXED: More accurate error message
      });
    }

    // Ensure JWT_SECRET_KEY is defined
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is missing in environment variables!");
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred! Please try again.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // extract old and new password from req body
    const { oldPassword, newPassword } = req.body;

    // find the current logged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the old password is correct

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct! Please try again.",
      });
    }

    // hash the new Password

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // update user password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });



  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred! Please try again.",
    });
  }
};

module.exports = { loginUser, registerUser, changePassword };
