const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`${process.env.MONGOOSE_URL}/webhost`)

const websiteSchema = mongoose.Schema({
    websiteName : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                // Custom validator to allow alphanumeric, '-', and '_'
                return /^[a-zA-Z0-9\-_]+$/.test(v);
            },
            message: props => `${props.value} can only contain alphanumeric characters, '-', and '_'`
        }
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
    },
    backUpPath: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('website', websiteSchema);