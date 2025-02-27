const express = require("express");
const { userauth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName"

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA); //  ["firstName", "lastName"] / "firstName lastName" this will return only two parameters but if dont give anything then it will return whole data from DB and that's a bad thing and it breaches the user data.
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
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

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
});

userRouter.get("/feed", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Find all the connection requests(send + received)
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },  // Array.from() this is use for converting set, objects into Array.
                { _id: { $ne: loggedInUser._id } },
            ]
        })
            .select(USER_SAFE_DATA + " about skills")
            .skip(skip)
            .limit(limit);

        res.json({users});
    } catch (err) {
        res.status(400).json({ message: "ERROR : " + err.message });
    }
});

module.exports = userRouter;