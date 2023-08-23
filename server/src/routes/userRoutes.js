const router=require('express').Router();
const {register,authUser} =require('../controllers/userController')

router.route('/').post(register);
router.route('/login').post(authUser);


module.exports=router;