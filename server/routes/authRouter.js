import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"
import bcrypt from "bcrypt";

import { fetchUserByEmail, fetchUserByUsername, addUser } from "../controller/userController.js";
const authRouter = express.Router()

authRouter.get("/", (req, res) => {
    res.send("Auth Route")
});

authRouter.post("/signup", async (req, res) => {
    console.log(req.body)
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    
    console.log("Fetching user by username from router: ", username);

    let fetched = await fetchUserByUsername(username)
    if (fetch != null){
        console.log("Username used: ", fetched)
        return res.status(409).send("Username used")
    }

    fetched = await fetchUserByEmail(email)
    if (fetched != null){
        console.log("Email used: ", fetched)
        return res.status(409).send("Email used")
    }

    console.log("Creating new user...")
    return res.render("signup", {
        error: "Error creating user",
        layout: 'layout-signin' 
    })
    const salt = bcrypt.genSaltSync(420);
    const hash = bcrypt.hashSync(password, salt);
    
    const user = await addUser(username, email, hash)
    if (user == null) {
        console.log("Error creating user")
        return res.status(500).send("Error creating user")
    }
    
    const token = jwt.sign(
        {
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
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }).status(200) 
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

    const token = jwt.sign(
        {
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
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }).status(200)
});

authRouter.post("/logout", async (req, res) => {
    res.clearCookie("access_token").status(200).json({ message: "Logged out" })
})

export default authRouter;