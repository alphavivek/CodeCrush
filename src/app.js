const express = require("express");
const connectDB = require("./config/database");
const cookieparser = require("cookie-parser")
const app = express();
const PORT = 3000;
const cors = require("cors");

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json()); // Middleware
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
    console.log("Database is connected successfully!!");
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT);
    });
}).catch((err) => {
    console.error("Database can't be connected!!");
})
