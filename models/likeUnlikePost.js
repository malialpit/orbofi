const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeUnlikePostSchema = new Schema({
  
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
    status:{
        type: String,
        default: "active",
      },
      is_deleted : {
        type : Boolean,
        default: false
      }
}, {timestamps: true});

module.exports = mongoose.model("like_unlike_post", likeUnlikePostSchema);