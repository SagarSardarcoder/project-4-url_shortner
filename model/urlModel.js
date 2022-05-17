const mongoose = require('mongoose')

const urlschema = new mongoose.Schema({
    urlCode:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    longURL:{
        type:String,
        required:true,
        trim:true
    },
    shortURL:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    }
},{timestamps:true})

module.exports = mongoose.model('url',  urlschema)