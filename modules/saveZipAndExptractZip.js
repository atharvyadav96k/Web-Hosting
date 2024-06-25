const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define where to store the uploaded files
        const path = 'uploads/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        // Generate a unique name for each file
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
const extractZip = (name, path)=>{
    const zip = new AdmZip(path);
    zip.extractAllTo(`./public/websites/${name.split('.')[0]}`);
    return `/public/websites/${name}`
}
module.exports = {upload, extractZip};