const express = require("express");
const { userauth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName"); //  ["firstName", "lastName"] / "firstName lastName" this will return only two parameters but if dont give anything then it will return whole data from DB and that's a bad thing and it breaches the user data.
        // Ref and populate are same as Join in MySQL

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        res.status(400).json({ message: "ERROR : " + err.message });
    }
});

userRouter.get("/user/connections", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionAccepted = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", "firstName lastName")
            .populate("toUserId", "firstName lastName");

            console.log(connectionAccepted);

        const data = connectionAccepted.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message: "Connection accepted",
            data: data
        })
    } catch (err) {
        res.status(400).json({ message: "ERROR : " + err.message });
    }
})

module.exports = userRouter;