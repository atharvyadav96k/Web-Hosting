const express = require('express')
const app = express();
const fs = require('fs');
const bcrypt = require('bcrypt')
const websiteSchema = require('./modules/website')
const userSchema = require('./modules/user')
const filerHandel = require('./modules/saveZipAndExptractZip');
const genPath = require('./modules/generatePathOfSource')
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
app.get('/create/website', function (req, res) {
    res.render('upload')
})
app.post('/create/website', filerHandel.upload.single('folder'), async function (req, res) {
    let filePath = '';
    try {
        filePath = await filerHandel.extractZip(req.file.filename, req.file.path);
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Side error can't store file")
    }
    try {
        const website = await websiteSchema({
            websiteName: req.file.filename.split('.')[0],
            defaultPageName: 'index.html',
            owner: '6679b23fad15d5ff435f2197',
            visibility: true,
            filePath: filePath.split('.')[0],
            backUpPath: req.file.path
        })
        await website.save();
        res.send(website);
    } catch (err) {
        res.send(err)
    }

});
app.get('/:websitedomain/webhost.web.app', async function (req, res) {
    try {
        const website = await websiteSchema.findOne({ websiteName: req.params.websitedomain });
        if(!website){
            return res.status(404).render('error')
        }
        if(website.visibility){
            fs.readFile(`.${website.filePath}/public/${website.defaultPageName}`, (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                if (data) {
                    console.log(data)
                    res.end(data)
                } else {
                    res.render("error")
                }
            })
        }else{
            res.render('error')
        }
        
    } catch (err) {
        res.status(400).send(err)
    }

});
app.get('*', async function (req, res) {
    console.log(`Url: ${req.url}`)
    console.log(req.url.split('/')[1])
    try {
        const website = await websiteSchema.findOne({
            websiteName: req.url.split('/')[1]
        })
        console.log(`FIle path ${website.filePath}/public${genPath(req.url)}`)
        fs.readFile(`.${website.filePath}/public${genPath(req.url)}`, 'utf-8', (err, data) => {
            if (err) {
                console.log(err)
                return res.status(400).send({ success: false, message: "not found" });
            }
            if (data) {
                console.log(data)
                res.end(data);
            } else {
                res.render('error')
            }
        })
    } catch (err) {
        res.render("error")
    }
})
app.listen(process.env.PORT);