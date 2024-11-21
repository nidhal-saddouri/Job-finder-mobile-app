const express = require("express")
const jobController = require("./../controllers/jobControllers")
const authController = require("../controllers/authController")
const router = express.Router();

// router.param("id",jobController.checkID);

// router.route("/top-5").get(jobController.alias,jobController.getAllJobs)

// router.route("/job-stats").get(jobController.jobStats)

router.route("/").get(authController.protect,jobController.getAllJobs).post(authController.protect,jobController.createJob);

router.route("/:id").delete(authController.protect,jobController.deleteJob)

router.route("/myPost").get(authController.protect,jobController.whoPost);

router.route("/:id").get(jobController.getJob).patch(jobController.updateJob).delete(authController.protect,authController.restrictTo('admin','RH'),jobController.deleteJob);

module.exports = router