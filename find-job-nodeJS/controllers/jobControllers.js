const Job = require("../models/jobModel")
const APIfeature = require("../utils/apiF")
const catchAsync = require("../utils/catchAsync")
const appError = require("../utils/appError")
const User = require("../models/userModel")


// exports.alias = (req, res, next) => {
//     req.query.limit = '5',
//     req.query.sort = '-ratingsAverege,price'
//     req.query.fields = 'name,price,ratingsAverege,summary'
//     next()
// }

//agrigation pipeline
// exports.jobStats = catchAsync(async (req, res) => {
//     const stats = await User.aggregate([
//         {
//             $group: {
//                 _id: '$role',
//                 numJob: { $sum: 1 }
//             }
//         },
//         {
//         }
//     ])
//     res.status(201).json({
//         status: 'success',
//         data: {
//             stats
//         }
//     })
// })

// get all job
exports.getAllJobs = catchAsync(async (req, res, next) => {
    const currentDate = new Date();

    const apiF = new APIfeature(Job.find({ active: { $ne: false },end_date: { $gte: currentDate }}), req.query).filtring()
    const totalDocs = await Job.countDocuments(apiF.query);
        apiF.sorting().limiting().pagination()
    const jobs = await apiF.query;
    const hasNext = apiF.limitXpage < totalDocs
    res.status(200).json({
        status: "success",
        totalDocs,
        time: req.time,
       hasNext,
        data: {
            jobs
        }
    })
});
//creat new job
exports.createJob = catchAsync(async (req, res, next) => {

    const newJob = await Job.create({
        title: req.body.title,
        salary: req.body.salary,
        skills: req.body.skills,
        jobType: req.body.jobType,
        description: req.body.description,
        end_date: req.body.end_date,
        posted_BY:req.user.id
    })

    res.status(201).json({
        status: 'success',
        data: {
            newJob
        }
    })
})
//retrive a specific job from the database
exports.getJob = catchAsync(async (req, res, next) => {
    const job = await Job.findById(req.params.id)
    if (!job) {
        return next(new appError("there is no job for this ID", 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            data: job
        }
    })
})
// update a specific job
exports.updateJob = catchAsync(async (req, res, next) => {

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!job) {
        return next(new appError("there is no job for this ID", 404))
    }
    res.status(201).json({
        status: "success",
        data: {
            job
        }
    })
})
// delete a specific job
exports.deleteJob = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) {
        return next(new appError("there is no job for this ID", 404))
    }

    res.status(204).json({
        status: 'success',
        data: {

        }
    })
})

exports.whoPost = catchAsync(async (req, res, next) => {

    const post = await Job.find({ posted_BY: req.user.id })

    const result = post.map(post => ({
        title: post.title,
        id: post._id,
        end_date: post.end_date
    }));
console.log(result);
    res.status(200).json({
            result
    })
});

