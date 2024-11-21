const { promisify } = require('util');
const crypto = require('crypto');
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const appError = require("../utils/appError");
const sendEmail = require("../utils/email");

const tokenGen = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.PERIOD });
}

const generateAndSendToken = (user, statC, res) => {

    const token = tokenGen(user._id)

    res.cookie("jwt",token,{
        expires: new Date(Date.now() + process.env.PERIODI * 24 * 60 * 60 *1000),
        httpOnly: false,
        sameSite :true
    })

    user.password = undefined

    res.status(statC).json({
        status: "success",
        token,
        data: {
            data: user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    generateAndSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //if the email or password not provided
    if (!email || !password) {
        return next(new appError("please provide your email and password", 400))
    }

    //check if the email and password exist
    const checkUser = await User.findOne({ email }).select("+password");

    if (!checkUser || !await checkUser.correctPass(password, checkUser.password)) {
        return next(new appError("email or password not correct", 400));
    }
    generateAndSendToken(checkUser, 201, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError("your are not othorized to access this route", 404))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const freshUser = await User.findById(decoded.id)

    if (!freshUser) {
        return next(new appError("your are not othorized to access this route", 404))
    }
    if (freshUser.passwordChangedAt(decoded.iat)) {
        next(new appError("please login again after you change your password", 404))
    }
    req.user = freshUser
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError("you are not othorized to access this route", 403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // check if the user alrady exist
    const userMail = await User.findOne({ email: req.body.email })

    if (!userMail) {
        return next(new appError("user not found", 404))
    }

    const restToken = userMail.passwordRestToken()
    userMail.save({ validateBeforeSave: false })
    const message = `http://localhost:4200/auth/rest-password/${restToken}`

    try {
        await sendEmail({
            email: userMail.email,
            subject: "Password Reset",
            message
        })
        res.status(200).json({
            status: "success",
            message: "password reset link sent to your email"
        })
    } catch (err) {
        userMail.expireToken = undefined;
        userMail.resToken = undefined;
        userMail.save({ validateBeforeSave: false })
        return next(new appError("somthing went wrong  ! please try again", 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // n9arnou el token eli 3nd el client b token eli sajelneha and compaire
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resToken: hashToken, expireToken: { $gt: Date.now() } })

    // if the token is valid
    if (!user) {
        return next(new appError("token is expired or user not found", 404))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.resToken = undefined;
    user.expireToken = undefined;
    await user.save()

    generateAndSendToken(user, 200, res)
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //find user from the collection
    const user = await User.findById(req.user.id).select("+password");
    if (! await user.correctPass(req.body.passwordCurrent, user.password)) {
        return next(new appError("please enter the valid password", 404))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    generateAndSendToken(user, 200, res)
})