const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true, // Corrected from 'require' to 'required'
        trim: true,
        minlength: 4,
        unique: true
    },
    password: {
        type: String,
        required: true, // Corrected from 'require' to 'required'
        trim: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true, // Corrected from 'require' to 'required'
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true, // Corrected from 'require' to 'required'
        unique: true,
        match: [/^\d{10}$/] // This line seems fine as it is, ensuring phone numbers are exactly 10 digits long.
    },
    websites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: '/website'
        }
    ]
})

module.exports = mongoose.model('user', userSchema);