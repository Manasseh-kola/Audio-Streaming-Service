const bcrypt = require("bcryptjs");

const comparePassword = async function (canditatePassword, hashedPassword) {
  const isMatch = await bcrypt.compare(canditatePassword, hashedPassword);
  return isMatch;
};

module.exports = comparePassword;
