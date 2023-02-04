const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const intrestSchema = new Schema({
  intrest_category: {
      type: String,
      required: true,
  },
    intrest_name: [{
        type: String,
        required: true,
    }],
    status:{
        type: String,
        default: "active",
      },
      is_deleted : {
        type : Boolean,
        default: false
      }
}, {timestamps: true});

module.exports = mongoose.model("intrest", intrestSchema);