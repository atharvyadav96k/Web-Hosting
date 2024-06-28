const jwt = require('jsonwebtoken');
const userModel = require('../modules/user')
const bcrypt = require('bcrypt');

const isAuthenticated = async function (req, res, next) {
    try {
        const data = jwt.decode(req.cookies.secret, process.env.JWT_SECRET);
        if (!data) {
            return res.redirect('/login');
        }
        console.log(data)
        const user = await userModel.findOne({ userName: data.userName });
        if (!user) {
            return res.redirect('/login');
        }
        if (bcrypt.compare(data.password, user.password)) {
            req.auth = req.auth || {};
            req.auth.userName = data.userName;
            next();
        } else {
            res.status(300).send("failed to login")
        }
    }catch(err){
        res.status(500).send("Server Side error")
    }
}
module.exports = isAuthenticated;