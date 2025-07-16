const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: Number,
        default: 0, // 0 for user, 1 for admin,
    },
    cart:{
        types:Array,
        default: [],
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);