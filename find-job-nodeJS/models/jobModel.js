const mongoose = require("mongoose");
const app = require("./appModel")

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "you must enter a name"],
        // unique: true,
        trim: true,
        maxlength : [40,"name must be maximum of 40"],
        minlength : [10,"name must be minimum of 10"]
    },
    skills: {
        type:[String],
        required: [true, "you must add a skills"],
    },
    salary: {
        type: Number,
    },
    description: {
        type: String,
    },
    jobType: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    end_date: Date,
    posted_BY : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    active:{
        type:Boolean,
        default: true
    }
});

jobSchema.pre('remove', async function (next) {
    try {
      await app.deleteMany({ job: this._id });
      next();
    } catch (error) {
      next(error);
    }
  });

const Job = mongoose.model("Job", jobSchema);


module.exports = Job;
