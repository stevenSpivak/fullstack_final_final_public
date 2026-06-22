const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(
    "mongodb://127.0.0.1:27017/birdspotter"
);

const UserSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String
});

const User = mongoose.model("User", UserSchema);

app.post("/signup", async (req, res) => {

    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
        return res.json({
            message: "Email already exists"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hash
    });

    await user.save();

    res.json({
        message: "Account created"
    });
});

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    const match = await bcrypt.compare(
        password,
        user.password
    );

    if (!match) {
        return res.json({
            success: false,
            message: "Incorrect password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id
        },
        "super-secret-key",
        {
            expiresIn: "7d"
        }
    );

    res.json({
        success: true,
        token,
        message: "Login successful"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});