const express = require("express");
const cors = require('cors');
const path = require('path');
const jobRouter = require("./routers/jobRouters")
const userRouter = require("./routers/userRouters")
const appError = require("./utils/appError")
const hadlerError = require("./controllers/errorController");
const helmet = require("helmet");
const appRouter = require("./routers/appRouter");
const cookieParser = require("cookie-parser");

const app = express()
app.use(helmet())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
     credentials: true
}));
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
app.use(express.json());
app.use(cookieParser())

// process.env.NODE_ENV = "production"
app.use(express.static(`public/user`))
app.use(express.static(`public/CV`))



app.use((req,res,next)=>{
    req.time = new Date().toISOString();
    next()
})

app.use("/api/v1/jobs",jobRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/app",appRouter);

app.all('*',(req,res,next)=>{
 next(new appError(`we dont find this endpoint ${req.originalUrl} in this server !`,404));
})

app.use(hadlerError)

module.exports = app