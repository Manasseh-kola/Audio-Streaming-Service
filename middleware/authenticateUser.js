const { BadRequestError, UnauthenticatedError } = require("../errors");
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");

//AUTHENTIFICATE ROUTES
const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);
    const existingToken = await Token.findOne({
      where: {
        user: payload.user.email,
        refreshToken: payload.refreshToken,
      },
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Failed");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Failed");
  }
};

module.exports = {
  authenticateUser,
};
