const express = require('express')
const app = express();
const fs = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const websiteSchema = require('./modules/website')
const userSchema = require('./modules/user')
const filerHandel = require('./modules/saveZipAndExptractZip');
const genPath = require('./modules/generatePathOfSource')
const isAuthenticated = require('./middleware/isAuthencated')
require('dotenv').config();

app.use(express.static('public'))
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', function (req, res) {
    res.send("Working")
})
app.get('/change/domain', function (req, res) {
    res.render('domainchange')
})
app.post('/delete/website', isAuthenticated, async function (req, res) {
    try {
        const website = await websiteSchema.findOne({ websiteName: req.body.websiteName }); // Using query parameter for simplicity
        if (!website) {
            return res.status(404).send({ message: "Website not found" });
        }
        const user = await userSchema.findOneAndUpdate({ _id: website.owner },
            { $pull: { websites: website._id } }
        );
        res.status(200).send(website);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
})
app.post('/change/domain/', isAuthenticated, async function (req, res) {
    try {
        const updatedWebsite = await websiteSchema.findOneAndUpdate(
            { websiteName: req.body.oldName },
            { websiteName: req.body.newName }, // Corrected field name
            { new: true, runValidators: true }
        );

        if (!updatedWebsite) {
            return res.status(404).send("Website not found");
        }

        res.status(200).send(updatedWebsite);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the website domain.");
    }
})
app.post('/change/visibility', isAuthenticated, async function (req, res) {
    try {
        const { websiteName, visibility } = req.body;
        const website = await websiteSchema.findOneAndUpdate({ websiteName: websiteName }, { $set: { visibility: visibility } }, { new: true });
        res.send(website);
    } catch (err) {
        res.send(err)
    }

})
app.post('/register', async function (req, res) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const { userName, password, email, phoneNumber } = req.body;
        const user = await userSchema.create({
            userName,
            password: hash,
            email,
            phoneNumber
        });
        const token = jwt.sign({ userName, password }, process.env.JWT_SECRET);
        res.cookie("secret", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.status(201).send(token); // Send the saved user object
    } catch (err) {
        res.status(500).send({ message: err.message }); // Send a generic error message
    }
})
app.post('/login', async function (req, res) {
    const { userName, password } = req.body;
    try {
        const user = await userSchema.findOne({ userName });
        if (!user) {
            return res.status(400).send("Enter Valid details");
        }
        if (bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userName, password }, process.env.JWT_SECRET);
            res.cookie("secret", token, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            res.status(200).send(token);
        }
    }catch(err){
        res.status(500).send(err.message);
    }
    
})
app.get('/create/website', isAuthenticated, function (req, res) {
    console.log(req.auth.userName)
    res.render('upload')
})
app.post('/create/website', isAuthenticated, filerHandel.upload.single('folder'), async function (req, res) {
    let filePath = '';
    try {
        filePath = await filerHandel.extractZip(req.file.filename, req.file.path);
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Side error can't store file")
    }
    try {
        const userData = await userSchema.findOne({ userName: req.body.userName });
        if (userData) {
            const website = await websiteSchema({
                websiteName: req.file.filename.split('.')[0],
                defaultPageName: req.body.defaultPageName,
                owner: userData._id,
                visibility: true,
                filePath: filePath.split('.')[0],
                backUpPath: req.file.path
            })
            userData.websites.push(website._id);
            await website.save();
            await userData.save();
            return res.send(website);
        } else {
            return res.send("user  Not found")
        }

    } catch (err) {
        res.send(err)
    }

});
app.get('/:websitedomain/webhost.web.app', async function (req, res) {
    try {
        const website = await websiteSchema.findOne({ websiteName: req.params.websitedomain });
        if (!website) {
            return res.status(404).render('error')
        }
        if (website.visibility) {
            fs.readFile(`.${website.filePath}/public/${website.defaultPageName}`, (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                if (data) {
                    // console.log(data)
                    res.end(data)
                } else {
                    res.render("error")
                }
            })
        } else {
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
                res.end(data);
            } else {
                res.render('error')
            }
        })
    } catch (err) {
        res.render("error")
    }
});
app.listen(process.env.PORT);