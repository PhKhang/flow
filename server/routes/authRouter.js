import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"
import bcrypt from "bcrypt";

import { fetchUserByEmail, fetchUserByUsername, addUser } from "../controller/userController.js";
const authRouter = express.Router()

authRouter.get("/", (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        console.log("No token")
        return res.status(401).json({ error: 'Not logged in' })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    console.log("Decoded token: ", decoded)
    console.log("Username: ", decoded.username)
    res.json(decoded)
});

const createToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            profile_pic_url: user.profile_pic_url,
            bio: user.bio,
            created_at: user.created_at,
            likes: user.likes,
        },
        process.env.SECRET_KEY,
        { expiresIn: '7d' });
}

authRouter.post("/signup", async (req, res) => {
    console.log(req.body)
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    console.log("Fetching user by username from router: ", username);

    let fetched = await fetchUserByUsername(username)
    if (fetched != null) {
        console.log("Username used: ", fetched)
        return res.status(409).json({ type: "username", error: "Username already used" })
    }

    fetched = await fetchUserByEmail(email)
    if (fetched != null) {
        console.log("Email used: ", fetched)
        return res.status(409).json({ type: "email", error: "Email used" })
    }

    console.log("Creating new user...")
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await addUser(username, email, hash)
    if (user == null) {
        console.log("Error creating user")
        return res.status(500).send("Error creating user")
    }
    console.log("User created: ", user)

    const token = createToken(user)
    console.log("Sending token: ", token)
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }).status(200).json({ status: "logged in" })
});

authRouter.post("/signin", async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await fetchUserByEmail(email)

    if (user == null) {
        console.log("User not found")
        return res.status(404).send("User not found")
    }

    console.log("User info: ", user)

    if (!bcrypt.compareSync(password, user.password_hash)) {
        console.log("Bad login")
        return res.status(401).send("Bad login")
    }

    console.log("Correct login")

    const token = createToken(user)
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }).status(200).json({ status: "logged in" })
});

authRouter.post("/logout", async (req, res) => {
    res.clearCookie("access_token").status(200).json({ message: "Logged out" })
})

export default authRouter;