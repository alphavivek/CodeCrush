const express = require("express");
const connectDB = require("./config/database");
const cookieparser = require("cookie-parser")
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB().then(() => {
    console.log("Database is connected successfully!!");
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT);
    });
}).catch((err) => {
    console.error("Database can't be connected!!");
})
