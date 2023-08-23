const mongoose=require('mongoose');

const connectDB= async ()=>{
    try{
        const connect=mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true});
        console.log(`MongoDB is connected : ${(await connect).connection.host}`);
    }
    catch(err){
        console.log(err.message);
        process.exit();
    }
}

module.exports=connectDB;