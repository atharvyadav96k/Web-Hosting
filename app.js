const express = require('express')
const app = express();
const fs = require('fs');
const bcrypt = require('bcrypt')
const websiteSchema = require('./modules/website')
const userSchema = require('./modules/user')
require('dotenv').config();

app.use(express.static('public'))
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.send("Working")
})
app.get('/username/:projectname', function (req, res) {

});
app.post('/user/create', async function (req, res) {
    let password = '';
    try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(req.body.password, salt);

        const user = new userSchema({
            userName: req.body.userName,
            password: password,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        });

        await user.save();
        res.status(201).send(user); // Send the saved user object
    } catch (err) {
        res.status(500).send({ message: 'An error occurred during registration' }); // Send a generic error message
    }
    
})
app.post('/create/website', async function (req, res) {
    const d = new Date();
    try{
        const website = await websiteSchema({
            websiteName: req.body.websiteName,
            defaultPageName: req.body.defaultPage,
            owner: req.body.owner,
            visibility: req.body.visibility,
            filePath: `./public/${d.getDate()}-${d.getMonth()}-${d.getFullYear()}-${d.getTime()}-${req.body.websiteName}`
        })
        await website.save();
        res.send(website);
    }catch(err){
        res.send(err)
    }
    
});
app.get('/:websitedomain/webhost.web.app', function (req, res) {
    fs.readFile(`./public/${req.params.websitedomain}/index.html`, 'utf-8', (err, data) => {
        if (err) return res.send("Website not found")
        res.send(data);
    });

});
app.listen(process.env.PORT);