import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"

const DecodeUserInfo = {};
DecodeUserInfo.decode = (req) => {
    const token = req?.cookies?.access_token;

    if (!token) {
        console.log("Decoder: No token")
        return null
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    console.log("Decoder: Decoded token: ", decoded)
    return decoded
}

export default DecodeUserInfo;