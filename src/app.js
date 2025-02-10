const express = require("express");
const { userauth, adminauth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser")
const jwt = require("jsonwebtoken");
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

        const isUserPassword = await bcrypt.compare(password, user.password);
        if (isUserPassword) {
            // Create a JWT Token 
            const token = await jwt.sign({ _id : user._id }, "CODE@CRUSH$1579");   // jwt.sign({HEADER}, "PRIVATE KEY")
            
            // Add the token to cookie and send the response back to the user 
            res.cookie("token", token);
            res.send("Login Successful!!")
        }
        else {
            throw new Error("Invalid Credentials")
        }
    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});


app.get("/profile", async (req,res) => {
    try{
        const cookies = req.cookies;
        const { token } = cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
    
        // Validate my token
        const decodedMessage = await jwt.verify(token , "CODE@CRUSH$1579");
        // console.log(decodedMessage._id);

        const user = await User.findById(decodedMessage._id);
        if(!user){
            throw new Error("User does not exist");
        }
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get("/user", async (req, res) => {
    const useremailId = req.body.emailId;
    try {
        const userDetail = await User.find({ emailId: useremailId })
        if (userDetail.length === 0) {
            res.status(404).send("User not found")
        }
        res.send(userDetail);
    } catch (err) {
        res.status(400).send("something went wrong.");
    }
});

// delete a user from the database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        // console.log(userId);
        const deleteuser = await User.findByIdAndDelete({ _id: userId });
        res.send("User data deleted successfully");
    } catch (err) {
        res.status(400).send("something went wrong.");
    }
});

// Update user of the database through _id
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    console.log(data);
    try {
        const Allowed_Updates = ["userId", "skills", "gender", "age", "photoUrl", "about"];
        const isUpdatedAllowed = Object.keys(data).every((key) =>
            Allowed_Updates.includes(key)
        );

        if (!isUpdatedAllowed) {
            throw new Error("Updated not allowed");
        }

        if (data?.skills?.length > 5) {
            throw new Error("Skills can't be more than 5.")
        }

        await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true
        });
        res.send("User data updated successfully");
    } catch (err) {
        res.status(400).send("Update Failed : " + err.message);
    }
});

// Update user of the database through emailId
app.patch("/useremail", async (req, res) => {
    const email = req.body.email;
    const data = req.body;
    console.log(email);
    console.log(data);

    try {
        await User.findOneAndUpdate({ emailId: email }, data)
        res.send("Data Updates Successfully")
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.get("/feed", async (req, res) => {
    try {
        const userallDetail = await User.find({})
        if (userallDetail.length === 0) {
            res.status(404).send("User not found")
        }
        res.send(userallDetail);
    } catch (err) {
        res.status(400).send("something went wrong.");
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
