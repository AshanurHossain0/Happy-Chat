const router=require('express').Router();
const protectRoute =require ('../middleware/auth');
const {accessChat,fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup}=require("../controllers/chatController.js")

router.route("/").post(protectRoute,accessChat)
router.route("/").get(protectRoute,fetchChat)
router.route("/group").post(protectRoute, createGroupChat);
router.route("/rename").put(protectRoute, renameGroup);
router.route("/groupremove").put(protectRoute, removeFromGroup);
router.route("/groupadd").put(protectRoute, addToGroup);

module.exports=router;