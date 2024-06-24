const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`${process.env.MONGOOSE_URL}/webhost`)

const websiteSchema = mongoose.Schema({
    websiteName : {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    defaultPageName: {
        type: String,
        trim: true,
        default: "index.html",
        required: true
    },
    visibility: {
        type: Boolean,
        default: true,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '/user',
        required: true
    },
    filePath: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('website', websiteSchema);