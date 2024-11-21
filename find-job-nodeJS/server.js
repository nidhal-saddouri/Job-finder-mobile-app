const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({
    path :'./config.env'
})
const app = require("./index")

//connecting with mongo atlas
// const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
// mongoose.connect(DB, {
//     useNewUrlParser : true,
//     useCreateIndex : true,
//     useFindAndModify : false,
//     useUnifiedTopology :true
// })

//connecting with local mongodb database

console.log(process.env.NODE_ENV)

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1',{
    useNewUrlParser : true,
     useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology :true
}).then(()=>{console.log("connected...\nmade with ❤\tby saddouri")}).catch(err=>{
console.log(err)
})

const port = process.env.PORT || 8000
app.listen(port,(e)=>{
    console.log("app work in port ",port)
})