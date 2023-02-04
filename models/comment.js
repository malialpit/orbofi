const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    post_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "post",
    },
    comment: {
        type: String,
        required: false,
    },
    // comment_by:[{
    //      reply: String,
    //      replay_by : {  type: Schema.Types.ObjectId, ref: "users",}
        
    // }],
    status:{
        type: String,
        default: "active",
      },
      is_deleted : {
        type : Boolean,
        default: false
      }
}, {timestamps: true});

module.exports = mongoose.model("comment", CommentSchema);