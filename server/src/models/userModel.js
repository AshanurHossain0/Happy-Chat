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
    }
})

userSchema.methods.matchPassword= async function(pass){
    return await bcrypt.compare(pass,this.password);
}


userSchema.pre('save',async function (next){
    if(! this.isModified){
        next();
    }

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

module.exports=mongoose.model("User",userSchema);