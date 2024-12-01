import express from "express"
import { getUser } from "../controller/userController.js";
const authRouter = express.Router();

authRouter.get("/", (req, res) => {
    res.send("Auth Route")
});

authRouter.post("/signup", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    
    if (getUser(username) != null)
        return res.status(409).send("Bad login")
    
    console.log("User info: ", username, password)
    
    res.send("Sign up")
});

authRouter.post("/signin", (req, res) => {
    res.send("Sign in")
});

export default authRouter;