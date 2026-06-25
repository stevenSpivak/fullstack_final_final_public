require('dotenv').config();

const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.mqueocn.mongodb.net/birdspotter`
)
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", UserSchema);

app.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Account created successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            token,
            username: user.username,
            message: "Login successful"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

app.get("/", (req, res) => {
    res.send("BirdSpotter API is running");
});

app.listen(process.env.PORT, () => {
    console.log(
        `Server running on http://localhost:${process.env.PORT}`
    );
});

const birdTips = [
    "Birds are most active during the early morning.",
    "Move slowly and avoid sudden movements.",
    "Listen for calls before looking for birds.",
    "Wear earth-toned clothing.",
    "Learn common local bird songs.",
    "Bring water and stay quiet.",
    "Watch edges between forest and open areas.",
    "Use binoculars before approaching birds.",
    "Keep the sun behind you.",
    "Be patient and remain still."
];

const binoculars = [
    {
        name: "Vortex Diamondback HD 8x42",
        description: "Excellent value and image quality."
    },
    {
        name: "Nikon Prostaff P3 8x42",
        description: "Lightweight beginner binocular."
    },
    {
        name: "Celestron Nature DX 8x42",
        description: "Budget friendly birding binocular."
    },
    {
        name: "Athlon Midas UHD 8x42",
        description: "Very sharp optics."
    },
    {
        name: "Opticron Explorer WA ED-R 8x42",
        description: "Wide field of view."
    }
];

function randomItems(arr, count) {

    const shuffled = [...arr]
        .sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
}
app.get("/api/home-content", async (req, res) => {

    try {

        const country = req.query.country || "IL";

        const hotspotResponse = await axios.get(
            `https://api.ebird.org/v2/ref/hotspot/${country}`,
            {
                headers: {
                    "X-eBirdApiToken": process.env.EBIRD_API_KEY
                },
                params: {
                    fmt: "json"
                }
            }
        );
        const hotspots =
            hotspotResponse.data
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(h => ({
                    name: h.locName,
                    maps:
                        `https://www.google.com/maps?q=${h.lat},${h.lng}`
                }));

        res.json({
            tip:
                birdTips[
                    Math.floor(
                        Math.random() *
                        birdTips.length
                    )
                ],

            binoculars:
                randomItems(binoculars, 2),

            hotspots
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            message:
                "Could not get bird data."
        });

    }

});
