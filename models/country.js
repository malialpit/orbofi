const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  country_name: {
      type: String,
      required: true,
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

module.exports = mongoose.model("country", countrySchema);