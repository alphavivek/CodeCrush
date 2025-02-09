const mongoose = require("mongoose");
const validator = require('validator');

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
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("InValid Email address: " + value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a strong password: " + value);
                }
            },
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
            default: "https://www.pngall.com/wp-content/uploads/5/Profile-Male-Transparent.png",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid Photo URL : " + value);
                }
            },
        },
        about: {
            type: String,
            default: "This is a default about of the user",
            maxLength : 150
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