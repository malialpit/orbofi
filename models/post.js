const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    file: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: false,
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

module.exports = mongoose.model("post", PostSchema);