const mongoose = require("mongoose");

const userModel=mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    pic:{
        type:String,
        trim:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
})

module.exports=mongoose.model("User",userModel);