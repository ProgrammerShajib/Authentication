const express = require("express");
const {
  loginUser,
  registerUser,
  changePassword,
} = require("../controller/auth-controller");


const authMiddleware = require("../middleware/auth-middleware")

const router = express.Router();

// all routes are related to authentication and autorization

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password",authMiddleware, changePassword);

module.exports = router;
