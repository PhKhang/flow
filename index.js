const express = require('express');
const app = express();
const port = 3000;
const expressHbs = require('express-handlebars');

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
    },
}));

app.set('view engine', 'hbs');

app.get("/", (req, res) => {
    res.locals.title = "Home • flow";
    res.render('index', {currentPath: "/"});
});

app.get("/notification", (req, res) => {
    res.locals.title = "Activity • flow";
    res.render("notification", {currentPath: "/notification"});
});

app.get("/profile", (req, res) => {
    res.locals.title = "Tran Nguyen Phuc Khang (@phkhang) • flow";
    res.render("profile", {currentPath: "/profile"});
});

app.get("/signin", (req, res) => {
    res.render("signin", {layout: false});
});

app.get("/signup", (req, res) => {
    res.render("signup", {layout: false});
});

app.get("/forgetpassword", (req, res) => {
    res.render("forgetpassword", {layout: false});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
