const express = require("express");
const { userauth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userauth, async (req,res)=> {
    try{
        console.log("Connection is Sent!")
        res.send("Sending Connection request.")
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = requestRouter;