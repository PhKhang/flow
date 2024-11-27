const express = require('express');
const app = express();
const port = 3000;
const expressHbs = require('express-handlebars');
const current_user = "Tran Nguyen Phuc Khang (@phkhang) • flow";
const current_username = "@phkhang";

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
    res.locals.isCurrentUser = req.path.includes(`/profile/${current_username}`);
    next();
});

app.set('view engine', 'hbs');

app.get("/", (req, res) => {
    res.locals.title = "Home • flow";
    res.render('index', {currentPath: "/"});
});

app.get("/signin", (req, res) => {
    res.locals.title = "Sign in • flow";
    res.render('signin', {currentPath: "/signin", layout: false});
});

app.get("/signup", (req, res) => {
    res.locals.title = "Sign up • flow";
    res.render('signup', {currentPath: "/signup", layout: false});
});

app.get("/forgetpassword", (req, res) => {
    res.locals.title = "Forget Password • flow";
    res.render('forgetpassword', {currentPath: "/forgetpassword", layout: false});
});

app.get("/notifications", (req, res) => {
    res.locals.title = "Activity • flow";
    res.render("notifications", {currentPath: "/notifications"});
});

app.get("/search", (req, res) => {
    res.locals.title = "Search • flow";
    res.render("search", {currentPath: "/search"});
});

app.get("/profile/:username", (req, res) => {
    const username = req.params.username;
    res.locals.title = `${username} • flow`;
    res.render("profile", {currentPath: `/profile/${username}`, username: username});
});

app.get("/post", (req, res) => {
    res.locals.title = "Post • flow";
    res.render("post", {currentPath: "/post"});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
