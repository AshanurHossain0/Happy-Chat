require('dotenv').config();
const connectDB=require('./config/db.js')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes=require('./routes/userRoutes.js')

const cors=require("cors");
const express=require('express');
const app=express();

connectDB();

app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).send({msg:"running..."})
})

app.use("/api/user",userRoutes);

app.use(notFound);
app.use(errorHandler);


const PORT=process.env.PORT || 5000;

app.listen(PORT, (err)=>{
    if(err) console.log(err.message);
    console.log(`server is running on port ${PORT}`);
})