import jwt from "jsonwebtoken"
import dotenv from "dotenv/config" 

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        console.log("No token")
        return res.status(401).json(
            {
                error: 'Access denied'
            }
        )
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = decoded.userId
        console.log("Token accepted")
        next()
    }
    catch (error) {
        console.log("Wrong token")
        res.status(401).json({ error: 'Invalid token' });
    }
}

export {verifyToken}