const asyncHandler = require('express-async-handler')
const UserModel = require('../models/userModel');
const generateToken = require('../config/generateToken.js');
const bcrypt = require('bcryptjs');
const otpGntr = require('otp-generator');
const mailUser = require('../mail/mail.js');

const register = asyncHandler(async (req, res) => {
    let { name, email, password, pic } = req.body;
    email = email.toLowerCase();

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the mandatory fields")
    }
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
        if (userExist.active) {
            res.status(400);
            throw new Error("User already exists")
        }
        await UserModel.findByIdAndDelete(userExist._id);
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const userData = { name, email, password }
    if (pic) userData.pic = pic;

    const otp = await otpGntr.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    userData.otp = otp;
    userData.createdAt=Date.now();
    const user = await UserModel.create(userData);

    const msgBody = {
        from: process.env.GMAIL,
        to: email,
        subject: `Your email verification otp for Happy-To-Chat is ${otp} ,thank you :)`,
        body: `otp is ${otp}`
    }
    await mailUser(msgBody);

    if (user) {
        const token = generateToken(user._id);
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, pic: user.pic, token })
    }
    else {
        res.status(400);
        throw new Error("User creation failed");
    }
})

const authUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await UserModel.findOne({ email,active:true });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const allUsers = asyncHandler(async (req, res) => {
    const searchQuery = req.query.search
        ? {
            active:true,
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await UserModel.find(searchQuery).find({ _id: { $ne: req.user._id } }).select({ password: 0, otp: 0, active: 0,createdAt:0 });
    res.status(200).send(users);
})

const verifyOtp = asyncHandler(async function (req, res) {
    const { otp, email } = req.body;
    const user = await UserModel.findOne({ email: email, active: false });
    if (!user){
        res.status(404)
        throw new Error("User not found");
    }
    if (user.otp != otp) {
        res.status(400);
        throw new Error("Invalid OTP");
    }
    if ((Date.now() - user.createdAt) > (1000 * 180)){
        res.status(400);
        throw new Error("Time up, resend otp");
    }
    await UserModel.findOneAndUpdate({ email }, { active: true, createdAt: Date.now() });
      res.sendStatus(200);
    }
)



module.exports = { register, authUser, allUsers, verifyOtp };