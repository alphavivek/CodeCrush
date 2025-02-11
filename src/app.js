const express = require("express");
const { userauth, adminauth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser")
const { validateSignUpData } = require("./utils/Validation");
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware
app.use(cookieparser());

app.post("/signup", async (req, res) => {
    // Creating a new Instance of the User model
    // const user = new User({
    //     firstName: "Prerna",
    //     lastName: "Dalal",
    //     age : 29,
    //     emailId : "Prerna@gmail.com",
    //     password : "Prerna@123",
    //     gender : "Female"
    // });

    try {
        // Validation of data 
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);


        // Creating a new Instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added Successfully!!");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId : emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isUserPassword = await user.validatePassword(password);
        if (isUserPassword) {
            // Create a JWT Token 
            const token = await user.getJWT();
            
            // Add the token to cookie and send the response back to the user 
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
              });
            res.send("Login Successful!!")
        }
        else {
            throw new Error("Invalid Credentials")
        }
    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get("/profile", userauth, async (req,res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/sendConnectionRequest", async (req,res)=> {
    try{
        console.log("Connection is Sent!")
        res.send("Sending Connection request.")
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

connectDB().then(() => {
    console.log("Database is connected successfully!!");
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT);
    });
}).catch((err) => {
    console.error("Database can't be connected!!");
})
