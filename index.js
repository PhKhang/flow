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

import { addPost, getAllPosts, getFollowPosts, likePost, searchPosts } from './server/controller/postController.js';
import { getAllUsers, fetchUserByEmail } from './server/controller/userController.js';
import { followUser, getFollowers, getFollowing } from './server/controller/followController.js';
import { verifyToken } from './server/middleware/verifyToken.js';

const app = express();
const port = 3000;
const current_user = "Tran Nguyen Phuc Khang (phkhang) • flow";
const current_username = "phkhang";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
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

await mongoose.connect(process.env.ATLAS_URI);

app.get("/", async (req, res) => {
    res.locals.posts = await getAllPosts();
    res.locals.title = "Home • flow";
    res.render('index', { currentPath: "/" });
});

app.get("/following", async (req, res) => {
    res.locals.posts = await getFollowPosts("6744872f1e74c42b292cf196");
    res.locals.title = "Following • flow";
    res.render('index', { currentPath: "/index" });
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

app.get("/post", async (req, res) => {
    res.locals.posts = await getAllPosts();
    res.locals.title = "Post • flow";
    res.render("post", { currentPath: "/post" });
});

app.get("/server/all", async (req, res) => {
    const users = await getAllUsers();
    res.send(users.length.toString());
});

app.get("/server/:name", async (req, res) => {
    const user = await fetchUserByEmail(req.params.name);
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

const uploadFileToS3 = async (file) => {
    try {
        if (!file || !file.size) {
            throw new Error('No file provided');
        }
        const fileName = `${randomUUID()}-${file.name}`;
        const command = new PutObjectCommand({
            Bucket: "poro",
            Key: fileName,
            Body: await file.arrayBuffer(),
        });
        await s3Client.send(command);

        return {
            name: fileName,
            size: file.size,
            url: `https://pub-b62914ea73f14287b50eae850c46299b.r2.dev/${fileName}`,
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

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

//API
app.post('/uploadPost', async (req, res) => {
    try {
        if (!req.body.fileId) {
            const { authorId, caption } = req.body;
            try {
                await addPost(authorId, caption);
            }
            catch (error) {
                console.error('Error saving post:', error);
                return res.status(500).send({ success: false });
            }
            return res.status(200).send({ success: true });
        }
        else {
            const { authorId, caption, fileId } = req.body;
            const urls = [fileId];
            await addPost(authorId, caption, typeOfMedia, urls);
            return res.status(200).send({ success: true });
        }
    }
    catch (error) {
        return res.status(500).send({ success: false });
    }
});

//API
app.get('/followapi', async (req, res) => {
    try {
        const followers = await getFollowing("6744872f1e74c42b292cf196");
        console.log("Followers: ", followers);
    }
    catch (error) {
        console.error('Error following user:', error);
        return res.status(500).send({ success: false });
    }
    return res.status(200).send({ success: true });
});

//API
app.get('/likePost', async (req, res) => {
    try {
        const post = await likePost("674be85ad25f6193dd96dd27", "6744872f1e74c42b292cf201");
        console.log("Post liked: ", post);
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
    return res.status(200).send({ success: true });
});

//API
app.get('/searchPost', async (req, res) => {
    try {
        const posts = await searchPosts("Programmed screen");
        console.log(posts);
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
    return res.status(200).send({ success: true });
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
