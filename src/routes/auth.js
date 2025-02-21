const express = require("express");
const { validateSignUpData } = require("../utils/Validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req,res)=>{
    try{
        // Validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
        // Encrypt the password
        const hashPassword = await bcrypt.hash(password,10);

        // Creating a new Instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : hashPassword
        })
        await user.save();
        res.send("User added successfully!");
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/login" , async (req,res)=>{
    try{
        const { emailId,  password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user) {
            throw new Error("Invalid Credentials🥲");
        }
        const isUserPassword = await user.validatePassword(password);
        if(isUserPassword){
            // Create a JWT Token 
            const token = await user.getJWT();

            // Add the token to cookie and send the response back to the user 
            res.cookie("token",token, {
                expires : new Date(Date.now() + 8 * 3600000)  // cookie will be removed after 8 hours
            });
            res.send(user);
        }
        else{
            throw new Error("Invalid Credentials🥲");
        }
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});


authRouter.post("/logout", async (req, res) => {
    // res.cookie("cookie name", "cookie/token value" , OBJECT(optional) like expire,httponly,etc.)
    res.cookie("token", null, {
        expires : new Date(Date.now()),
    })

    res.send("logout successfully");
});

module.exports = authRouter;