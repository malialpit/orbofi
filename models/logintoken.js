const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    token: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
    },
    last_login: {
        type: Date,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("logintoken", loginTokenSchema);