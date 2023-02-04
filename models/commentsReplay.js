const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsReplaySchema = new Schema({
  
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",  //Replay by
    },
    comment_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "comments",
    },
    replay: {
        type: String,
        required: false,
    },
      is_deleted : {
        type : Boolean,
        default: false
      }
}, {timestamps: true});

module.exports = mongoose.model("comments_replay", CommentsReplaySchema);