const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "you must enter a name"],
    },
    email: {
        type: String,
        required: [true, "you must enter a email"],
        unique: true,
        lowerCase : true,
        validate : [validator.isEmail,"this is nota valid email"],
    },
    photo : {
        type: String,
        default: "default.jpg"
    },
    password: {
        type: String,
        required: [true, "you must enter a password"],
        minlength : [8,"password must be minimum of 8"],
        select : false,
    },
    passwordConfirm :{
        type: String,
        required: [true, "you must confirm your password"],
        validate : {
            validator: function(passwordConfirm){
                return passwordConfirm === this.password;
            },
            message: "passwords do not match"
        }
    },
    role:{
        type: String,
        enum: ['user','admin','HR'],
        default: 'user'
    },
    active : {
        type:Boolean,
        default: true
    },
    changedAt:{
        type:Date,
        default: Date.now()
    },
    resToken:String,
    expireToken: Date
})

userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next()
})

userSchema.pre('save',function(next){
    if(!this.isModified("password") || this.isNew) return next();

    this.changedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/,function(next){
    this.find({active : {$ne :false}})
    next();
})

userSchema.methods.correctPass = async function(condPass,hashPass){
    return await bcrypt.compare(condPass,hashPass)
};

userSchema.methods.passwordChangedAt = function(JWTTimestamp){
    const timeTransform = parseInt(this.changedAt.getTime() / 1000,10);
    if(this.changedAt){
        return JWTTimestamp < timeTransform
    }
    return false;
}

userSchema.methods.passwordRestToken =function(){

    const RToken = crypto.randomBytes(32).toString("hex");

    this.resToken = crypto.createHash('sha256').update(RToken).digest("hex");

    this.expireToken = Date.now() + ((10 * 60) * 1000);
    
    return RToken;
}
const User = mongoose.model("User",userSchema);

module.exports = User;