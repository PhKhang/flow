import express from "express"
const apiRouter = express.Router();
import authRouter from "./authRouter.js"

apiRouter.get("/", (req, res) => {
    res.send("API Route")
});
apiRouter.use("/auth", authRouter);

export default apiRouter;