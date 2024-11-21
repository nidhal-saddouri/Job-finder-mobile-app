const express = require("express")
const userController = require("./../controllers/userControllers")
const authController = require("./../controllers/authController")
const multerConfig = require("../utils/multerConfig")
const router = express.Router();

router.route("/signup").post(authController.signup)

router.route("/login").post(authController.login)

router.route("/forgotPassword").post(authController.forgotPassword)

router.route("/resetPassword/:token").patch(authController.resetPassword)

router.route("/updateMyPassword").patch(authController.protect,authController.updatePassword)

router.route("/updateMe").patch(authController.protect,multerConfig.uploadPicture.single("photo"),userController.updateMe)

router.route("/deleteMe").delete(authController.protect,userController.deleteMe)

router.route("/").get(userController.getAllUsers).post(userController.createUser);

router.route("/user-details").get(authController.protect,userController.getUserDetails)

router.route("/:id").patch(authController.protect,userController.updateUser).delete(authController.protect,userController.deleteUser);

module.exports = router