const crypto = require('crypto');

//ENCYPTION
const hashString = (string) => crypto.createHash('md5').update(string).digest('hex');
module.exports = hashString;
