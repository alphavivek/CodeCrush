const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt")
const { userauth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditPasswordData } = require("../utils/Validation");

profileRouter.get("/profile/view", userauth, (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

profileRouter.patch("/profile/edit", userauth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user; // req.user data - comes from database & req.body data - comes from request.

        Object.keys(req.body).forEach((key) => (
            loggedInUser[key] = req.body[key]
        ));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully!`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});


profileRouter.patch("/profile/password", userauth , async (req, res) => {
    try{
        if(!validateEditPasswordData(req)){
            throw new Error("Invalid Edit Request");
        }
        const hashPassword = await bcrypt.hash(req.body.password,10);

        const changePasswordUser = req.user;

        // Put hashPassword into DataBase
        changePasswordUser.password = hashPassword;

        // Save the updated data into database
        await changePasswordUser.save();

        res.json({
            message: `${changePasswordUser.firstName}, your password updated successfully!`,
            data: changePasswordUser
        });
        
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = profileRouter;