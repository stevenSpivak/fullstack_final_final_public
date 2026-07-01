const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,

    email: {
        type: String,
        unique: true
    },

    password: String,

    seenBirds: {
        type: [String],
        default: []
    },

    wishlistBirds: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model("User", UserSchema);