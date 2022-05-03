const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const crypto = require("crypto");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  hashPassword,
  comparePassword,
} = require("../utils");

//REGISTER NEW USER
const signUp = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new BadRequestError("Email already exists");
  }

  const password = await hashPassword(req.body.password);
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({ ...req.body, verificationToken, password });
  if (!user) {
    throw new UnauthenticatedError("Please choose another user name");
  }

  // SEND VERIFICATION EMAIL
  const origin = process.env.FRONTEND_ORIGIN;
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
  });
};

//VERIFY USER EMAIL
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new UnauthenticatedError("Verification Failed");
  }

  console.log(user.verificationToken);
  console.log(verificationToken);
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification Failed");
  }

  user.isVerified = true;
  user.verifiedDate = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ verificationToken, email });
};

//USER LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  //VALIDATE USER
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  if (!user) {
    throw new UnauthenticatedError("Invalid email");
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError(
      "Please click on the verification link in your email."
    );
  }

  const isPasswordCorrect = comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }

  //CREATE TOKENS
  const tokenUser = createTokenUser(user);
  let refreshToken = "";
  const existingToken = await Token.findOne({ where: { email: user.email } });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("Authentification failed");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id, email };

  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//USER LOGOUT
const logout = async (req, res) => {
  await Token.destroy({
    where: {
      user: req.user.userId,
    },
  });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

//FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }

  const user = await User.findOne({ where: { email } });
  if (user) {
    //SEND RESET PASSWORD LINK
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = process.env.FRONTEND_ORIGIN;
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpiration = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

//RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ where: { email } });

  if (user) {
    const currentDate = new Date();
    const encyptedPassword = await hashPassword(password);
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpiration > currentDate
    ) {
      user.password = encyptedPassword;
      user.passwordToken = null;
      user.passwordTokenExpiration = null;
      await user.save();
    }
  }

  res.send("Password successfully changed");
};

module.exports = {
  login,
  signUp,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
};
