const express = require("express")
const appController = require("./../controllers/appController")
const authController = require("./../controllers/authController")
const router = express.Router();
const multerConfig = require("../utils/multerConfig")
// router.route("/").get(appController.test)
// router.param("id",jobController.checkID);




//populate the JOBS in the application
router.route("/jobs").get(authController.protect,appController.populateJob)

router.route("/users/:id").get(authController.protect,appController.populateUser)

router.route("/:id").patch(authController.protect,appController.updateStatus)

//create a new application with user and job
router.route("/:id").post(authController.protect,multerConfig.uploadPicture.single("CV"),appController.create)

module.exports = router