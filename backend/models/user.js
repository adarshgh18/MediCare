const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    role: {
        type: String,
        enum: ["patient", "doctor", "admin"],
        default: "patient",
    },
}, {
    timestamps: true, //MongoDB automatically adds:createdAt ,updatedAt
});

// userSchema.plugin(passportLocalMongoose, {
//     usernameField: "email",
// });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;