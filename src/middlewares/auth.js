const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userauth = async (req, res, next) => {
    try {
        // Read the token from the req cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json("Please Login.")
        }

        // Validate the token
        const decodedObj = await jwt.verify(token, "CODE@CRUSH$1579");

        // Find the user
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
}

module.exports = { userauth };