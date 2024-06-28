const jwt = require('jsonwebtoken')
const getToken = (userName, password) => {
    const token = jwt.sign({ userName, password }, process.env.JWT_SECRET);
    return token;
}
module.exports = getToken;