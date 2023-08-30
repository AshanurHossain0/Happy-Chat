const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        unique:true,
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
    },
    active:{
        type:Boolean,
        default:false
    },
    otp:{
        type:Number,
    },
    createdAt:{
        type:Number
    }
})

userSchema.methods.matchPassword= async function(pass){
    return await bcrypt.compare(pass,this.password);
}


module.exports=mongoose.model("User",userSchema);