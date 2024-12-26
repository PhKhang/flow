import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv/config';
import express from 'express';
import expressHbs from 'express-handlebars';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes/apiRouter.js';
import postRouter from './server/routes/postRouter.js';

import { addPost, getAllPosts, getFollowPosts, getPostsByAuthor, likePost, searchPosts, getAllPostsPagination, getFollowPostsPagination, getUserPostsPagination } from './server/controller/postController.js';
import UserController from './server/controller/userController.js';
import { getNotificationsById, getUnreadNotifications, getAllNotificationsOfUser } from './server/controller/notificationController.js';
import Follow from './server/model/follow.js';
import { getAllFoundUsers, getAllFoundPosts } from './server/controller/searchController.js';
import { verifyToken } from './server/middleware/verifyToken.js';
import DecodeUserInfo from './server/utils/decodeUserInfo.js';
import { type } from 'os';
import User from './server/model/user.js';

const app = express();
const port = 3000;
const current_user = "Tran Nguyen Phuc Khang (phkhang) • flow";
const current_username = "undefined";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allowedOrigins = ["http://localhost:3000", "https://flow-social-media.onrender.com"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg =
                "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Cho phép gửi cookie
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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
            return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        },
        eq: (a, b) => a === b,
        not: (value) => !value,
        concat: (...args) => args.slice(0, -1).join(''),
        string: (value) => String(value),
        or: (a, b) => a || b, // Custom helper to check for empty strings
    },
}));

app.use((req, res, next) => {
    let user = DecodeUserInfo.decode(req);
    res.locals.username = user?.username || current_username;
    res.locals.currentUserId = user?.id || null;
    res.locals.current_username = user?.username || current_username;
    res.locals.isCurrentUser = req.path.includes(`/profile/${user?.username || current_username}`);
    next();
});

app.set('view engine', 'hbs');

await mongoose.connect(process.env.ATLAS_URI);

app.get("/", verifyToken, async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.render('signin', { currentPath: "/signin", layout: 'layout-signin' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const posts = await getAllPostsPagination(decoded.id, 10, 0);
        res.locals.posts = posts;
        res.locals.user = await User.findById(decoded.id);
        res.locals.title = "Home • flow";
        res.render('index', { currentPath: "/" });
    } catch (error) {
        console.error('Error rendering home page:', error);
        res.status(500).send('Error loading home page');
    }
});

app.use('/post', postRouter);

app.get("/post", async (req, res) => {
    res.locals.title = "Post • flow";
    res.render("post", { currentPath: "/post" });
});

app.get("/following", async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.render('signin', { currentPath: "/signin", layout: 'layout-signin' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const posts = await getFollowPostsPagination(decoded.id, 10, 0);
        res.locals.posts = posts;
        res.locals.user = await User.findById(decoded.id);
        res.locals.title = "Home following • flow";
        res.render('index', { currentPath: "/following" });
    } catch (error) {
        console.error('Error rendering home following page:', error);
        res.status(500).send('Error loading home following page');
    }
});

app.get("/signin", (req, res) => {
    res.locals.title = "Sign in • flow";
    let instruction = ""
    if (req.params.verified){
        instruction = "Check your mail to activate your account. The link will expire in 10 minutes."
    }
    res.render('signin', { currentPath: "/signin", layout: 'layout-signin', instruction});
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

app.get("/notifications", async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        console.log("No token");
        return res.redirect("/signin"); // Redirect to /signin if not logged in
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        res.locals.notifications = await getAllNotificationsOfUser(decoded.id);
        res.locals.title = "Activity • flow";
        res.locals.user = decoded;
        res.render("notifications", { currentPath: "/notifications" });
    } catch (error) {
        console.error("Error verifying token or fetching notifications:", error);
        return res.redirect("/signin"); // Redirect to /signin if token verification fails
    }
});

app.get('/search', async (req, res) => {
    var { keyword, category } = req.query;
    if (!category) {
        category = 'user';
    }
    const token = req.cookies.access_token;

    if (!token) {
        console.log("No token");
        return res.redirect("/signin");
    }

    res.locals.title = "Search • flow";

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        let results = [];

        if (!keyword) {
            return res.render('search', {
                keyword,
                category,
                results,
                user: decoded,
                currentPath: '/search',
            });
        }

        if (category === 'user') {
            results = await getAllFoundUsers(decoded.id, keyword);
        } else if (category === 'post') {
            results = await getAllFoundPosts(decoded.id, keyword);
        }
        res.render('search', {
            keyword,
            category,
            results,
            user: decoded,
            currentPath: '/search',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/profile/", verifyToken, async (req, res) => {
    let user = DecodeUserInfo.decode(req);
    console.log("Current profile: ", user);
    user = await UserController.fetchUserByUsername(user.username, user.id);

    res.redirect(`/profile/${user.username}`);
});

app.get("/profile/:username", verifyToken, async (req, res) => {
    let user = DecodeUserInfo.decode(req);
    let currentUserId = user.id;
    if (!user) {
        return res.status(404).send("Not logged in");
    }

    user = await UserController.fetchUserByUsername(req.params.username, currentUserId);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const posts = await getUserPostsPagination(user._id, 10, 0);
    const isFollowing = await Follow.findOne({ follower_id: currentUserId, following_id: user._id });
    user.isFollowed = !!isFollowing;
    res.locals.posts = posts;
    res.locals.title = `${user.username} • flow`;
    res.render("profile", { currentPath: `/profile/${user.username}`, user: user });
});

app.get("/post", async (req, res) => {
    res.locals.posts = await getAllPosts();
    res.locals.title = "Post • flow";
    res.render("post", { currentPath: "/post" });
});

app.get("/server/all", async (req, res) => {
    const users = await UserController.getAllUsers();
    res.send(users.length.toString());
});

app.get("/server/:name", async (req, res) => {
    const user = await UserController.fetchUserByEmail(req.params.name);
    if (user) {
        console.log(user);
    } else {
        console.log("User not found");
    }
    res.json(user);
});

app.get("/auth", verifyToken, (req, res) => {
    res.send("Hello world, programmed to work but not to feel");
});

const s3Client = new S3Client({
    credentials: fromEnv(),
    endpoint: "https://fd0314cb84aca3240521990fc2bb803c.r2.cloudflarestorage.com",
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'flow',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
    }),
});

//API
app.post('/uploadImg', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(req.file.key);
    return res.status(200).send({ filename: `https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/${req.file.key}` });
});



// Sample
app.get("/send", (req, res) => {
    const token = req.cookies.access_token
    if (!token) {
        console.log("No token")
        return res.status(401).json({ error: 'Not logged in' })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const message = req.query.message;
    console.log(decoded.username)
    console.log("message: ", message)

    res.send("send: " + message);
});

app.use('/api', apiRouter);

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).render('404', { currentPath: req.path });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
