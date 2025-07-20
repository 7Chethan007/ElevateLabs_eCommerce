const mongoose = require('mongoose')
const { type } = require('os')

const categorySchema = new mongoose.Schema( {
    name : {
        type: String,
        required:true,
        trim:true,
        unquie:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Category", categorySchema)