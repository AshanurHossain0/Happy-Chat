const asyncHandler = require('express-async-handler')
const UserModel = require('../models/userModel');
const generateToken = require('../config/generateToken.js');

const register = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the mandatory fields")
    }
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists")
    }
    const user = await UserModel.create({ name, email, password, pic });
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
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            // isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const allUsers= asyncHandler( async (req,res)=>{
    const searchQuery = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(searchQuery).find({ _id: { $ne: req.user._id } });
  res.status(200).send(users);
})



module.exports = { register,authUser,allUsers };