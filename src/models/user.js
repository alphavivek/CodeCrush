const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 20
        },
        lastName: {
            type: String,
            minLength : 3,
            maxLength: 20
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
            enum : {
                values : ["male","female","others"],
                message : `{VALUE} is not a valid gender type`,
            },
            // validate(value) {
            //     if (!["male", "female", "others"].includes(value)) {
            //         throw new Error("Gender data is not valid");
            //     }
            // },
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
            maxLength : 250
        },
        skills: {
            type: [String],
            trim : true,
            validate(value){
                if(value.length > 5) {
                    throw new Error("You can't store more than 5 skills!")
                }
            }
        }
    },
    {
        timestamps : true,
    }
)

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id : user._id }, "CODE@CRUSH$1579", {expiresIn: "1d"});   // jwt.sign({HEADER}, "PRIVATE KEY" , expireir time)
    
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}


// Model(User) is always starts with Capital Letter.
const User = mongoose.model("User", userSchema);

module.exports = User;