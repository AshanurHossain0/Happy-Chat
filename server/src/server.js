require('dotenv').config();
const cors=require("cors");
const express=require('express');
const app=express();

app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).send({msg:"running..."})
})



const PORT=process.env.PORT || 5000;

app.listen(PORT, (err)=>{
    if(err) console.log(err.message);
    console.log(`server is running on port ${PORT}`);
})