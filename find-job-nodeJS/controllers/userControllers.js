const appError = require("../utils/appError");
const User = require("./../models/userModel")
const catchAsync = require("./../utils/catchAsync")

const filterObj = function(body,...fields){
    const obj = {}
    Object.keys(body).forEach(el=>{
        if(fields.includes(el))  obj[el] = body[el]; 
    })
    return obj;
}

exports.getAllUsers = catchAsync( async(req,res,next)=>{

    const users = await User.find().select("photo role name email changedAt");

    res.status(200).json({
        status: "success",
        data : {
            users
        }
    })
})

exports.updateMe = catchAsync(async(req,res,next)=>{
    if(req.body.password || req.body.passwordConfirm){
        return next(new appError("please update your password with router /updateMyPassword",400))
    }
   //filtring the fields
    const filtredObj = filterObj(req.body,'name','email')

     if(req.file) filtredObj.photo = req.file.filename;

    const user = await User.findByIdAndUpdate(req.user._id,filtredObj,{new :true})

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

exports.deleteMe = catchAsync(async (req,res,next)=>{
    
    await User.findByIdAndUpdate(req.user._id,{active : false})

    res.status(201).json({
        status : "success",
        data: null
    })
})

exports.createUser =catchAsync( async(req,res)=>{

   const user  = await User.create(req.body)

    res.status(201).json({
        status : "success",
        user
    })
})

exports.updateUser =  catchAsync(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new appError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });


exports.deleteUser =  catchAsync(async (req, res, next) => {

  if(req.params.id === req.user.id){
    return next(new appError("you can't delete yourself",400))
  }
    const doc = await User.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.getUserDetails = catchAsync(async (req, res,next) => {
    const userId = req.user.id;

    const userDetails = await User.findById(userId);

    res.status(201).json({
        status: "success",
        data: {
            userDetails
        }
    });
  })