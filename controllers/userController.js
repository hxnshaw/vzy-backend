const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

//User Registration
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const alreadyRegistered = await User.findOne({ email });

    if (alreadyRegistered) {
      throw new CustomError.BadRequestError("Email is already registered");
    }

    const user = await User.create({ email, password });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new CustomError.BadRequestError(
        "Please provide email and password"
      );
    }
    const user = await User.findOne({ email });

    if (!user) throw new CustomError.BadRequestError("Not Found");

    const passwordIsCorrect = await user.comparePassword(password);

    if (!passwordIsCorrect) {
      throw new CustomError.BadRequestError("Invalid Credentials");
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw new CustomError.BadRequestError(
        "Oops! Please provide valid credentials"
      );
    }
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new CustomError.NotFoundError(`Student Not Found`);
    }
    user.email = email;
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  const { password, newPassword } = req.body;
  try {
    if (!password || !newPassword) {
      throw new CustomError.BadRequestError(
        "Oops! Please provide valid credentials"
      );
    }
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      throw new CustomError.NotFoundError(`User Not Found`);
    }

    const passwordIsCorrect = await user.comparePassword(password);
    if (!passwordIsCorrect) {
      throw new CustomError.BadRequestError("Invalid Credentials");
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "new password saved" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
