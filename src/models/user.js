const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3
        },
        lastName: {
            type: String,
            minLength : 3
        },
        emailId: {
            type: String,
            required: true,
            index: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            lowercase: true,
            trim: true,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            },
        },
        photoUrl: {
            type: String,
            default: "https://www.pngall.com/wp-content/uploads/5/Profile-Male-Transparent.png"
        },
        about: {
            type: String,
            default: "This is a default about of the user",
        },
        skills: {
            type: [String],
            trim : true
        }
    },
    {
        timestamps : true,
    }
)

const User = mongoose.model("User", userSchema);

module.exports = User;