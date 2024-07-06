import 'dotenv/config'
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator"
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendEmail = (to, subject, html) => {
    let mailOptions = {
        from: 'campcnd17@gmail.com',
        to: to,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}
export const welcome = (req, res) => {
    res.json({ message: "Welcome to the abc" });
}
export const preRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.validate(email)) {
            return res.json({ error: "Invalid email" });
        }
        if (!password || password?.length < 6) {
            return res.json({ error: "Password should be at least 6 characters" })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ error: "Email is already registered" });
        }
        const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '1h' })
        sendEmail(email, "Pre-Registration", `<p>Please click the link below to activate your account.</p>
        <a href="${process.env.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
`)
        const emailSent = true;
        if (emailSent) {
            return res.json({ message: "Email sent" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" })
    }
}
export const register = async (req, res) => {
    try {
        const { email, password } = jwt.verify(req.body.token, process.env.JWT_SECRET);
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.json({ error: "Email is already registered" });
        }
        const hashedPassword = await hashPassword(password);
        const user = await new User({ username: nanoid(6), email, password: hashedPassword }).save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        user.password = undefined;
        user.resetCode = undefined;
        return res.json({ token, refreshToken, user });
    }
    catch (error) {
        console.log(error)
        return res.json({ error: "Invalid or expired token" });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "Invalid email or password" });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.password = undefined;
        user.resetCode = undefined;
        return res.json({ token, refreshToken, user });
    }
    catch (error) {
        console.log(error);
    }
}
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "Email not found" });
        }
        const resetCode = nanoid(6);
        user.resetCode = resetCode;
        await user.save();
        const token = jwt.sign({ resetCode }, process.env.JWT_SECRET, { expiresIn: '1h' });
        sendEmail(email, "Reset password", `<h1>Click on the link to reset password</h1>
                        <a href="${process.env.CLIENT_URL}/auth/access-account/${token}">Access my account</a>`)
        return res.json({ message: "Email sent" });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}
export const accessAccount = async (req, res) => {
    try {
        const { resetCode } = jwt.verify(req.body.resetCode, process.env.JWT_SECRET);
        const user = await User.findOne({ resetCode });
        if (!user) {
            return res.json({ error: "Invalid or expired token" });
        }
        console.log(user)
        user.resetCode = "";
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.password = undefined;
        user.resetCode = undefined;
        console.log(user)
        return res.json({ token, refreshToken, user });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Invalid or expired token" });
    }
}
export const refreshToken = async (req, res) => {
    try {
        const { _id } = jwt.verify(req.headers.refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(_id);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.password = undefined;
        user.resetCode = undefined;
        return res.json({ token, refreshToken, user });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Invalid or expired token" });
    }
}
export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);
    } catch (error) {
        console.log(error);
        return res.json({ error: "Unauthorized" });
    }
}
export const profile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        user.password = undefined;
        user.resetCode = undefined;
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.json({ error: "User not found" });
    }
}
export const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user._id);
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();
        return res.json({ message: "Password updated" });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Unauthorized" });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        user.password = undefined;
        user.resetCode = undefined;
        return res.json({ user });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Unauthorized" });
    }
}