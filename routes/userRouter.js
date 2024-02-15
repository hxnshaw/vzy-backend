const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  updateUserPassword,
} = require("../controllers/userController");
const {
  authenticateUser,
} = require("../middlewares/authentication");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.route("/profile/update-profile").put(authenticateUser,updateUserProfile) ;
router.route("/profile/update-password").put(authenticateUser,updateUserPassword) ;

module.exports = router;
