const appError = require("../utils/appError")

const handleJWTError = (err) => new appError("invalid token please log in again",401)

const handleJWTExpiredToken = (err) => new appError("your token is expired please login again wela bara nayek",401)

const sendDev = (err,res)=>{
    res.status(statusCode).json({
    stat : err.status,
    message : err.message,
    stack : err.stack,
    error :err,
    })
}
const sendProd = (err,res)=>{
if(err.isOperational){
    res.status(err.statusCode).json({
    stat : err.status,
    message : err.message
    })
}else{
    console.error("🛠⚒",err)
    res.status(500).json({
    status : "error",
    message : "something went wrong"
    })
}
}
module.exports = function(err,req,res,next){
    stat = err.status || 'faill';
    statusCode = err.statusCode || 500;
    message = err.message || "this is not alowed";

    if(process.env.NODE_ENV == "development"){
        sendDev(err,res)
    }
    else if(process.env.NODE_ENV == "production"){

        if(err.name == "JsonWebTokenError") err = handleJWTError(err)

        if(err.name == "TokenExpiredError") err = handleJWTExpiredToken(err)
        
        sendProd(err,res)

    }
    next();
}