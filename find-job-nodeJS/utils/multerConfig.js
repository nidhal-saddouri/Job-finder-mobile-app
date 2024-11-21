const multer = require("multer");
const appError = require("../utils/appError");


const PictureStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/user")
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split("/")[1]
        cb(null,`user-${req.user._id}-${Date.now()}.${ext}`)
    }
})

const CvStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/CV")
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split("/")[1]
        cb(null,`user-${req.user._id}-${Date.now()}.${ext}`)
    }
})



const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new appError("please upload only image",400))
    }
}

const uploadCV = multer({ storage: CvStorage,
    fileFilter : multerFilter
});
const uploadPicture = multer({ storage: PictureStorage,
    fileFilter : multerFilter
});

module.exports = { uploadCV, uploadPicture };