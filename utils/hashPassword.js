const bcrypt = require('bcryptjs');

const hashPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10)
    hashed = await bcrypt.hash(password, salt)
    return hashed
};

module.exports = hashPassword;
