import jwt from "jsonwebtoken"
import dotenv from "dotenv/config" 

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        console.log("No token")
        return res.redirect("/signin");
        // return res.status(401).json(
        //     {
        //         error: 'Access denied'
        //     }
        // )
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        console.log("Verification status", decoded.verified)
        if (!decoded.verified){
            console.log("User not verified 😂")
            return res.redirect("/signin");
        }
        
        // req.userId = decoded.userId
        console.log("Token accepted")
        next()
    }
    catch (error) {
        console.log("Wrong token");
        //res.status(401).json({ error: 'Invalid token' });
        res.redirect("/signin");
    }
}

export {verifyToken}