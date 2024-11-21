

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  job: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Job'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  CV:String,
  applyDate:{
    type: Date,
    default: Date.now(),
  }
});

const app = mongoose.model('Application', applicationSchema);

module.exports = app;
