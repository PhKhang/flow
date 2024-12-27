import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import UserController from "../controller/userController.js";
import DecodeUserInfo from "../utils/decodeUserInfo.js";
const authRouter = express.Router()

authRouter.get("/", (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.log("No token")
    return res.status(401).json({ error: 'Not logged in' })
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY)
  console.log("Decoded token: ", decoded)
  console.log("Username: ", decoded.username)
  res.json(decoded)
});

const createToken = (user, time = '7d') => {
  return jwt.sign(
    {
      id: user.id,
      _id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      profile_pic_url: user.profile_pic_url,
      bio: user.bio,
      verified: user.verified,
      created_at: user.created_at
    },
    process.env.SECRET_KEY,
    { expiresIn: time });
}

authRouter.createToken = createToken;
authRouter.post("/signup", async (req, res) => {
  console.log(req.body)
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  if (username == "" || email == "" || password == "") {
    console.log("Missing fields")
    return res.status(400).json({ type: "missing", error: "Missing fields" })
  }

  if (username.length < 3 || username.length > 15 || username.match(/[^a-zA-Z0-9_]/)) {
    console.log("Invalid username")
    return res.status(400).json({ type: "username", error: "Username must be between 3 and 15 characters, alphanumerical and underscores" })
  }

  if (password.length < 8) {
    console.log("Password too short")
    return res.status(400).json({ type: "password", error: "Password must be at least 8 characters" })
  }

  if (req.body.password !== req.body.password1) {
    console.log("Passwords don't match")
    return res.status(400).json({ type: "password", error: "Passwords don't match" })
  }
  // console.log("Fetching user by username from router: ", username);

  let fetched = await UserController.fetchUserByUsername(username)
  if (fetched != null) {
    console.log("Username used: ", fetched)
    return res.status(409).json({ type: "username", error: "Username already used" })
  }

  fetched = await UserController.fetchUserByEmail(email)
  if (fetched != null) {
    console.log("Email used: ", fetched)
    return res.status(409).json({ type: "email", error: "Email used" })
  }

  console.log("Creating new user...")

  const user = await UserController.addUser(username, email, password)
  if (user == null) {
    console.log("Error creating user")
    return res.status(500).send("Error creating user")
  }
  console.log("User created: ", user)

  user.full_name = undefined
  user.password_hash = undefined
  user.profile_pic_url = undefined
  user.bio = undefined
  user.created_at = undefined

  const token = createToken(user, "10m")
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let link = `${process.env.FRONTEND_URL}/signin?token=${token}`
  let content = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flow - Reset password</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <!-- Wrapper table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <!-- Content table -->
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom: 40px;">
                <img src="https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/image.png?height=40&width=120" alt="Flow Logo" width="120" height="40" style="display: block; width: 120px; height: 40px;" />
              </td>
            </tr>
            <!-- Main Content -->
            <tr>
              <td bgcolor="#ffffff" style="padding: 40px; border-radius: 8px; box-shadow: 0px -6px 20px 5px rgba(0, 11, 56, 0.18);">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- Heading -->
                  <tr>
                    <td style="padding-bottom: 16px;">
                      <h1 style="margin: 0; font-size: 24px; color: #1a1a1a; font-weight: bold;">Verify your email</h1>
                    </td>
                  </tr>
                  <!-- Instructions -->
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p style="margin: 0; color: #666666; line-height: 1.5;">To confirm this email for your account, please follow the link below.</p>
                    </td>
                  </tr>
                  <!-- Code Box -->
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 24px; word-break: break-all; font-family: monospace">
                            <a href="${link}" style="color: #0066cc; text-decoration: underline;">${link}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Note -->
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p style="margin: 0; font-size: 14px; color: #888888;">If you didn't request an email confirmation, you can safely ignore this email.</p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="border-top: 1px solid #e9ecef; padding-top: 24px;">
                      <p style="margin: 0; text-align: center; color: #666666; font-size: 14px;">Flow, your brand new social</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const mailOptions = {
    to: email,
    subject: "Email Confirmation",
    text: `To confirm this email for your account, please follow the link bellow: ${process.env.FRONTEND_URL}/signin?token=${token}. If you didn't request an email confirmation, you can safely ignore this email.`,
    html: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      return res.status(500).send("Error sending email")
    } else {
      console.log("Email sent: ", info.response);
    }
  });

  res.redirect("/signin?verified=true")
});

authRouter.post("/signin", async (req, res) => {
  console.log("Sign in")
  const email = req.body.email
  const password = req.body.password

  if (email == "" || password == "") {
    console.log("Missing fields")
    return res.status(400).json({ type: "missing", error: "Missing fields" })
  }

  let user
  if (email.includes("@")) {
    user = await UserController.fetchUserByEmail(email)
  }
  else {
    user = await UserController.fetchBasicUserByUsername(email)
  }
  const queryToken = req.query.token

  if (queryToken) {
    console.log("Query token: ", queryToken)
    let decoded
    try {
      decoded = jwt.verify(queryToken, process.env.SECRET_KEY)
    }
    catch (error) {
      console.log("Invalid token")
      return res.status(401).send("Invalid token")
    }
    if (decoded == null) {
      return res.status(401).send("Invalid token")
    }

    user = await UserController.fetchUserByEmailAndVerify(decoded.email)
    const token = createToken(decoded)
    return res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    }).status(200).json({ status: "logged in" })
  }

  if (user == null) {
    console.log("User not found")
    return res.status(404).json({ type: "email", error: "Email or username does not exist" })
  }

  console.log("User info: ", user)

  if (!bcrypt.compareSync(password, user.password_hash)) {
    console.log("Bad login")
    return res.status(401).json({ type: "password", error: "Incorrect password" })
  }

  console.log("Correct login")

  const token = createToken(user)
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }).status(200).json({ status: "logged in" })
});

authRouter.get("/logout", async (req, res) => {
  console.log("Clear cookies")
  res.clearCookie("access_token").status(200).redirect("/signin")
})

authRouter.post("/reset", async (req, res) => {
  const email = req.body.email

  const user = await UserController.fetchUserByEmail(email)
  if (user == null) {
    return res.status(404).json({ type: "email", error: "Email does not exist" })
  }
  user.full_name = undefined
  user.profile_pic_url = undefined
  user.bio = undefined
  user.created_at = undefined

  // Send email with reset link
  const token = createToken(user)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // transporter.verify(function (error, success) {
  //     if (error) {
  //         console.log(error);
  //     } else {
  //         console.log("Server is ready to take our messages");
  //     }
  // });
  let link = `${process.env.FRONTEND_URL}/resetpassword?token=${token}`
  let content = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flow - Reset password</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <!-- Wrapper table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <!-- Content table -->
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom: 40px;">
                <img src="https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/image.png?height=40&width=120" alt="Flow Logo" width="120" height="40" style="display: block; width: 120px; height: 40px;" />
              </td>
            </tr>
            <!-- Main Content -->
            <tr>
              <td bgcolor="#ffffff" style="padding: 40px; border-radius: 8px; box-shadow: 0px -6px 20px 5px rgba(0, 11, 56, 0.18);">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- Heading -->
                  <tr>
                    <td style="padding-bottom: 16px;">
                      <h1 style="margin: 0; font-size: 24px; color: #1a1a1a; font-weight: bold;">Reset your password</h1>
                    </td>
                  </tr>
                  <!-- Instructions -->
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p style="margin: 0; color: #666666; line-height: 1.5;">To reset the password for your account, please follow the link below.</p>
                    </td>
                  </tr>
                  <!-- Code Box -->
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 24px; word-break: break-all; font-family: monospace">
                            <a href="${link}" style="color: #0066cc; text-decoration: underline;">${link}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Note -->
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p style="margin: 0; font-size: 14px; color: #888888;">If you didn't request a password reset, you can safely ignore this email.</p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="border-top: 1px solid #e9ecef; padding-top: 24px;">
                      <p style="margin: 0; text-align: center; color: #666666; font-size: 14px;">Flow, your brand new social</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
  const mailOptions = {
    to: email,
    subject: "Password Reset Request",
    text: `To reset the password of your account, please follow the link bellow: ${process.env.FRONTEND_URL}/resetpassword?token=${token}. If you didn't request an email confirmation, you can safely ignore this email.`,
    html: content,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      return res.status(500).send("Error sending email")
    } else {
      console.log("Email sent: ", info.response);
    }
  });


  res.redirect("/signin")
})

authRouter.post("/resetpassword", async (req, res) => {
  const token = req.query.token

  const password = req.body.password

  console.log("Token from query: ", token)
  const decoded = jwt.verify(token, process.env.SECRET_KEY)
  if (decoded == null) {
    return res.status(401).send("Invalid token")
  }

  const result = await UserController.editUser(decoded.id, { "new-password": password }, false)
  if (result == null) {
    return res.status(500).send("Error resetting password")
  }

  res.redirect("/signin")
})


authRouter.post("/edit", async (req, res) => {
  const user = DecodeUserInfo.decode(req);
  if (user == null) {
    return res.status(401).send("Not logged in")
  }

  const data = req.body
  if (data.username.trim() == user.username) {
    data.username = ""
  }
  const result = await UserController.editUser(user.id, data)
  if (result == null) {
    return res.status(500).json({ type: "password", error: "Password is wrong" })
  }

  if (result == "Username already exists") {
    return res.status(409).json({ type: "username", error: "Username already exists" })
  }

  const token = createToken(result)
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }).status(200).json({ status: "info changed" })
})

export default authRouter;