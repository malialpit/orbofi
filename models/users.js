const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:false,
  },
  email: {
    type: String,
    required: false,
  },
  // password: {
  //   type: String,
  //   required: false,
  // },
  country:[{
    type: String,
    required: false,
  }],
  intrest_id :[{
    type: Schema.Types.ObjectId,
        required: false,
        ref: "intrests",
  }],
  user_type :{
    type: String,
    required: false,
  },
  profile_picture : {
    type: String,
    required: false,
  },
  social_id :{
    type: String,
    default: null,
  },
  social_type :{
    type: String,
    default: null,
  },
  facebook : {
    type: Number,
    default: 0,
  },
  gmail : {
    type: Number,
    default: 0,
  },
  twitter : {
    type: Number,
    default: 0,
  },
  discord : {
    type: Number,
    default: 0,
  },
  last_login :{
      type: String,
      default: null,
    },
    token : {
      type: String,
      default: null,
    },
  status:{
    type: String,
    default: "active",
  },
  is_deleted : {
    type : Boolean,
    default: false
  }
})
module.exports = mongoose.model('users',userSchema)