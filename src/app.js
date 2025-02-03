const express = require("express");
const { userauth, adminauth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware

app.post("/signup",async (req,res) => {
    // Creating a new Instance of the User model
    // const user = new User({
    //     firstName: "Prerna",
    //     lastName: "Dalal",
    //     age : 29,
    //     emailId : "Prerna@gmail.com",
    //     password : "Prerna@123",
    //     gender : "Female"
    // });

    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added Successfully!!");
    } catch(err){
        res.status(400).send("Error saving the user: " + err.message);
    }

});

app.get("/user", async(req , res) => {
    const useremailId = req.body.emailId;
    try{
        const userDetail = await User.find({ emailId : useremailId})
        if(userDetail.length === 0){
            res.status(404).send("User not found")
        }
        res.send(userDetail);
    }catch(err){
        res.status(400).send("something went wrong.");
    }
});

// delete a user from the database
app.delete("/user", async(req , res) => {
    const userId = req.body.userId;
    try{
        // console.log(userId);
        const deleteuser = await User.findByIdAndDelete({_id: userId});
        res.send("User data deleted successfully");
    }catch(err){
        res.status(400).send("something went wrong.");
    }
});

// Update user of the database through _id
app.patch("/user", async(req , res) => {
    const userId = req.body.userId;
    const data = req.body;
    console.log(data);
    try{
        await User.findByIdAndUpdate({_id : userId}, data);
        res.send("User data updated successfully");
    }catch(err){
        res.status(400).send("something went wrong.");
    }
});

// Update user of the database through emailId
app.patch("/useremail", async(req, res) => {
    const email = req.body.email;
    const data = req.body;
    console.log(email);
    console.log(data);
    
    try{
        await User.findOneAndUpdate({emailId : email}, data)
        res.send("Data Updates Successfully")
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.get("/feed", async(req , res) => {
    try{
        const userallDetail = await User.find({})
        if(userallDetail.length === 0){
            res.status(404).send("User not found")
        }
        res.send(userallDetail);
    }catch(err){
        res.status(400).send("something went wrong.");
    }
});


connectDB().then(()=>{
    console.log("Database is connected successfully!!");
    app.listen(PORT,()=>{
        console.log("Server is listening on port "+ PORT);
    });
}).catch((err)=>{
    console.error("Database can't be connected!!");
})
