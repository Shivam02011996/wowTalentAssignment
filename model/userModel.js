const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true, required: 'Email address is required'
    },


    phone: {
        trim: true,
        type: String,
        required: 'Intern mobile is required', unique: true
    },

    password: {
        type: String,
        required: true
    },



}, { timestamps: true });

module.exports = mongoose.model("userInfo", userSchema)
