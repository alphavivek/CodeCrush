const express = require("express");
const { userauth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userauth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            res.status(400).json({ message: 'Incorrect status type: ' + status })
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists!" })
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();
        res.json({
            // message: "Connection request sent successfully",
            message: status === "interested" ?
                `${req.user.firstName} is ${status} in ${toUser.firstName}` :
                `${req.user.firstName} has ${status} ${toUser.firstName}`,
            data,
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed!" });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            fromUserId : requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection Request not found" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        res.json({
            message: "Connection request " + status,
            data,
        });
    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }
});

module.exports = requestRouter;