const router=require('express').Router();
const {allMessages,sendMessage} =require('../controllers/messageController');
const protectRoute=require("../middleware/auth")

router.route('/').post(protectRoute,sendMessage);
router.route("/:chatId").get(protectRoute,allMessages);


module.exports=router;