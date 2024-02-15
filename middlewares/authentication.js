const CustomError = require("../errors");
const { isValidToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("INVALID AUTHENTICATION");
  }

  try {
    const { email } = isValidToken({
      token,
    });
    req.user = {
      email,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("INVALID AUTHENTICATION");
    //res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

module.exports = {
  authenticateUser,
};
