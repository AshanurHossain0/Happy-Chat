const router=require('express').Router();
const {register,authUser,allUsers,verifyOtp} =require('../controllers/userController');
const protectRoute=require("../middleware/auth")

router.route('/').post(register).get(protectRoute,allUsers);
router.route('/login').post(authUser);
router.route('/verify').post(verifyOtp);


module.exports=router;