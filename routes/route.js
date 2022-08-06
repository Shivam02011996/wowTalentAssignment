const express=require('express')
const router=express.Router()

const userController=require("../controller/userController.js")
const {authentication, authorization} =require("../middleware/middleware.js")


router.post("/register",userController.registerUser)

router.post("/login",userController.loginUser)

router.get("/user/:userId/profile",authentication,authorization,userController.getProfile)

router.put("/user/:userId/profile",authentication,authorization, userController.updateProfile)

router.delete("/users/:userId/profile",authentication,authorization,userController.deleteProfile)


module.exports=router