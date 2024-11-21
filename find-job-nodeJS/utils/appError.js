class appError extends Error{
    constructor(message,statusCode){
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith(4) ? "faill" : "error";
        this.isOperational = true;
        
        Error.captureStackTrace(this,this.constructor);
    }
}


module.exports = appError;