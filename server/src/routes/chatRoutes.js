const router=require('express').Router();
const protectRoute =require ('../middleware/auth');
const {accessChat,fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup}=require("../controllers/chatController.js")

router.route("/").post(protectRoute,accessChat)
router.route("/").get(protectRoute,fetchChat)
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports=router;