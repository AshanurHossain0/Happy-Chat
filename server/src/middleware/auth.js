const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel.js")

const protectRoute = asyncHandler(async (req, res, next) => {
    let token = req.headers['x-auth-token']

    if (token) {
        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await UserModel.findById(decoded.id).select("-password");
            if (!req.user) {
                res.status(404);
                throw new Error("noUser");
            }

            next();
        } catch (error) {
            if(error.message==="noUser"){
                res.status(404);
                throw new Error("Your account is no longer exist");
            }
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = protectRoute;