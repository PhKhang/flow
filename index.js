import express from 'express';
const app = express();
const port = 3000;
import expressHbs from 'express-handlebars';
const current_user = "Tran Nguyen Phuc Khang (@phkhang) • flow";
const current_username = "@phkhang";
import mongoose from 'mongoose';

import { getUser, getAllUsers } from "./api/controller/userController.js"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// connect to the atlas
await mongoose.connect(process.env.ATLAS_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + '/Pages'));
app.engine('hbs', expressHbs.engine({
    layoutDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
        eq: (a, b) => a === b,
        concat: (...args) => args.slice(0, -1).join(''),
    },
}));

app.use((req, res, next) => {
    res.locals.username = current_username;
    res.locals.current_username = current_username;
    res.locals.isCurrentUser = req.path.includes(`/profile/${current_username}`);
    next();
});
app.set('view engine', 'hbs');

app.get("/", (req, res) => {
    res.locals.title = "Home • flow";
    res.render('index', { currentPath: "/" });
});

app.get("/signin", (req, res) => {
    res.locals.title = "Sign in • flow";
    res.render('signin', { currentPath: "/signin", layout: 'layout-signin' });
});

app.get("/signup", (req, res) => {
    res.locals.title = "Sign up • flow";
    res.render('signup', { currentPath: "/signup", layout: 'layout-signin' });
});

app.get("/forgetpassword", (req, res) => {
    res.locals.title = "Forget Password • flow";
    res.render('forgetpassword', { currentPath: "/forgetpassword", layout: 'layout-signin' });
});

app.get("/resetpassword", (req, res) => {
    res.locals.title = "Reset Password • flow";
    res.render('resetpassword', { currentPath: "/resetpassword", layout: 'layout-signin' });
});

app.get("/notifications", (req, res) => {
    res.locals.title = "Activity • flow";
    res.render("notifications", { currentPath: "/notifications" });
});

app.get("/search", (req, res) => {
    res.locals.title = "Search • flow";
    res.render("search", { currentPath: "/search" });
});

app.get("/profile/:username", (req, res) => {
    const username = req.params.username;
    res.locals.title = `${username} • flow`;
    res.render("profile", { currentPath: `/profile/${username}`, username: username });
});

app.get("/post", (req, res) => {
    res.locals.title = "Post • flow";
    res.render("post", { currentPath: "/post" });
});

app.get("/api/all", async (req, res) => {

    const users = await getAllUsers();

    console.log("User count: ", users.length)

    res.send(users.length.toString());
});

app.get("/api/:name", async (req, res) => {
    // http://localhost:3000/api/john_doe
    const user = await getUser(req.params.name);
    if (user) {
        console.log(user);
    }
    else {
        console.log("User not found");
    }

    res.json(user);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
