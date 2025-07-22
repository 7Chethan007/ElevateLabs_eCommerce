const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['viewer', 'manager', 'admin'],
        default: 'viewer', // viewer (analytics only), manager (order/product), admin (full control)
    },
    permissions: {
        type: Array,
        default: ['view_products']
    },
    cart:{
        type:Array,
        default: [],
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);