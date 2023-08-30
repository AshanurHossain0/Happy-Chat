const nodemailer=require('nodemailer')

const mailUser=async function(msgBody){
    try{
        let config={
            service:'gmail',
            auth:{
                user:process.env.GMAIL,
                pass:process.env.PASS
            }
        }
        let transporter=nodemailer.createTransport(config);
        await transporter.sendMail(msgBody);
    }
    catch(err){
        throw new Error(err.message);
    }
}

module.exports=mailUser;