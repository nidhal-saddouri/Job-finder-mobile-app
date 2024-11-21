const appError = require("../utils/appError");
const User = require("./../models/userModel")
const catchAsync = require("./../utils/catchAsync")
const app = require("../models/appModel")
const sendEmail = require("../utils/email");
const Job = require("../models/jobModel");
exports.create = catchAsync(async (req,res,next)=>{

    const obj = {
        user: req.user.id,
        job: req.params.id,
    }
    if(await app.exists(obj)){
        return next(new appError("you can't apply for 2 times the same job",400))
    }

    if(req.file) obj.CV = req.file.filename;

     const apps = await app.create(obj);
        res.status(200).json({
            status : "success",
            apps,
        })
})

exports.populateJob = catchAsync(async (req,res,next)=>{
console.log("ffff")
  let result = await app.find({ user: req.user.id, job: { $exists: true, $ne: null } })
    .populate({ path: 'job', match: { _id: { $exists: true } } })
    .lean();

    result = result.filter(app => app.job);
    console.log(result)
    res.status(200).json({
        result
    })
})


exports.populateUser = catchAsync(async (req,res,next)=>{

    const result = await app.find({job: req.params.id}).populate('user')
    
    res.status(200).json({
        result
    })
})

exports.updateStatus = catchAsync(async (req,res,next)=>{

    const result = await app.findByIdAndUpdate(req.params.id,{status : req.body.status},{new :true})

    if(!result){
        return next(new appError("error please try again this process", 404))
    }
    console.log(result)
    if(result.status === "Approved"){
    const changeJobToInactive = await Job.findByIdAndUpdate(result.job,{active : false})
    console.log(result)
}
    try {
        await sendEmail({
            email: req.body.email,
            subject: "HR RESULT",
            message:req.body.message
        })
    res.status(200).json({
        status : "success",
        result
    })}catch(err){
        return next(new appError("somthing went wrong ! please try again", 500))
    }
})