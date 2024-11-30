import express from "express"
const apiRouter = express.Router();
// const { init, showList, showDetails } = require('../controllers/blogController');

// apiRouter.use("/", () => { })
apiRouter.get("/", (req, res) => {
    res.send("API Route")
});
apiRouter.get("/:id", () => { });

export default apiRouter;