const userModel = require('../modules/user');

const addAuthorToRequest = (req, res, next)=>{
    console.log("I got username ", req.auth.username);
    next();
}
module.exports = addAuthorToRequest;