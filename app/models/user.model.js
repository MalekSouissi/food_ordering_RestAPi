const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        phone: String,
        password: String,
        /* active: { type: Boolean, default: false },
         resetPasswordToken: { type: String, default: null },
         resetPasswordExpires: { type: Date, default: null },
         emailToken: { type: String, default: null },
         emailTokenExpires: { type: Date, default: null },*/
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;